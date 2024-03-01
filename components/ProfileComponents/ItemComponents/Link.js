import React, { useState } from 'react';

import * as Clipboard from 'expo-clipboard';
import { useSelector } from 'react-redux';

import {
  FontAwesome,
  FontAwesome5,
} from '@expo/vector-icons';
import IonIcons from '@expo/vector-icons/Ionicons';
import { Link } from '@gluestack-ui/themed';
import { Button } from '@rneui/themed';

import {
  github,
  spotify,
  youtube,
} from '../../../assets/ColorsImport';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';

const LinkItem = ({linkData}) => {
  const [copiedText, setCopiedText]=useState('');
  const {dispatch}=useSnackbarContext();
  const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
const copyNickname= async (value)=>{
  await Clipboard.setStringAsync(value);
  dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.successfull.copied[selectedLanguage]}`, alertType:"success"}})
  };
  const { removeFromDataBase} = useRealDatabase();
  const removeLink = () => {
    removeFromDataBase('links', linkData.id);
  }

const fetchCopiedText = async () => {
  const text = await Clipboard.getStringAsync();
  setCopiedText(text);
};
  return (
   <>
   {linkData.mediaType === "discord" ? <Link flexDirection='row' gap={6} onPress={async ()=>{
    await copyNickname(linkData.nickname)
    await fetchCopiedText();
    }}>
        <FontAwesome5 name="discord" size={54} color="white" />
        <Button type='clear' icon={{name:"delete", type:"material-community", size:24, color:"red"}} onPress={removeLink}></Button>
    </Link> : <Link href={linkData.linkTo}>
    {linkData.mediaType === "spotify" ? (
        
        <FontAwesome name='spotify' color={spotify}/>
     
                    ) : linkData.mediaType === "youtube" ? (
                     
                        <IonIcons name='logo-youtube' color={youtube}/>
                
                    ) : linkData.mediaType === "github" ? (
                 
                        <IonIcons name='logo-github' color={github}/>
              
                    ) : (
                      <Text></Text>
                    )}
        </Link>}
   </>
  )
}

export default LinkItem