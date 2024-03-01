import React, { useLayoutEffect } from 'react';

import { formatDistanceToNow } from 'date-fns';
import LottieView from 'lottie-react-native';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Button } from '@rneui/themed';
import { useTheme } from '@ui-kitten/components';

import { accColor } from '../../../assets/ColorsImport';
import translations from '../../../assets/translations/ChatsTranslation.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocuments from '../../../hooks/useGetDocuments';

const AllYourChats = ({navigation}) => {
  const { user } = useAuthContext();
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
const {documents}=useGetDocuments('usersChats');
const {documents:users}=useGetDocuments('users');
const {documents:chatMessagesObjects}=useGetDocuments("usersChatMessages");
const chatMessages=chatMessagesObjects.map((obj) => {
  const nestedObject = Object.values(obj);
  return nestedObject;
}).flat();
const {documents:entitledToChatMembers}=useGetDocuments("entitledToChat");
const entitledToChat= entitledToChatMembers.map((obj) => {
  const nestedObject = Object.values(obj);
  return nestedObject;
}).flat();


const theme=useTheme();


useLayoutEffect(()=>{
  navigation.setOptions({
    headerLeft:({})=>(<Button icon={{type:"material-community", name:"arrow-left"}} type='clear'/>)
  })
},[]);

  return (
    <ScrollView style={{backgroundColor:theme["color-basic-800"]}}>
     {documents.filter(
          (chat) =>
            chat.chatId.split("-")[0] === user.uid ||
            chat.chatId.split("-")[1] === user.uid
        ).length > 0 ? <>
{documents.filter(
          (chat) =>
            chat.chatId.split("-")[0] === user.uid ||
            chat.chatId.split("-")[1] === user.uid
        ).map((chat, index)=>(<TouchableNativeFeedback onPress={()=>{
          navigation.navigate('UsersChatScreen',{
            id: chat.chatId,
          });
        }}>
          <View style={{padding:12, gap:12, backgroundColor:accColor, margin:12, borderRadius:6}}>
          <View style={{flexDirection:"row", alignItems:"center", gap:24}}>
           <Image style={{width:60, height:60, borderRadius:100}} source={{uri: users
                            .filter(
                              (chatter) =>
                              chat.chatId.split("-")[0] === chatter.id ||
                              chat.chatId.split("-")[1] === chatter.id
                            )
                            .find((chatter) => chatter.id !== user.uid)
                            ?.photoURL}}/> 
                            <Text style={{fontFamily:"Inter-Black", color:"white"}}> {
                  users
                      .filter(
                        (chatter) =>
                        chat.chatId.split("-")[0] === chatter.id ||
                        chat.chatId.split("-")[1] === chatter.id
                      )
                      .find((chatter) => chatter.id !== user.uid)?.nickname}</Text>
          </View>
<View style={{flexDirection:"row", justifyContent:"space-between", paddingVertical:6}}>
  <Text style={{color:"white", fontFamily:"Inter-Black"}}>
  {chatMessages.filter(
                          (message) => message.chatId === chat.chatId
                        ).length > 0 &&
                          users.find(
                            (chatter) =>
                              chatter.id ===
                              chatMessages.filter(
                                (message) => message.chatId === chat.chatId
                              )[
                                chatMessages.filter(
                                  (message) => message.chatId === chat.chatId
                                ).length - 1
                              ].sender.id
                          )?.nickname}
                        :{" "}
                        {chatMessages.filter(
                          (message) => message.chatId === chat.chatId
                        ).length > 0 &&
                        chatMessages
                          .filter((message) => message.chatId === chat.chatId)
                          [
                            chatMessages.filter(
                              (message) => message.chatId === chat.chatId
                            ).length - 1
                          ]?.content.includes(
                            "https://firebasestorage.googleapis.com/"
                          ) ? (
                          <>
                            <FontAwesome style={{marginLeft:6}} name='image'/> Image
                          </>
                        ) : (
                          <>
                            {chatMessages
                              .filter(
                                (message) => message.chatId === chat.chatId
                              )
                              [
                                chatMessages.filter(
                                  (message) => message.chatId === chat.chatId
                                ).length - 1
                              ]?.content.length > 5 ? `${chatMessages
                              .filter(
                                (message) => message.chatId === chat.chatId
                              )
                              [
                                chatMessages.filter(
                                  (message) => message.chatId === chat.chatId
                                ).length - 1
                              ]?.content.substring(0, 5)}...` : chatMessages
                              .filter(
                                (message) => message.chatId === chat.chatId
                              )
                              [
                                chatMessages.filter(
                                  (message) => message.chatId === chat.chatId
                                ).length - 1
                              ]?.content}
                          </>
                        )}

  </Text>
  <Text style={{color:"white", fontFamily:"Inter-Black", fontSize:12, alignSelf:"center"}}>
  {chatMessages.filter(
                          (message) => message.chatId === chat.chatId
                        ).length > 0 &&
                          formatDistanceToNow(
                            chatMessages.filter(
                              (message) => message.chatId === chat.chatId
                            )[
                              chatMessages.filter(
                                (message) => message.chatId === chat.chatId
                              ).length - 1
                            ].sentAt
                          )}{" "}
                        ago
  </Text>
</View>     
          </View>
        </TouchableNativeFeedback>))}
        </> : <View>
            <Text style={{color:"white", paddingVertical:8, fontFamily:"Inter-Black", fontSize:24, textAlign:"center"}}>
              {translations.chatsEmpty[selectedLanguage]}.
            </Text>
            <LottieView source={require('./../../../assets/lottieAnimations/Animation - 1706551233746.json')} autoPlay style={{width:Dimensions.get('screen').width, height:250, alignSelf:"center"}}/>
          </View>}
    </ScrollView>
  )
}

export default AllYourChats