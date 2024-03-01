import React, {
  useEffect,
  useState,
} from 'react';

import {
  Image,
  KeyboardAvoidingView,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import {
  Input,
  InputField,
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import { Button } from '@rneui/themed';
import { useTheme } from '@ui-kitten/components';

import {
  accColor,
  primeColor,
} from '../../../assets/ColorsImport';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import formTranslations
  from '../../../assets/translations/FormsTranslations.json';
import Loader from '../../../components/Loader';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useFormRealData } from '../../../hooks/useFormRealData';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useSelectPhoto } from '../../../hooks/useSelectPhoto';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';
import useStorage from '../../../hooks/useStorage';

const EditClub = ({route, navigation}) => {
  const {id}=route.params;
  const {dispatch}=useSnackbarContext();
  const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
  const { updateDatabase } = useRealDatabase();
  const { document } = useFormRealData("readersClubs", id);
  const { user } = useAuthContext();
  const [clubsName, setClubsName] = useState("");
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
const {photoURL, selectSinglePhoto}=useSelectPhoto();
const {uploadConvertedUri}=useStorage();
  const [isPending, setIsPending] = useState(false);
  const [requiredPagesRead, setRequiredPagesRead] = useState(0);
  useEffect(() => {
    if (document) {
      setClubsName(document.clubsName);
      setDescription(document.description);
      setRequiredPagesRead(document.requiredPagesRead);
    }
  }, [document]);

  const handleSubmit = async () => {
    setError(null);
    setIsPending(true);
    try {
      if(photoURL){
          const uploadPath = `clubLogo/uid${user.uid}/${photoURL}`;
          const convertedImage= await uploadConvertedUri(photoURL, uploadPath);
          updateDatabase(
            {
              ...document,
              clubsName: clubsName,
              clubLogo: convertedImage,
              description: description,
              requiredPagesRead: requiredPagesRead,
            },
            "readersClubs",
            id
          );
      
  
          dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.successfull.update[selectedLanguage]}`, alertType:'success'}});
        }else{
          updateDatabase(
            {
              ...document,
              clubsName: clubsName,
              description: description,
              requiredPagesRead: requiredPagesRead,
            },
            "readersClubs",
            id
          );
  
          setError(null);
          setIsPending(false);
          dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.successfull.update[selectedLanguage]}`, alertType:'success'}});
        };

        navigation.navigate('HomeScreen');
    } catch (error) {
      dispatch({type:"SHOW_SNACKBAR", payload:{message:`${error.message}`, alertType:'error'}});
      setError(error.message);
    }
  };


const theme=useTheme();
  return (<>
    <KeyboardAvoidingView behavior='position' style={{backgroundColor:theme['color-basic-800'], flex:1}}>
     {document && <>
<View style={{marginTop:16}}>
  <Image source={{uri: photoURL ? photoURL : document.clubLogo}} style={{width:180, height:180, alignSelf:"center", borderRadius:100}}/>
          <Button titleStyle={{fontFamily:"OpenSans-Bold"}} onPress={selectSinglePhoto} icon={{ name: "image", type: "material-community", color: "white" }} radius='xl' buttonStyle={{ margin: 12, backgroundColor: primeColor, borderColor: 'white', borderWidth: 1 }}>{formTranslations.selectImgBtn.text[selectedLanguage]}</Button>
</View>

<View style={{margin:6, gap:6}}>
<Text style={{fontFamily:"OpenSans-Bold", color:"white"}}>{formTranslations.clubsNameInput.label[selectedLanguage]}:</Text>
  <Input variant='rounded'>
  <InputField fontFamily='OpenSans-Regular' color='white' value={clubsName} onChangeText={setClubsName} />
  </Input>
</View>

<View style={{margin:6,  gap:6}}>
<Text style={{fontFamily:"OpenSans-Bold", color:"white"}}>{formTranslations.requiredPagesToJoin.label[selectedLanguage]}:</Text>
  <Input variant='rounded'>
  <InputField fontFamily="OpenSans-Regular" color='white' keyboardType='numeric' value={`${requiredPagesRead}`} onChangeText={(val)=>setRequiredPagesRead(+val)}/>
  </Input>
</View>

<View style={{margin:6, gap:6}}>
<Text style={{fontFamily:"OpenSans-Bold", color:"white"}}>{formTranslations.descriptionTextarea.label[selectedLanguage]}:</Text>
<Textarea>
  <TextareaInput fontFamily="OpenSans-Regular" color='white' onChangeText={setDescription} value={description}/>
</Textarea>
</View>
     </>}
<Button titleStyle={{fontFamily:"OpenSans-Bold"}} onPress={handleSubmit} buttonStyle={{margin:16, gap:12, backgroundColor:accColor}} iconPosition='right' radius='xl' icon={{name:"check", type:"material-community", color:"white"}}>
  {formTranslations.submit[selectedLanguage]}
</Button>

    </KeyboardAvoidingView>
       {isPending && <Loader/>}
       </>
  )
}

export default EditClub