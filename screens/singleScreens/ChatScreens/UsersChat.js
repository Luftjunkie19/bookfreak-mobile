import React, {
  useRef,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';
import { randomUUID } from 'expo-crypto';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { Appbar } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';

import {
  Input,
  InputField,
} from '@gluestack-ui/themed';
import { Button } from '@rneui/themed';
import { useTheme } from '@ui-kitten/components';

import {
  accColor,
  modalAccColor,
  primeColor,
} from '../../../assets/ColorsImport';
import alertsMessages from '../../../assets/translations/AlertMessages.json';
import ImageShowCase from '../../../components/MessagesComponent/ImageShowCase';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import useRealtimeDocuments from '../../../hooks/useRealtimeDocuments';
import { useSelectPhoto } from '../../../hooks/useSelectPhoto';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';
import useStorage from '../../../hooks/useStorage';

const UsersChat = ({route, navigation}) => {
  const {id}=route.params;
  const { user } = useAuthContext();
  const {dispatch}=useSnackbarContext();
  const [message, setMessage] = useState("");
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const { addToDataBase } = useRealDatabase();
  const { getDocuments } = useRealtimeDocuments();
  const messagesHolder = useRef();
const {selectMultiplePhotos, messagePhotos, clearPhotosArray}=useSelectPhoto();
const [imageMessages, setImageMessages]=useState(messagePhotos);
const {uploadConvertedUri}=useStorage();
  const updateImageMessage = (index, message) => {
    console.log(messagePhotos);
    const updatedImageMessages = [...messagePhotos];
    updatedImageMessages[index].message = message;
    setImageMessages(updatedImageMessages);
  };

  const {document: currentChat}=useGetDocument("usersChats", id);
const {documents: users}=useGetDocuments('users');
const {documents:messagesObjects}=useGetDocuments("usersChatMessages");

const messages=messagesObjects.map((obj) => {
  const nestedObject = Object.values(obj);
  return nestedObject;
}).flat();


  const sendMessage = async () => {
    if (!currentChat) {
      const entitledUsers = id.split("-");

      addToDataBase("usersChats", id, {
        chatId: id,
        createdAt: new Date().getTime(),
      });

      addToDataBase(
        "entitledToChat",
        `${id}/${entitledUsers.find((id) => id === user.uid)}`,
        {
          entitledUserId: entitledUsers.find((id) => id === user.uid),
          entitledChatId: id,
        }
      );

      addToDataBase(
        "entitledToChat",
        `${id}/${entitledUsers.find((id) => id !== user.uid)}`,
        {
          entitledUserId: entitledUsers.find((id) => id !== user.uid),
          entitledChatId: id,
        }
      );

      addToDataBase(
        "usersChatMessages",
        `${id}/${new Date().getTime()}${randomUUID()}`,
        {
          content: message,
          id,
          sender: {
            id: user.uid,
          },
          receiver: {
            id: entitledUsers.find((id) => id !== user.uid),
          },
          sentAt: new Date().getTime(),
        }
      );

      setMessage("");
      return;
    }

    if (message.trim() === "") {
      dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertsMessages.notifications.wrong.emptyField[selectedLanguage]}`, alertType:"error"}});
      return;
    }

    if (currentChat) {
      const entitledUsers = id.split("-");
      addToDataBase(
        "usersChatMessages",
        `${id}/${new Date().getTime()}${randomUUID()}`,
        {
          content: message,
          chatId:id,
          sender: {
            id: user.uid,
          },
          receiver: {
            id: entitledUsers.find((id) => id !== user.uid),
          },
          sentAt: new Date().getTime(),
        }
      );

      setMessage("");
      return;
    }
  };

  const [imgURL, setImgURL]=useState(null);

  const sendAllImages =  async () => {
    try {
      for (let i = 0; i < imageMessages.length; i++) {
        const { uri, message } = imageMessages[i];

      const messagedPhoto= await uploadConvertedUri(uri, `messages/uid${user.uid}-${id}/${uri}`);

        const entitledUsers = id.split("-");
        if (!currentChat) {
          addToDataBase("usersChats", id, {
            chatId: id,
            createdAt: new Date().getTime(),
          });

          addToDataBase(
            "entitledToChat",
            `${chatId}/${entitledUsers.find((id) => id === user.uid)}`,
            {
              entitledUserId: entitledUsers.find((id) => id === user.uid),
              entitledChatId: id,
            }
          );

          addToDataBase(
            "entitledToChat",
            `${chatId}/${entitledUsers.find((id) => id !== user.uid)}`,
            {
              entitledUserId: entitledUsers.find((id) => id !== user.uid),
              entitledChatId: id,
            }
          );

       

         addToDataBase(
            "usersChatMessages",
            `${chatId}/${new Date().getTime()}${randomUUID()}`,
            {
              content: messagedPhoto,
              message,
              chatId:id,
              sender: {
                id: user.uid,
              },
              receiver: {
                id: entitledUsers.find((id) => id !== user.uid),
              },
              sentAt: new Date().getTime(),
            }
          );
        } else {
          // ... (similar logic as before)

         addToDataBase(
            "usersChatMessages",
            `${id}/${new Date().getTime()}${randomUUID()}`,
            {
              content: messagedPhoto,
              message,
              chatId:id,
              sender: {
                id: user.uid,
              },
              receiver: {
                id: entitledUsers.find((id) => id !== user.uid),
              },
              sentAt: new Date().getTime(),
            }
          );
        }
      }

      clearPhotosArray();
      setImageMessages([]);
    } catch (error) {
      console.error("Error sending messages:", error);
    }
  };

  const theme=useTheme();

const scale=useSharedValue(1);
const translateY=useSharedValue(0);
const translateX=useSharedValue(0);

const animatedStyles=useAnimatedStyle(()=>{
  return {
    transform:[{scale: withSpring(scale.value)}, {translateX:withSpring(translateX.value)}, {translateY: withSpring(translateY.value)}],
  }
});

const onPressOut=()=>{
  scale.value=1;
  translateX.value=0;
  translateY.value=0;
}
const onPress=()=>{
  scale.value=0.8;
  translateX.value=5;
  translateY.value=-15;
};

  return (
    <>
   <Appbar.Header mode='small' style={{backgroundColor:primeColor}}>
   <Appbar.BackAction color='white' rippleColor={accColor} onPress={()=>{
    navigation.navigate('chats');
   }} />
   <View style={{flexDirection:"row", gap:24, alignItems:"center"}}>
<Image source={{uri:users.filter(
                                (chatter) =>
                                  chatter.id === id.split("-")[0] ||
                                  chatter.id === id.split("-")[1]
                              ).find(
                                (chatter) =>
                                  chatter.id !== user.uid
                              )?.photoURL}} style={{width:50, height:50, borderRadius:100}}/>
<Text style={{fontSize:14, color:"white", fontFamily:'Inter-Black'}}>{users.filter(
                                (chatter) =>
                                  chatter.id === id.split("-")[0] ||
                                  chatter.id === id.split("-")[1]
                              ).find(
                                (chatter) =>
                                  chatter.id !== user.uid
                              )?.nickname}
</Text>
   </View>
   
 </Appbar.Header>
        <ScrollView ref={messagesHolder} style={{gap:8, backgroundColor:theme["color-basic-800"]}}>
 {messages.length > 0 &&
        messages
          .filter((message) => message.chatId === id)
          .map((message, i) => (
            <>
              {message.sender.id === user.uid ? (
                <View key={message.sentAt} style={{flexDirection:'row-reverse', gap:12,margin:6, alignSelf:"flex-end"}}>
          <View>
<Image source={{uri:  users.filter(
                                (chatter) =>
                                  chatter.id === message.chatId.split("-")[0] ||
                                  chatter.id === message.chatId.split("-")[1]
                              ).find(
                                (chatter) =>
                                  chatter.id === message.sender.id &&
                                  chatter.id === user.uid
                              )?.photoURL}} style={{width:50, height:50, borderRadius:100}}/>

          </View>
                  <View>
                  <Text style={{fontSize:12, color:"white", padding:2, fontFamily:'Inter-Black'}}>
                    {formatDistanceToNow(message.sentAt)} ago
                  </Text>
                  <View style={{backgroundColor:accColor, maxWidth:Dimensions.get("screen").width/1.25, padding:12, borderBottomRightRadius:15, borderBottomLeftRadius:15, borderTopLeftRadius:15}}>
                    {message?.content &&
                    message?.content.includes(
                      "https://firebasestorage.googleapis.com/"
                    ) ? (
                      <>
                        <Image
                          source={{ uri: message?.content }}
                          style={[{ width: 140, height: 120, borderRadius:8, zIndex:500  }]}
                        />
                         <Text style={{color:"white", fontFamily:'Inter-Black'}}>{message?.message}</Text>
                      </>
                    ) : (
                      <Text style={{color:"white", fontFamily:'Inter-Black'}}>{message?.content}</Text>
                    )}
                  </View>
                  </View>
                </View>
              ) : (
                <View  key={message.sentAt} style={{flexDirection:"row",margin:4, gap:12, alignSelf:"flex-start"}}>
                  
<Image source={{uri:  users.filter(
                                (chatter) =>
                                  chatter.id === message.chatId.split("-")[0] ||
                                  chatter.id === message.chatId.split("-")[1]
                              ).find(
                                (chatter) =>
                                  chatter.id === message.sender.id &&
                                  chatter.id !== user.uid
                              )?.photoURL}} style={{width:50, height:50, borderRadius:100}}/>

         <View>
                  <Text style={{fontSize:12, color:"white", padding:2, fontFamily:'Inter-Black'}}>
                    {formatDistanceToNow(message.sentAt)} ago
                  </Text>
                  <View style={{backgroundColor:primeColor, padding:12, maxWidth:Dimensions.get("screen").width/1.25, borderBottomRightRadius:15, borderBottomLeftRadius:15, borderTopRightRadius:15}}>
                    {message?.content &&
                    message?.content.includes(
                      "https://firebasestorage.googleapis.com/"
                    ) ? (
                      <>
                      <TouchableNativeFeedback key={message?.content} onPressOut={onPressOut} onPressIn={
                        onPress
                      }>
<View>
<Animated.Image  source={{ uri: message?.content }}
                          style={[{ width: 140, height: 120, borderRadius:8, zIndex:500  }, animatedStyles]}
                        />
</View>
                      </TouchableNativeFeedback>
                       
                        <Text style={{color:"white", fontFamily:'Inter-Black'}}>{message?.message}</Text>
                      </>
                    ) : (
                      <Text style={{color:"white", fontFamily:'Inter-Black'}}>{message?.content}</Text>
                    )}
                  </View>
         </View>
                </View>
              )}
            </>
          ))}
        
    </ScrollView>
    {messagePhotos.length > 0 && <ScrollView showsHorizontalScrollIndicator={false} style={{margin:6}} contentContainerStyle={{gap:16,}} maxWidth scrollEnabled horizontal>
      {messagePhotos.map((imgMessage, index)=>(
             <View key={index} style={{ width: 200, height: 250, position:"relative", top:0, left:0}}>
            <Image source={{ uri: imgMessage.uri }} style={{ width: 200, height: 200 }} />
           <Input style={{position:"absolute", left:0, top:"43%"}} backgroundColor={modalAccColor} width={200} height={40}>
           <InputField fontFamily='OpenSans-Regular' color='white' size='xs' scrollEnabled onChangeText={(value)=>{
            updateImageMessage(index, value);
           }}/>
           </Input>
           </View>
      ))}
    </ScrollView>
    }

{imgURL && <ImageShowCase imgURL={imgURL}/>}

    <View style={{flexDirection:"row", backgroundColor:accColor, minHeight:80, padding:12, gap:8, justifyContent:"space-between"}}>
            <Button buttonStyle={{backgroundColor:primeColor,}} onPress={selectMultiplePhotos} icon={{type:"material-community", name:"image", color:'white'}}></Button>
            <Input minWidth={250}>
            <InputField fontFamily='OpenSans-Regular' color='white' value={message} onChangeText={setMessage}/>
            </Input>
         <Button buttonStyle={{backgroundColor:primeColor,}} onPress={async ()=>{
          if(imageMessages.length > 0){
            sendAllImages();
          }else{
           await sendMessage();
          }
         }} icon={{type:"material-community", name:"send", color:'white'}}></Button>
          </View>
    </>

  )
}

export default UsersChat