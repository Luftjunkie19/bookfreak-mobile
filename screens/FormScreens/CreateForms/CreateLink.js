import 'react-native-get-random-values';

import React, { useState } from 'react';

import {
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import {
  Button,
  ButtonText,
  Input,
  InputField,
} from '@gluestack-ui/themed';
import {
  Select,
  SelectItem,
  useTheme,
} from '@ui-kitten/components';

import {
  accColor,
  primeColor,
} from '../../../assets/ColorsImport';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import formTranslations
  from '../../../assets/translations/FormsTranslations.json';
import profileTranslations
  from '../../../assets/translations/ProfileTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';

const CreateLink = () => {
  const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
  const [option, setOption]=useState(null);
  const [optionIndex, setOptionIndex]=useState(null);
const [error, setError]=useState(null);
const [link, setLink] = useState("");
const {addToDataBase}=useRealDatabase();
const [isPending, setIsPending] = useState(false);
const {user}=useAuthContext();
const {documents}=useGetDocuments('links');
const {dispatch}=useSnackbarContext();
const availableMedia = [
  "discord",
  "spotify",
 "youtube",
 "github" 
];
const links = documents.map((bookReader) => {
 return bookReader;
})
.filter((reader) => reader.belongsTo === user.uid);

  const handleSubmit=()=>{
    setError(null);
    setIsPending(true);

    try {
      const uniqueId = `${option}${new Date().getTime()}${user.uid}${uuidv4()}`;

      if (option === "discord") {
        if (!link.match("^.{3,32}#[0-9]{4}$")) {
          dispatch({type:"SHOW_SNACKBAR", payload:{message:alertMessages.notifications.wrong.discordName[selectedLanguage], alertType:'error'}});
          setIsPending(false);
          return;
        }

        if (links.find((exLink) => exLink.mediaType === option)) {
          dispatch({type:"SHOW_SNACKBAR", payload:{message:alertMessages.notifications.wrong[selectedLanguage], alertType:'error'}});
          setError(alertMessages.notifications.wrong[selectedLanguage]);
          setIsPending(false);
          return;
        }

        addToDataBase("links", uniqueId, {
          mediaType: option,
          nickname: link,
          belongsTo: user.uid,
          id: uniqueId,
        });
      } else {
        if (
          !link.match(
            "/(https?://)?(www.)?[a-zA-Z0-9]+.[a-zA-Z]{2,}([/w .-]*)*/?/"
          )
        ) {
          dispatch({type:"SHOW_SNACKBAR", payload:{message:alertMessages.notifications.wrong.urlError[selectedLanguage], alertType:'error'}});
          setError(
            alertMessages.notifications.wrong.urlError[selectedLanguage]
          );
          setIsPending(false);
          return;
        }

        if (links.find((exLink) => exLink.mediaType === option)) {
          dispatch({type:"SHOW_SNACKBAR", payload:{message:alertMessages.notifications.wrong[selectedLanguage], alertType:'error'}});
          setError(alertMessages.notifications.wrong[selectedLanguage]);
          setIsPending(false);
          return;
        }

        addToDataBase("links", uniqueId, {
          mediaType: option,
          linkTo: link,
          belongsTo: user.uid,
          id: uniqueId,
        });
      }

      setError(null);
      setIsPending(false);
    }catch(err){
      setError(err.message);
    }
  }
const theme=useTheme();
  return (
    <>
    <View style={{justifyContent:"center", flex:1, gap:8, backgroundColor:theme["color-basic-800"]}}>
      <Text style={{fontSize:24, color:"white", textAlign:"center", fontWeight:"800", fontFamily:"Inter-Black"}}>{profileTranslations.addLinkForm.topText[selectedLanguage]}</Text>

<Select style={{margin:4}} label={profileTranslations.addLinkForm.query[selectedLanguage]} selectedIndex={optionIndex} onSelect={(index)=>{
  setOption(index);
  setOptionIndex(index);
  console.log(index.row);
}}>
  {availableMedia.map((text)=>(<SelectItem title={text}/>))}
</Select>

{option && option.row === 0 && <View style={{margin:6}}>
  <Text style={{color:"white"}}>{formTranslations.userFields.nickname[selectedLanguage]}:</Text>
  <Input>
  <InputField color='white' placeholder={formTranslations.userFields.nickname[selectedLanguage]}/>
  </Input>
  </View>}

  {option && option.row > 0 && <View style={{margin:6}}>
  <Text style={{color:"white"}}>Link:</Text>
  <Input>
  <InputField color='white' placeholder={profileTranslations.addLinkForm.placeHolder[selectedLanguage]}/>
  </Input>
  </View>}

<Button onPress={handleSubmit} margin={6} sx={{
  "bg":accColor,
}} android_ripple={{
  color:primeColor
}} padding={6}>
  <ButtonText fontFamily='Inter-Black'>{formTranslations.submit[selectedLanguage]}</ButtonText>
</Button>


    </View>
    {isPending && <Loader/>}
    </>
  )
}

export default CreateLink