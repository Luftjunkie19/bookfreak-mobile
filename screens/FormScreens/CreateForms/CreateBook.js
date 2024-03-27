import React, { useState } from 'react';

import { randomUUID } from 'expo-crypto';
import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { SelectList } from 'react-native-dropdown-select-list';
import {
  AppOpenAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import { useSelector } from 'react-redux';

import {
  ButtonIcon,
  CheckCircleIcon,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import { Button } from '@rneui/themed';
import {
  Datepicker,
  useTheme,
} from '@ui-kitten/components';

import {
  accColor,
  modalAccColor,
  primeColor,
} from '../../../assets/ColorsImport';
import { bookCategories } from '../../../assets/CreateVariables';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import formTranslations
  from '../../../assets/translations/FormsTranslations.json';
import PaperButton from '../../../components/Buttons/PaperButton';
import Loader from '../../../components/Loader';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useSelectPhoto } from '../../../hooks/useSelectPhoto';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';
import useStorage from '../../../hooks/useStorage';

const adUnitId = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-9822550861323688~6900348989';

const CreateBook = ({navigation}) => {
  const appOpenAd = AppOpenAd.createForAdRequest(adUnitId);
  
  const {user}=useAuthContext();
  const { documents:availableBooks } = useGetDocuments("books");
  const { documents } = useGetDocuments("bookReaders");
  const bookReaders = documents
    .map((bookReader) => {
      return bookReader.readers;
    })
    .map((obj) => {
      const nestedObject = Object.values(obj);
      return nestedObject;
    })
    .flat()
    .filter((reader) => reader.id === user.uid);
const transformedCategories= bookCategories.map((item, index)=>{
  return ({value: item, key: `${index + 1}`})
});
const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
const {photoURL, selectSinglePhoto}=useSelectPhoto();
  const [book, setBook]=useState({
    author: "",
    title: "",
    pagesNumber: 1,
    category: null,
    bookCover: null,
    description: "",
    dateOfPublishing: null,
    countryOfRelease:"",
    publishingHouse:null,
  });
  const {dispatch}=useSnackbarContext();
  const [select, setSelect]=useState(false);
  const [isPending, setIsPending]=useState(false);
  const [error, setError]=useState(false);
  const [category, setCategory]=useState("");
  const [dateOfPublishing, setDateOfPublishing]=useState(new Date());
  const {uploadConvertedUri}=useStorage();
  const {addToDataBase}=useRealDatabase();
  const handleSubmit = async () => {
    setError(null);
    setIsPending(true);
console.log(book);
    try {
      const uniqueId = randomUUID();

      if (category.trim() === "") {
        setError(
          alertMessages.notifications.wrong.emptyMessage[selectedLanguage]
        );
        dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.wrong.emptyMessage[selectedLanguage]}`, alertType:"error"}});
        setIsPending(false);
     
        return;
      }

      if (
        availableBooks.find(
          (doc) =>
          doc.title.toLowerCase().includes(book.title.toLowerCase()) &&
          doc.author.toLowerCase().includes(book.author.toLowerCase()) &&
          doc.countryOfRelease.toLowerCase().includes(book.countryOfRelease.toLowerCase())
        )
      ) {
        setIsPending(false);
        dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.wrong.existsBook[selectedLanguage]}`, alertType:"error"}});
        setError(alertMessages.notifications.wrong.existsBook[selectedLanguage]);
        setLink(
          availableBooks.find(
            (doc) =>
              doc.title.toLowerCase().includes(book.title.toLowerCase()) &&
              doc.author.toLowerCase().includes(book.author.toLowerCase()) &&
              doc.countryOfRelease.toLowerCase().includes(book.countryOfRelease.toLowerCase())
          ).id
        );
        return;
      }

      if(book.description.trim().length < 20){
        setIsPending(false);
        dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.wrong.writeLonger[selectedLanguage]}`, alertType:"error"}});
        setError(alertMessages.notifications.wrong.writeLonger[selectedLanguage]);
        return
      }

      if(book.countryOfRelease.trim().length ===0 || !dateOfPublishing || !book.publishingHouse){
        setIsPending(false);
        dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.wrong.someFieldsEmpty[selectedLanguage]}`, alertType:"error"}});
        return
      }

      if(!photoURL){
        setIsPending(false);
        dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.wrong.bookCoverReq[selectedLanguage]}`, alertType:"error"}});
        return
      }

      

      if(book.dateOfPublishing > new Date().getFullYear()){
        setIsPending(false);
        dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.wrong.timeTraveler[selectedLanguage]}`, alertType:"error"}});
        return
      }


      console.log(bookReaders);

      if (bookReaders.find((reader) => !reader.hasFinished)) {
        dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.wrong.recentlyStartedReading[selectedLanguage]}`, alertType:"error"}});

        return;
      }

      const covertedImg= await uploadConvertedUri(photoURL, `book-covers/${user.uid}/${
        book.title ? book.title : `book${randomUUID()}`
      }.jpg`);
      const bookElement = {
        ...book,
        author: book.author,
        title: book.title,
        pagesNumber: book.pagesNumber,
        photoURL: covertedImg,
        bookCover:covertedImg,
        category: category,
        dateOfPublishing:dateOfPublishing,
        createdBy: {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
          id: user.uid,
        },
        id: uniqueId,
      };

      console.log(bookElement);

      addToDataBase("books", uniqueId, bookElement);
      addToDataBase("likesData", uniqueId, {
        likesAmount: 0,
      });

      addToDataBase("bookReaders", uniqueId, {
        id: uniqueId,
        readers: {
          [user.uid]: {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            startedReading: false,
            hasFinished: false,
            pagesRead: 0,
            bookRate: 0,
            dateOfFinish: isCompleted ? new Date().getTime() : null,
            recension: "",
            id: user.uid,

            bookReadingId: uniqueId,
          },
        },
      });

      addToDataBase("bookRecensions", uniqueId, {
        averageRate: 0,
        recensions: {},
      });


      dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.successfull.create[selectedLanguage]}`, alertType:"success"}});

     

      setIsPending(false);
      setError(null);
      appOpenAd.load();
      appOpenAd.show();
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
    finally{
      setIsPending(false);
    }
  };



const theme=useTheme();
  return (
    <>
    <ScrollView style={{gap:10, flex:1, backgroundColor:theme["color-basic-800"]}}>

      <Text style={{ textAlign:"center", fontSize:18, color:"white", padding:10, letterSpacing:1, fontFamily:"Inter-Black"}}>{formTranslations.topText.books[selectedLanguage]}</Text>


<View style={{margin:6}}>
<Text style={{color:"white", fontFamily:"Inter-Black"}}>{formTranslations.bookTitleInput.label[selectedLanguage]}</Text>
<Input variant='rounded'>
<InputField color="white" fontFamily='OpenSans-Regular' backgroundColor={modalAccColor} onChangeText={(text)=>{
  setBook({...book,title: text});
}} placeholder={formTranslations.bookTitleInput.placeholder[selectedLanguage]}/>
</Input>
</View>


<View style={{margin:6,}}>
<Text style={{color:"white", fontFamily:"Inter-Black"}}>{formTranslations.bookAuthorInput.label[selectedLanguage]}</Text>
<Input variant='rounded'>
<InputField color="white" fontFamily='OpenSans-Regular' backgroundColor={modalAccColor} onChangeText={(text)=>{
  setBook({...book,author: text});
}} placeholder={formTranslations.bookAuthorInput.placeholder[selectedLanguage]}/>
</Input>
</View>


<View style={{margin:6}}>
  <Text style={{color:"white", fontFamily:"Inter-Black"}}>{formTranslations.bookCategoryInput.label[selectedLanguage]}</Text>
<SelectList save="value" inputStyles={{color:"white", fontFamily:'OpenSans-Bold'}} dropdownTextStyles={{color:"white"}} dropdownStyles={{backgroundColor:primeColor}} boxStyles={{backgroundColor:accColor}} dropdownItemStyles={{backgroundColor:accColor}}  data={transformedCategories} placeholder={formTranslations.bookCategoryInput.label[selectedLanguage]} search setSelected={setCategory}/>
</View>


<View style={{margin:6}}>
<Text style={{color:"white",fontFamily:"Inter-Black"}}>{formTranslations.pagesAmountInput.label[selectedLanguage]}</Text>
<Input variant='rounded'>
<InputField color="white" fontFamily='OpenSans-Regular' backgroundColor={modalAccColor} onChangeText={(text)=>{
  setBook({...book, pagesNumber: +text});
}} placeholder={formTranslations.pagesAmountInput.placeholder[selectedLanguage]} keyboardType='numeric'/>
</Input>
</View>


<View style={{margin:6}}>
{photoURL && <Image source={{uri: photoURL}} style={{width:200, height:200, alignSelf:"center", margin:4}}/>}
<PaperButton icon="image" mode="contained" text={formTranslations.selectImgBtn.text[selectedLanguage]} bgColor="rgb(66,103,181)" onPress={selectSinglePhoto}/>

</View>


<View style={{margin:6, gap:6}}>
<Text style={{color:"white",fontFamily:"Inter-Black"}}>{formTranslations.countryOfBookRelease[selectedLanguage]}</Text>
<View style={{flexDirection:"row", gap:16, justifyContent:"space-around", alignItems:"center"}}>
{book.countryOfRelease && <Image style={{borderRadius:5}} width={80} height={60} source={{uri:`https://flagcdn.com/h40/${book.countryOfRelease.toLowerCase()}.png`}}/>}
<Button buttonStyle={{backgroundColor:accColor, gap:6}} titleStyle={{fontFamily:"OpenSans-Bold"}} maxWidth={250} onPress={()=>{
  setSelect(true);
}}>
 Select Country 🏴
</Button>
</View>
<CountryPicker lang={selectedLanguage}  show={select} pickerButtonOnPress={(value)=>{
  setBook({...book, countryOfRelease:value.code});
  setSelect(false);
}} />
</View>


<View style={{margin:6}}>
<Text style={{color:"white",fontFamily:"Inter-Black"}}>{formTranslations.publisher[selectedLanguage]}</Text>
<Input variant='rounded'>
<InputField color="white" fontFamily='OpenSans-Regular' backgroundColor={modalAccColor} onChangeText={(value)=>{
  setBook({...book, publishingHouse: value})
}} placeholder={formTranslations.publisher[selectedLanguage]} />
</Input>
</View>

<View style={{margin:6}}>
  <Text style={{color:"white",fontFamily:"Inter-Black"}}>{formTranslations.yearOfRelease[selectedLanguage]}</Text>
<Datepicker controlStyle={{backgroundColor:modalAccColor}} max={new Date()} min={new Date('01-01-0000')} date={dateOfPublishing} onSelect={(date)=>{
 setDateOfPublishing(new Date(date));
}} />
</View>

<View style={{margin:6}}>
  <FormControl>
  <FormControlLabel>
    <FormControlLabelText fontFamily='Inter-Black' color='white'>{formTranslations.descriptionTextarea.label[selectedLanguage]}</FormControlLabelText>
  </FormControlLabel>
<Textarea
  size="md"
  isReadOnly={false}
  isInvalid={false}
  isDisabled={false}
>
  <TextareaInput  backgroundColor={modalAccColor} onChangeText={(value)=>{
  setBook({...book, description:value})
}}  fontFamily='OpenSans-Regular' color='white' placeholder={formTranslations.descriptionTextarea.placeholder[selectedLanguage]} />
</Textarea>
  </FormControl>
</View>

<View style={{margin:16}}>
<Button titleStyle={{fontFamily:"OpenSans-Bold"}}
 buttonStyle={{backgroundColor:accColor, gap:16, borderRadius:8}}
  onPress={handleSubmit}
>
{formTranslations.finishText[selectedLanguage]} 
  <ButtonIcon>
    <CheckCircleIcon color='white'/>
  </ButtonIcon>
</Button>
</View>

    </ScrollView>
    {isPending && <Loader/>}
    </>
  )
}

export default CreateBook