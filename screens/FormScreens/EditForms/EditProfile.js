import React, {
  useEffect,
  useState,
} from 'react';

import {
  updateEmail,
  updateProfile,
} from 'firebase/auth';
import {
  Image,
  Text,
  View,
} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { useSelector } from 'react-redux';

import {
  Input,
  InputField,
  ScrollView,
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import { Button } from '@rneui/themed';
import { useTheme } from '@ui-kitten/components';

import { accColor } from '../../../assets/ColorsImport';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/FormsTranslations.json';
import CountryListSelection
  from '../../../components/CountryList/CountryListSelection';
import Loader from '../../../components/Loader';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useFormRealData } from '../../../hooks/useFormRealData';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useSelectPhoto } from '../../../hooks/useSelectPhoto';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';
import useStorage from '../../../hooks/useStorage';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-9822550861323688~6900348989';
const EditProfile = () => {
  const {user}=useAuthContext();
  const {document}=useFormRealData('users', user.uid);
const {photoURL, selectSinglePhoto}=useSelectPhoto();
const [isPending, setIsPending]=useState(false);
const [nickname, setNickname]=useState('');
const [email, setEmail]=useState('');
const [nationality, setNationality]=useState(null);
const [description, setDescription]=useState(null);
const {uploadConvertedUri}=useStorage();
const [openPicker, setOpenPicker]=useState(false);
const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
const {updateDatabase}=useRealDatabase();
const {documents: readers}=useGetDocuments("bookReaders");
const {dispatch}=useSnackbarContext();
const readerObjects=readers.map((bookReader) => {
  return bookReader.readers;
}).map((obj) => {
  const nestedObject = Object.values(obj);
  return nestedObject;
}).flat();

const handleSubmit = async () => {
  setIsPending(true);
  try {
    console.log(nickname, email);

    if(photoURL){
const convertedImg=await uploadConvertedUri(photoURL, `profileImg/uid${user.uid}/${user.displayName}.jpg`);
await updateProfile(user, {
  displayName: nickname,
  photoURL: convertedImg,
});
updateDatabase(
  {
    ...document,
    nickname: nickname,
    photoURL: convertedImg,
    description: description,
    email: email,
    nationality: {
      nationality: nationality
        ? nationality.nationality.toLowerCase()
        : document.nationality.nationality,
      nationalityFlag: nationality
        ? `https://flagcdn.com/h40/${nationality.nationality.toLowerCase()}.png`
        : document.nationality.nationalityFlag,
    },
  },
  "users",
  user.uid
);

    }else{
      updateDatabase(
        {
          ...document,
          nickname: nickname,
          photoURL: document.photoURL,
          description: description,
          email: email,
          nationality: {
            nationality: nationality
              ? nationality.nationality.toLowerCase()
              : document.nationality.nationality,
            nationalityFlag: nationality
              ? `https://flagcdn.com/h40/${nationality.nationality.toLowerCase()}.png`
              : document.nationality.nationalityFlag,
          },
        },
        "users",
        user.uid
      );

      await updateProfile(user, {
        displayName: nickname,
      });
    }


    await updateEmail(user, email);

   

    if (readerObjects.length > 0) {
      const yourObjects = readerObjects.filter(
        (reader) => reader.id === user.uid
      );

      yourObjects.map((reader) => {
        updateDatabase(
          {
            ...reader,
            displayName: nickname,
            email: email,
            photoURL: document.photoURL,
          },
          "bookReaders",
          `${reader.bookReadingId}/readers/${user.uid}`
        );
      });
    }

    setIsPending(false);
    dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.successfull.update[selectedLanguage]}`, alertType:"success"}});
  } catch (error) {
    console.log(error);
    setIsPending(false);
  }
  setIsPending(false);
};



useEffect(()=>{
if(document){
  setNickname(document.nickname);
  setEmail(document.email);
  setNationality(document?.nationality ? document.nationality : null);
  setDescription(document.description)
}

},[document])

const theme=useTheme();


  return (
    <>
    <ScrollView style={{backgroundColor:theme['color-basic-800']}}>
{document && <>
<View style={{alignItems:"center", marginTop:24, gap:8}}>
  <Image source={{uri: photoURL ? photoURL : document.photoURL}} style={{width:170, height:170, borderRadius:100}}/>
<Button onPress={selectSinglePhoto} icon={{name:"image", type:"material-community", color:"white"}} titleStyle={{fontFamily:'OpenSans-Bold'}} buttonStyle={{padding:6, margin:8, minWidth:250, maxWidth:300, backgroundColor:accColor}} radius='xl'>
  {translations.selectImgBtn.text[selectedLanguage]}
</Button>
</View>

<BannerAd unitId={adUnitId} size={BannerAdSize.FULL_BANNER}/>

<View style={{margin:6, gap:6}}>
<Text style={{color:'white', fontFamily:'OpenSans-Bold'}}>{translations.userFields.nickname[selectedLanguage]}:</Text>
<Input variant='rounded'>
<InputField fontFamily='OpenSans-Regular' color='white' onChangeText={setNickname} value={nickname}/>
</Input>
</View>

<View style={{margin:6, gap:6}}>
<Text style={{color:'white'}}>Email:</Text>
<Input isDisabled variant='rounded'>
<InputField fontFamily='OpenSans-Regular' color='white' keyboardType='email-address' value={email}/>
</Input>
</View>

<View style={{margin:6, gap:6}}>
<Text style={{color:'white'}}>{translations.nationality[selectedLanguage]}:</Text>
<View style={{flexDirection:"row", gap:16, alignItems:"center"}}>
{nationality &&
<Image source={{uri: nationality.nationalityFlag}} style={{width:80, height:60, borderRadius:10}}/>
}

<CountryListSelection selected={nationality} setSelected={(item)=>{
  setNationality({nationality:item.code, nationalityFlag:`https://flagcdn.com/h40/${item.code.toLowerCase()}.png`});
  }}/>

</View>
</View>

<View style={{margin:6, gap:6}}>
<Text style={{color:"white", fontFamily:'OpenSans-Bold'}}>{translations.descriptionTextarea.label[selectedLanguage]}:</Text>
<Textarea>
<TextareaInput color='white' fontFamily='OpenSans-Regular' onChangeText={setDescription} value={description}/>
</Textarea>
</View>

<Button onPress={handleSubmit} buttonStyle={{margin:24, backgroundColor:accColor}} titleStyle={{fontFamily:'OpenSans-Bold'}} radius='xl'>{translations.updateBtn[selectedLanguage]}</Button>

</>}
    </ScrollView>
          {isPending && <Loader/>}
    </>
  )
}

export default EditProfile