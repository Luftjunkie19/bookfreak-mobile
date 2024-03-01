import React, { useState } from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import {
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import { Button } from '@rneui/themed';
import { useTheme } from '@ui-kitten/components';

import {
  accColor,
  primeColor,
} from '../../assets/ColorsImport';
import alertTranslations from '../../assets/translations/AlertMessages.json';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import { useSnackbarContext } from '../../hooks/useSnackbarContext';

const CommunityChat = ({route, navigation}) => {
const {user}=useAuthContext();
const {id}=route.params.params;
const {addToDataBase}=useRealDatabase();
const {documents}=useGetDocuments(`communityChats/${id}/messages`);
const {document}=useGetDocument(`competitions/${id}`);
const {dispatch}=useSnackbarContext();
const expirationTime= document && (document.expiresAt - new Date().getTime()) / 86400000;
const theme=useTheme();
const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
const [message, setMessage]=useState('');
const [isLoading, setLoading]=useState(false);

const sendMessage = async () => {
  if (message.trim() === "") {
    dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertTranslations.notifications.wrong.emptyMessage[selectedLanguage]}`, alertType:"error"}});

    return;
  }
  setLoading(true);

  addToDataBase(
    "communityChats",
    `${id}/messages/${id}${user.uid}${new Date().getTime()}`,
    {
      content: message,
      communityChatId: id,
      sentBy: {
        nickname: user.displayName,
        photoURL: user.photoURL,
        id: user.uid,
      },
      sentAt: new Date().getTime(),
    }
  );

  [].map(async (member) => {
    /**({
      notificationContent: `${user.displayName} has sent a message in your ${collectionName}'s chat`,
      directedTo: member.value.id,
      linkTo: `${
        collectionName === "competitions" ? "competition" : "readers-clubs"
      }/${id}/${
        collectionName === "competitions" ? "competition-chat" : "chat"
      }`,
      isRead: false,
      notificationTime: Timestamp.fromDate(new Date()),
      sentTo: id,
    });**/
  });
  setLoading(false);
  setMessage("");
};


  return ( 
  <>
  <ScrollView style={{backgroundColor:theme["color-basic-800"]}} contentContainerStyle={{gap:12, marginTop:16}}> 
      {documents && documents.length > 0 && documents.map((item, index)=>( <View key={index} style={{ flexDirection: item.sentBy.id === user.uid ? "row" : "row-reverse", gap: 10, alignItems: 'center', marginLeft: 6, alignSelf: item.sentBy.id === user.uid ? "flex-start" : "flex-end" }}>
            <Image source={{ uri: item.sentBy.photoURL }} style={{ width: 50, height: 50, borderRadius: 100 }} />
            <View style={{ backgroundColor: accColor, minWidth: 100, maxWidth: "80%", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 15 }}>
              <Text style={{ color: 'white', fontFamily: 'Inter-Black' }}>{item.content}</Text>
            </View>
          </View>))}
  </ScrollView>


  <View style={{flexDirection:"row", backgroundColor:accColor, minHeight:90, padding:12, gap:8, justifyContent:"space-between", alignItems:"center"}}>
            <Textarea  isDisabled={expirationTime < 0} maxWidth={280} maxHeight={45}>
            <TextareaInput color='white' fontFamily='OpenSans-Regular' value={message} scrollEnabled onChangeText={setMessage} onSubmitEditing={sendMessage}/>
            </Textarea>
         <Button onPress={sendMessage} icon={{type:"material-community", name:"send", color:"white"}} buttonStyle={{backgroundColor:primeColor}}></Button>
          </View>
        
  </>
  

)
}

export default CommunityChat