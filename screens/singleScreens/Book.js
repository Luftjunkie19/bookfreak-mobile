import React, {
  useEffect,
  useState,
} from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { FAB } from 'react-native-paper';
import { useSelector } from 'react-redux';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
  ChevronDownIcon,
  ChevronUpIcon,
  Link,
  LinkText,
} from '@gluestack-ui/themed';
import { useTheme } from '@ui-kitten/components';

import {
  accColor,
  modalPrimeColor,
  primeColor,
} from '../../assets/ColorsImport';
import alertMessages from '../../assets/translations/AlertMessages.json';
import translations from '../../assets/translations/BookPageTranslations.json';
import reuseableTranslations
  from '../../assets/translations/ReusableTranslations.json';
import BookRecensions from '../../components/BookComponents/BookRecensions';
import LikersModal from '../../components/BookComponents/LikersModal';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';
import { useSnackbarContext } from '../../hooks/useSnackbarContext';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-9822550861323688~6900348989';
const { getName } = require('country-list');
const Book = ({route, navigation}) => {
  const {id}= route.params;
  const {dispatch}=useSnackbarContext();
  const { removeFromDataBase, addToDataBase, updateDatabase } =
  useRealDatabase();
  const {user}=useAuthContext();
  const [isPending, setIsPending]=useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const {document}=useGetDocument('books', id);
  const [changeState, setChangeState]=useState({
    open:false,
  });
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const [openedModal, setOpenedModal]=useState(false);
  const {documents:likers}=useGetDocuments("lovedBooks");
  const {documents: recensions}=useGetDocuments(`bookRecensions/${id}/recensions`);
  const {documents:readersObjects}=useGetDocuments("bookReaders");
const {getDocument}=useRealtimeDocument();
  const readers=readersObjects.map((bookReader) => {
    return bookReader.readers;
  }).map((obj) => {
    const nestedObject = Object.values(obj);
    return nestedObject;
  }).flat();

  
  const {documents: membersObjects}=useGetDocuments('communityMembers');
  const competitionsMembers= membersObjects.map((communityMember) => {
    return communityMember.users;
  }).map((member) => {
    return Object.values(member);
  }).flat();


  const onStateChanged=()=>{
    setChangeState({open:!changeState.open});
  }



  const publishRecension = (recension, bookRate) => {
    if (recension.trim("").length < 10) {
      dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.wrong.recensionLonger[selectedLanguage]}`, alertType:"error"}});
      return;
    }

    if(bookRate===0){
      dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.wrong.selectAnything[selectedLanguage]}`, alertType:"error"}});
      return;
    }

    addToDataBase("bookRecensions", `${id}/recensions/${user.uid}`, {
      recensionedBook: id,
      bookRate: bookRate,
      recension: recension,
      displayName: user.displayName,
      email: user.email,
      id: user.uid,
      photoURL: user.photoURL,
      dateOfFinish: new Date().getTime(),
    });

    const readerObject = readers.find(
      (reader) => reader.id === user.uid && reader.bookReadingId === id
    );

    updateDatabase(
      { ...readerObject, recension: recension },
      "bookReaders",
      `${id}/readers/${user.uid}`
    );
  };





  const getCompetitionMembers = () => {
    const userCompetitions = competitionsMembers
      .filter((doc) => doc.value.id === user.uid)
      .map((communityMember) => communityMember.belongsTo);

    let result = [];
    let visitedCompetitions = [];

    while (userCompetitions.length > 0) {
      const currentCompetition = userCompetitions.pop();

      if (!visitedCompetitions.includes(currentCompetition)) {
        const membersInCurrentCompetition = competitionsMembers.filter(
          (member) => member.belongsTo === currentCompetition
        );

        result = result.concat(membersInCurrentCompetition);

        const newMembersCompetitions = membersInCurrentCompetition
          .filter((member) => !visitedCompetitions.includes(member.belongsTo))
          .map((member) => member.belongsTo);

        userCompetitions.push(...newMembersCompetitions);
        visitedCompetitions.push(currentCompetition);
      }
    }

    result = result.filter(
      (value, index, self) =>
        self.findIndex((m) => m.value.id === value.value.id) === index
    );

    return result.filter((member) => member.value.id !== user.uid);
  };

  const changeLoveState = async () => {
    const likerDoc = await getDocument("lovedBooks", `${id}-${user.uid}`);

    if (!likerDoc) {
      addToDataBase("lovedBooks", `${id}-${user.uid}`, {
        displayName: user.displayName,
        lovedBookId: id,
        lovedBy: user.uid,
        photoURL: user.photoURL,
      });

      getDocument("likesData", id).then((data) => {
        updateDatabase(
          {
            likesAmount: data.likesAmount + 1,
          },
          "likesData",
          id
        );
      });
    } else {
      removeFromDataBase("lovedBooks", `${id}-${user.uid}`);
      getDocument("likesData", id).then((data) => {
        updateDatabase(
          {
            likesAmount: data.likesAmount - 1,
          },
          "likesData",
          id
        );
      });
    }
  };

  const clickDelete = () => {
    setIsPending(true);

    removeFromDataBase("books", id);
    dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.successfull.remove[selectedLanguage]}`, alertType:"success"}});
    setIsPending(false);
  };

  const removeFromShelf = () => {
    if(readers.filter((doc)=>doc.bookReadingId===id).length === 1){
      removeFromDataBase(`bookReaders`, `${id}`);
    }else{
      removeFromDataBase(`bookReaders`, `${id}/readers/${user.uid}`);
      removeFromDataBase(`bookRecensions`, `${id}/recensions/${user.uid}`);
    
    }
    
      };
    
      const recommendToUser = async (receiverId) => {
        const firstPossibility = `${user.uid}-${receiverId}`;
        const secondPossibility = `${receiverId}-${user.uid}`;
    
        const existingChat1 = await getDocument("usersChats", firstPossibility);
        const existingChat2 = await getDocument("usersChats", secondPossibility);
    
        let chatId;
    
        if (existingChat1 || existingChat2) {
          chatId = existingChat1 ? firstPossibility : secondPossibility;
        } else {
          chatId = firstPossibility;
    
          addToDataBase("usersChats", firstPossibility, {
            chatId: firstPossibility,
            createdAt: new Date().getTime(),
          });
    
          addToDataBase("entitledToChat", `${firstPossibility}/${user.uid}`, {
            entitledUserId: user.uid,
            entitledChatId: firstPossibility,
          });
    
          addToDataBase("entitledToChat", `${firstPossibility}/${receiverId}`, {
            entitledUserId: receiverId,
            entitledChatId: firstPossibility,
          });
        }
    
        const messageId = `${chatId}/${new Date().getTime()}${uniqid()}`;
    
        addToDataBase("usersChatMessages", messageId, {
          content: document.photoURL,
          message: `Hi, I want to recommend you the book ${document.title} written by ${document.author}.`,
          chatId: chatId,
          sender: {
            id: user.uid,
          },
          receiver: {
            id: receiverId,
          },
          sentAt: new Date().getTime(),
        });
    
        addToDataBase("recommendations", messageId, {
          content: document.photoURL,
          message: `Hi, I want to recommend you the book ${document.title} written by ${document.author}.`,
          chatId: chatId,
          messageId,
          sender: {
            id: user.uid,
          },
          receiver: {
            id: receiverId,
          },
          sentAt: new Date().getTime(),
        });
    dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.successfull.sent[selectedLanguage]}`, alertType:"success"}});
      };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const showIfLiked = async () => {
    const docElement = await getDocument("lovedBooks", `${id}-${user.uid}`);

    if (docElement) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  };
      useEffect(() => {
        showIfLiked();
      }, [showIfLiked]);


  const goToBookReaderForm = () => {
         navigation.setParams({bookId:null, readerData:null, pagesAmount:0});
        navigation.navigate('BookReaderForm', {
          readerData:readers.find(
            (reader) => reader.id === user.uid && reader.bookReadingId === id
          ),
          pagesAmount: document.pagesNumber,
         bookId: id,
        })
      }

  const goUpdateReaderState = () => {
    navigation.setParams({bookId:null, readerData:null, pagesAmount:0});
        navigation.navigate('BookReaderEdit', {
          bookId:id,
          readerData:readers.find(
            (reader) => reader.id === user.uid && reader.bookReadingId === id
          ),
          pagesAmount: document.pagesNumber,
        })
      }


      const readerStateCondition= readers.find(
        (reader) => reader.id === user.uid && reader.bookReadingId === id
      );

      const readerActionButtons= readerStateCondition ? [ {
        icon: 'book-minus',
        size:24,
        color:"white",

        style:{
          backgroundColor:"red"
        },
        label: translations.buttonsTexts.removeShelf[selectedLanguage],
        labelStyle:{
          color:"white",
          fontFamily:"OpenSans-Bold"
         },
        onPress: () => {
          removeFromShelf();
        },
      }] : [];

      const bookObjectCreatorButtons= user.uid === document?.createdBy?.id ? [{
        icon: 'book-edit',
        size:24,
        color:"white",

        style:{
          backgroundColor:"blue"
        },
        label: translations.buttonsTexts.edit[selectedLanguage],
        labelStyle:{
          color:"white",
          fontFamily:"OpenSans-Bold"
         },
        onPress: () => {
          navigation.navigate('BookEdit', {
            id:id,
          });
        },
      },{
        icon: 'book-remove',
        size:24,
        color:"white",

        style:{
          backgroundColor:"red"
        },
        labelStyle:{
          color:"white",
          fontFamily:"OpenSans-Bold"
         },
        label: translations.buttonsTexts.delete[selectedLanguage],
        onPress: () => {
          clickDelete();
          navigation.navigate('HomeScreen');
        },
      }] : [];

      const theme=useTheme();
  return (
    <>
  <ScrollView style={{backgroundColor:theme['color-basic-800']}}>
{document && <>
<View style={{margin:6, alignSelf:"center"}}>
  <Image source={{uri:document.bookCover}} style={{borderRadius:10, width:230, height:230, resizeMode:"cover"}}/>
</View>
<View style={{flexDirection:"row", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center"}}>
  <View>
    <Text style={{fontSize:24, fontFamily:"Inter-Black", color:"white"}}>{document.title}</Text>
    <Text style={{fontFamily:"Inter-Black", color:"white"}}>{translations.authorText[selectedLanguage]}: {document.author}</Text>
  </View>
    <View style={{margin:4, gap:2, flexDirection:"row"}}>

{ likers.filter((liker) => liker.lovedBookId === id
                                ).length > 0 &&
<Link onPress={()=>setOpenedModal(true)}>
                  <LinkText textDecorationLine='none' fontSize={14}>
                  {likers.filter((liker) => liker.lovedBookId === id)[0]?.displayName}
{likers.filter((liker) => liker.lovedBookId === id)
                            .length === 1
                            ? ` ${translations.andPersons.singlePerson[selectedLanguage]} `
                            : ` ${
                                translations.andPersons.part1[selectedLanguage]
                              } ${
                                likers.filter(
                                  (liker) => liker.lovedBookId === id
                                ).length - 1
                              } ${
                                translations.andPersons.part2[selectedLanguage]}`}
</LinkText>
</Link>
                                }
     </View>
</View>
<View style={{flexDirection:'row', alignItems:"center", gap:10, margin:4}}>
  <FontAwesome size={20} name="list" color='white'/>
  <Text style={{fontFamily:"Inter-Black", color:"white", fontSize:24}}>{reuseableTranslations.detailsText[selectedLanguage]}</Text>
  <FontAwesome color='white' size={20} name="list" style={{alignSelf:"center"}}/>
</View>
<View style={{margin:4}}>
<Text style={{fontFamily:"Inter-Black", color:"white"}}>{reuseableTranslations.categoryText[selectedLanguage]}: {document.category}</Text>
  <Text style={{fontFamily:"Inter-Black", color:"white"}}>{reuseableTranslations.pagesText[selectedLanguage]}: {document.pagesNumber}</Text>
  <Text style={{fontFamily:"Inter-Black", color:"white"}}>{reuseableTranslations.releasedBy.part1[selectedLanguage]} {document.publishingHouse} {reuseableTranslations.releasedBy.part2[selectedLanguage]} {document.dateOfPublishing}</Text>
  <Text style={{fontFamily:"Inter-Black", color:"white"}}>{reuseableTranslations.publishingHouseCountry[selectedLanguage]}: {getName(document.countryOfRelease)}</Text>
  

  <Accordion
  width="100%"
  variant="filled"
  backgroundColor='transparent'
  type="single"
  isCollapsible={true}
  isDisabled={false}
  marginVertical={8}
>
  <AccordionItem value="a" backgroundColor={primeColor} borderRadius={8}>
    <AccordionHeader backgroundColor={accColor} borderRadius={8}>
      <AccordionTrigger>
        {({ isExpanded }) => {
          return (
            <>
              <AccordionTitleText fontFamily='Inter-Black' color='white'>{reuseableTranslations.bookDescription[selectedLanguage]} {document.title}</AccordionTitleText>
              {isExpanded ? (
                <AccordionIcon as={ChevronUpIcon} ml="$3" />
              ) : (
                <AccordionIcon as={ChevronDownIcon} ml="$3" />
              )}
            </>
          )
        }}
      </AccordionTrigger>
    </AccordionHeader>
    <AccordionContent backgroundColor={accColor}>
      <AccordionContentText fontFamily='Inter-Black' color='white' fontSize={12}>
        {document.description}
      </AccordionContentText>
    </AccordionContent>
  </AccordionItem>
</Accordion>
<BannerAd unitId={adUnitId} size={BannerAdSize.FULL_BANNER}/>
</View>
{document && readers && 

<BookRecensions bookPages={document.pagesNumber}
          readPages={
            readers &&
            readers.find(
              (reader) => reader.id === user.uid && reader.bookReadingId === id
            )?.pagesRead
          }
          title={document.title}
          hasReadBook={
            readers &&
            readers.find(
              (reader) => reader.id === user.uid && reader.bookReadingId === id
            )?.hasFinished
          }
          hasRecension={
            recensions &&
            recensions
              .find(
                (reader) =>
                  reader.id === user.uid && reader.recension.trim() !== ""
              )
          }
          publishRecension={publishRecension}
          recensions={
            recensions && recensions.length > 0
              ? recensions.filter(
                  (recension) => recension.recensionedBook === id
                )
              : []
          }/>
}

<LikersModal closeModal={()=>{
  setOpenedModal(false);
}} isOpened={openedModal} likers={likers.filter((liker)=>liker.lovedBookId === id)} />
</>}
  </ScrollView>
<FAB.Group backdropColor={modalPrimeColor}
fabStyle={{backgroundColor:primeColor, position:"absolute", bottom:0, zIndex: changeState.open ? -1 : 0 }}
open={changeState.open}
actions={[
...readerActionButtons,
...bookObjectCreatorButtons,
           {
             icon: 'heart',
             label: isLiked ? translations.buttonsTexts.disLikeit[selectedLanguage] : translations.buttonsTexts.likeIt[selectedLanguage],
             color:"white",
             labelStyle:{
              color:"white",
              fontFamily:"OpenSans-Bold"
             },
             style:{
               backgroundColor: isLiked ? "red" : "gray"
             },
             size:24,
             onPress: async () =>{
              await changeLoveState();
             },
           },
           {
             icon: readerStateCondition ? 'book-plus-outline' : 'book-edit-outline',
             size:24,
             color:"white",
             style:{
               backgroundColor:accColor
             },
           labelStyle:{
              color:"white",
              fontFamily:"OpenSans-Bold"
             },
             label: !readerStateCondition ? translations.buttonsTexts.addToShelf[selectedLanguage] : translations.buttonsTexts.updateStatus[selectedLanguage],
             onPress: () => {
               if(!readerStateCondition){
                 goToBookReaderForm();
               }else{
                 goUpdateReaderState();
               }
             },
           },
         ]} color='white' mode='elevated' size='small' label={translations.buttonsTexts.actions[selectedLanguage]} icon={'dots-vertical'} onStateChange={onStateChanged}
         />
    </>
 
    
 
 )
}

export default Book