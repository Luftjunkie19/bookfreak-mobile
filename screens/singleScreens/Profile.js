import React, {
  useEffect,
  useState,
} from 'react';

import { httpsCallable } from 'firebase/functions';
import { styled } from 'nativewind/dist';
import {
  Dimensions,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  BounceIn,
  BounceInLeft,
  FlipInXUp,
  scrollTo,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';

import IonIcons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  Link,
  LinkText,
} from '@gluestack-ui/themed';
import { Button } from '@rneui/themed';
import {
  Divider,
  useTheme,
} from '@ui-kitten/components';

import {
  accColor,
  editBtnColor,
  primeColor,
} from '../../assets/ColorsImport';
import formTranslations from '../../assets/translations/FormsTranslations.json';
import profileTranslations
  from '../../assets/translations/ProfileTranslations.json';
import Charts from '../../components/ProfileComponents/Charts';
import FavouriteBooks from '../../components/ProfileComponents/FavouriteBooks';
import Links from '../../components/ProfileComponents/Links';
import ReadBooks from '../../components/ProfileComponents/ReadBooks';
import { functions } from '../../firebaseConfig';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import useGetDocuments from '../../hooks/useGetDocuments';

const Profile = ({navigation}) => {
  const animatedRef=useAnimatedRef();
  const {user}=useAuthContext();
const {document}=useGetDocument('users', user.uid);
const {documents:books}=useGetDocuments('books');
  const {documents: links}= useGetDocuments("links");
  const { documents: favBooks } = useGetDocuments("lovedBooks");
const {documents: readers}=useGetDocuments("bookReaders");

const readerObjects=readers.map((bookReader) => {
  return bookReader.readers;
}).map((obj) => {
  const nestedObject = Object.values(obj);
  return nestedObject;
}).flat();

const readersFiltered = readerObjects.filter((reader) => reader.id === user.uid);

const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
const NativeText=styled(Text);
const NativeButton=styled(Button);
const NativeScrollView=styled(ScrollView);
const theme=useTheme();
const [openedSection, setOpenedSection]=useState('');


const lovedBooks=books.map((book,i)=>{
  return books.filter((bookItem)=>bookItem.id === favBooks.filter((fav)=>fav.lovedBy===user.uid)[i]?.lovedBookId);
}).flat();


const yourFinishedBooks=readersFiltered.map((reader)=>{
    return books.filter((bookItem)=>bookItem.id === reader?.bookReadingId && reader.pagesRead === bookItem?.pagesNumber);
}).flat();

const imgScale=useSharedValue(1);
const {height, width}=Dimensions.get('window');
const focalY=useSharedValue(0);
const focalX=useSharedValue(0);
const getBalance=httpsCallable(functions, "getBalance");
const pinchGesture= Gesture.Pinch().onChange((e)=>{
  if(e.scale <= 1){
    imgScale.value=1;
    focalY.value= e.focalY;
    focalX.value= e.focalX;
  }else{
    imgScale.value= e.scale;
    focalY.value= e.focalY;
    focalX.value= e.focalX;
  }

}).onEnd((e)=>{
  imgScale.value= 1;
  focalY.value= 0;
  focalX.value= 0;
});

const animatedStyles = useAnimatedStyle(() => {

  return {
    transform: [
      { scale: imgScale.value },
      {
        translateX: focalX.value  ,
      },
      {
        translateY: focalY.value
      }
    ],
  };
});
const scrollY=useSharedValue(0);
const offset = useScrollViewOffset(animatedRef);
const focalPointStyles=useAnimatedStyle(()=>{
  return {transform:[{translateY:focalY.value, translateX:focalX.value}]}
});

const [balanceObject, setBalanceObject]=useState(null);

const provideBalance= async ()=>{

    const balance= await getBalance({accountId:document.stripeAccountData.id});
    
    const balanceObject = await balance.data;
    
    setBalanceObject(balanceObject);
  
  }
  
  useEffect(() => {
    if (document) {
      provideBalance();
    }
  },[document])

  
useDerivedValue(() => {
  scrollTo(animatedRef, 0, scrollY.value, true);
});

  const accountLinkFunction = httpsCallable(functions, "createAccountLink");


  const pressAccountFunction = async (accountId) => {
    const linkFunction = await accountLinkFunction({ accountId: accountId });
    const results = await linkFunction.data;
    await WebBrowser.openBrowserAsync(results.accountLinkObject.url);
  }

  const openDashboard= async(linkId)=>{
    await WebBrowser.openBrowserAsync(linkId);
  }

  return (
    <Animated.ScrollView ref={animatedRef} style={{backgroundColor:theme["color-basic-800"]}}>
  {document && <>
  <View style={{overflow:'hidden', height:230, width:230,borderRadius:160, alignSelf:"center", margin:16, overflow:"hidden",}}>
  <GestureDetector gesture={pinchGesture}>
        <Animated.Image entering={FlipInXUp.springify()}  source={{uri: document.photoURL}} style={[{width:230, height:230, borderRadius:160, overflow:"hidden", objectFit:'scale-down'}, animatedStyles]}/>
  </GestureDetector>

  </View>


<Animated.ScrollView entering={BounceInLeft} showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{flexWrap:"wrap", flexDirection:"row", justifyContent:"center", gap:8, padding:6}}>
  <NativeButton onPress={()=>{
    navigation.navigate('ProfileEdit');
  }} radius="lg" icon={{
                name: 'edit',
                type: 'font-awesome',
                size: 20,
                color: 'white',
              }}  iconPosition='right' titleStyle={{fontFamily:"Inter-Black"}} buttonStyle={{backgroundColor:editBtnColor,  gap:8}}>
    {profileTranslations.managmentButtons.editButton[selectedLanguage]}
  </NativeButton>
  
<NativeButton radius="lg" icon={{
                name: 'plus',
                type: 'font-awesome',
                size: 20,
                color: 'white',
              }} iconPosition='right'  titleStyle={{fontFamily:"Inter-Black"}} buttonStyle={{backgroundColor:accColor, gap:8}} onPress={()=>{
  navigation.navigate('LinkCreate');
}}>
{profileTranslations.managmentButtons.addLinkButton[selectedLanguage]}
</NativeButton>

<NativeButton titleStyle={{fontFamily:"Inter-Black"}} onPress={()=>{
  navigation.navigate('TopUpScreen');
}} color='success' radius='lg' icon={{
  name:"cash-plus",
  type:"material-community", 
  color:"white"
}} iconRight>
  {profileTranslations.replenishBtn[selectedLanguage]}
</NativeButton>
          
  <Button radius="lg"  icon={{
                name: 'remove',
                type: 'font-awesome',
                size: 20,
                color: 'white',
              }} iconPosition='right' titleStyle={{fontFamily:"Inter-Black"}}  buttonStyle={{backgroundColor:'red'}}>
  {profileTranslations.managmentButtons.removeUserButton[selectedLanguage]}
  </Button>
</Animated.ScrollView>

<View style={{margin:6}}>
<NativeText style={{fontFamily:"OpenSans-Regular"}} className='text-3xl text-white'>{document.nickname}</NativeText>

          {document.accountLinkObject && 
          <View style={{gap:8}}>
            <Text style={{fontFamily:"OpenSans-Bold", color:"red", fontSize:14}}>{formTranslations.provideFinancialData[selectedLanguage]} !</Text>
      <Link maxWidth={230} borderRadius={4} padding={6} bg={accColor} android_ripple={{
  color:primeColor
}}>
            <LinkText alignSelf='center' color='white' textDecorationLine='none' fontFamily='OpenSans-Bold'>{formTranslations.provide[selectedLanguage]}</LinkText>
            </Link>
</View>
      }
          
<View style={{margin:2}}>
 <View>
  <Text style={{fontFamily:"OpenSans-Bold", color:"white", fontSize:20}}>{profileTranslations.availableText[selectedLanguage]}</Text>
              {document.creditsAvailable.balance.map((itemBalance) => (<Text style={{fontFamily:"OpenSans-Bold", color:"white", fontSize:16}}>{itemBalance.amount / 100}<Text style={{color:"lightgreen"}}>
                {itemBalance.currency.toUpperCase()}
              </Text>
              </Text>))}  

{balanceObject && <View>
              <Text style={{fontFamily:"OpenSans-Bold", color:"white", fontSize:20}}>{profileTranslations.pendingText[selectedLanguage]}</Text>
                  {balanceObject.pending.map((itemBalance) => (<Text style={{fontFamily:"OpenSans-Bold", color:"white", fontSize:16}}>{itemBalance.amount/100} <Text style={{ color:"lightgreen"}}>
                {itemBalance.currency.toUpperCase()}
              </Text>
              </Text>))}

            </View>}
  </View>

</View>
    </View>
   <Divider/>

<View style={{gap:16, padding:10}}>
  <Animated.View entering={BounceIn.duration(250)} style={{padding:10, borderRadius:10, flexDirection:"row", justifyContent:"space-around", gap:16, backgroundColor:accColor}}>
    <IonIcons name='book' size={36} color={primeColor}  style={{alignSelf:"center"}}/>
    <View style={{gap:4, alignItems:"center"}}>
    <Text style={{color:"white", fontSize:16, fontFamily:"Inter-Black"}}>{profileTranslations.stats.addedBooks[selectedLanguage]}</Text>
<Text style={{fontFamily:"Inter-Black", color:"gold", fontSize:16}}>{books.filter((book)=>book.createdBy.id === user.uid).length}</Text>
    </View>
  </Animated.View>

  <Animated.View entering={BounceIn.delay(500)} style={{padding:10, borderRadius:10, flexDirection:"row", justifyContent:"space-around", gap:16, backgroundColor:accColor}}>
    <MaterialIcons style={{alignSelf:"center"}} name='my-library-books' size={36}/>
    <View style={{gap:4, alignItems:"center"}}>
    <Text style={{color:"white", fontSize:16, fontFamily:"Inter-Black"}}>{profileTranslations.stats.booksRead[selectedLanguage]}</Text>
    <Text style={{fontFamily:"Inter-Black", color:"gold", fontSize:16}}>{readerObjects.filter((reader)=>reader.id === user.uid).length}</Text>
    </View>
  </Animated.View>

  <Animated.View entering={BounceIn.delay(750)} style={{padding:10, borderRadius:10, flexDirection:"row", justifyContent:"space-around", gap:16, backgroundColor:accColor}}>
    <MaterialIcons style={{alignSelf:"center"}} name='thumb-up' size={36}/>
    
    <View style={{gap:4, alignItems:"center"}}>
    <Text style={{color:"white", fontSize:16, fontFamily:"Inter-Black"}}>{profileTranslations.stats.likedBooks[selectedLanguage]}</Text>
<Text style={{fontFamily:"Inter-Black", color:"gold", fontSize:16}}>{lovedBooks.length}</Text>
    </View>
  </Animated.View>
</View>


      {
  links.filter((link)=>link.belongsTo === user.uid).length > 0 &&
<View style={{margin:6}}>
<NativeText className='text-xl font-medium font-interBlack text-white'>Links:</NativeText>

<Links links={links.filter((link)=>link.belongsTo === user.uid)}/>
</View>


}

<View>
<NativeText className='text-lg font-interBlack font-bold text-white'>{profileTranslations.description.title[selectedLanguage]}:</NativeText>

<View>
  <NativeScrollView nestedScrollEnabled className=' bg-imgCover overflow-x-hidden overflow-y-visible max-h-40'>

  <NativeText style={{fontFamily:"OpenSans-Regular"}} className='p-2 text-white text-base'>
  {document.description.trim().length === 0 ? `${profileTranslations.description.vacancy[selectedLanguage]}` : document.description}
    </NativeText>
  </NativeScrollView>
</View>


</View>

<ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{padding:6, gap:10}}>
<Button  iconPosition='right' radius="lg" icon={{
  type:"font-awesome",
  name:"book",
  size:20,
  color:"white"
}} titleStyle={{fontFamily:"Inter-Black"}} buttonStyle={{backgroundColor:accColor, gap:8}} onPress={()=>{
  setOpenedSection('books');
}}>
 {profileTranslations.featuresButtons.booksButton[selectedLanguage]}

  </Button>
<Button  iconPosition='right' radius="lg" icon={{
  type:"font-awesome",
  name:"bookmark",
  size:20,
  color:"ye"
}} titleStyle={{fontFamily:"Inter-Black"}} buttonStyle={{backgroundColor:accColor, gap:8}} onPress={()=>{
  setOpenedSection('readbooks');
}}>
{profileTranslations.featuresButtons.readBooksBtn[selectedLanguage]}
</Button>
<Button  iconPosition='right' radius="lg" icon={{
  type:"font-awesome",
  name:"heart",
  size:20,
  color:"red"
}} titleStyle={{fontFamily:"Inter-Black"}} buttonStyle={{backgroundColor:accColor, gap:8}} onPress={()=>{
  setOpenedSection('belovedbooks');
}}>
{profileTranslations.featuresButtons.favouritesButton[selectedLanguage]}
</Button>
<Button iconPosition='right' radius="lg" icon={{
  type:"font-awesome",
  name:"pie-chart",
  size:20,
  color:"white"
}} titleStyle={{fontFamily:"Inter-Black"}} onPress={()=>{
  setOpenedSection('stats');
}} buttonStyle={{backgroundColor:accColor, gap:8}}>
 {profileTranslations.featuresButtons.statsBtn[selectedLanguage]}
</Button>
</ScrollView>
    </>}
 


    {openedSection.trim().length > 0 && openedSection === 'stats' &&
  <Charts bookObjects={books} readerObjects={readersFiltered} />
}




{openedSection === "books" &&
  <FavouriteBooks openedSection={"books"} favBooks={books.filter((ownedBook) => ownedBook.createdBy.id === user.uid)} />
}

{openedSection === "readbooks" &&
<ReadBooks readBooks={yourFinishedBooks} readPages={yourFinishedBooks}/>

}

{openedSection === "belovedbooks" && <FavouriteBooks openedSection={"belovedbooks"} favBooks={lovedBooks}/>}


{openedSection !== "stats" && openedSection !== "belovedbooks" && openedSection !== "books" && openedSection !== "readbooks" &&
  <></>
}

    </Animated.ScrollView>
  )
}

export default Profile