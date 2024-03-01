import React from 'react';

import { formatDistanceToNow } from 'date-fns';
import {
  Dimensions,
  Image,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { ScrollView } from '@gluestack-ui/themed';
import { Button } from '@rneui/themed';
import {
  Card,
  useTheme,
} from '@ui-kitten/components';

import {
  accColor,
  primeColor,
} from '../../assets/ColorsImport';
import translations
  from '../../assets/translations/NotificationsTranslations.json';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocuments from '../../hooks/useGetDocuments';
import { useRealDatabase } from '../../hooks/useRealDatabase';

const NotificationsScreen = () => {
const {documents}=useGetDocuments('notifications');
const {user}=useAuthContext();
const { updateDatabase, addToDataBase, removeFromDataBase } = useRealDatabase();
const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
const acceptRequest = async (notification, communityId, userData) => {
  updateDatabase(
    { ...notification, isRead: true },
    "notifications",
    `${notification.clubToJoin}-${notification.notificationTime}`
  );

  console.log(notification, communityId, userData);

  addToDataBase(
    `communityMembers/${communityId}/users`,
    userData.value.id,
    userData
  );

  console.log(communityId, userData);
};

  const readNotification = (notification) => {

    let notificationId;

    if(notification.notificationId){
      notificationId= `${notification.notificationId}-${notification.notificationTime}`;
    }else{
      notificationId=`${notification.clubToJoin}-${notification.notificationTime}`;
    }

    removeFromDataBase("notifications", notificationId);
};
const theme=useTheme();
  return (
    <View style={{backgroundColor:theme['color-basic-800'], flex:1}}>

      <ScrollView style={{maxHeight:500, margin:6}} showsVerticalScrollIndicator={false} contentContainerStyle={{gap:24, padding:8}}>

      {documents &&
      documents.length > 0 &&
      documents.filter(
        (notification) =>
          !notification.requestContent &&
          notification.directedTo === user.uid &&
          !notification.isRead
      ).length > 0 ?
        documents
          .filter(
            (notification) =>
              !notification.requestContent &&
              notification.directedTo === user.uid &&
              !notification.isRead
          ).map((notification) => (

  <Card footer={()=>(<View><Button onPress={() => {
            readNotification(notification);
          }} containerStyle={{padding:4}} buttonStyle={{maxWidth:150, alignSelf:"flex-end", backgroundColor:primeColor}}>Read</Button></View>)} style={{maxWidth:Dimensions.get('screen').width, gap:6, backgroundColor:accColor}}>
   
      <Text style={{color:"white", fontFamily:"Inter-Black", fontSize:13}}>{notification.notificationContent}</Text>
     <Text style={{alignSelf:"flex-end", color:"white", fontFamily:"Inter-Black", fontSize:11}}>{formatDistanceToNow(notification.notificationTime)}</Text>
    
          </Card>
          
          )) : <Text style={{ color: "white", fontFamily: "Inter-Black" }}>{translations.noNewStuff.notifiactions[selectedLanguage]}</Text>
      }

 {documents.length > 0 &&
          documents.filter(
            (doc) =>
              doc.requestContent && doc.directedTo === user.uid && !doc.isRead
          ).length > 0 ?
            documents
              .filter(
                (doc) =>
                  doc.requestContent &&
                  doc.directedTo === user.uid &&
                  !doc.isRead
              ).map((item)=>(<Card footer={()=>(<View style={{flexDirection:"row", justifyContent:"flex-end", gap:16, padding:8, backgroundColor:accColor}}>
              <Button onPress={()=>{
                acceptRequest(item, item.clubToJoin, item.joinerData);
              }} size='sm' color='success' icon={{name:"check", type:"material-community", color:"white"}} titleStyle={{color:"white", fontFamily:"Inter-Black"}}>Accept</Button>
              <Button onPress={()=>{
                readNotification(item);
              }} size='sm' color='error' icon={{name:"close-circle", type:"material-community", color:"white"}} titleStyle={{color:"white", fontFamily:"Inter-Black"}}>Reject</Button>
            </View>)}>
          <View style={{gap:8}}>
            <View style={{gap:16, flexDirection:"row", alignItems:"center"}}>
              <Image source={{uri:item.joinerData.value.photoURL}}  style={{width:40, height:40, borderRadius:100}}/>
              <Text style={{color:"white", fontFamily:"Inter-Black"}}>{item.joinerData.value.nickname}</Text>
            </View>
            <Text style={{color:"white", fontFamily:"Inter-Black"}}>{item.requestContent}</Text>
          </View>
              </Card>))  : <Text style={{color:"white", fontFamily:"Inter-Black"}}>{translations.noNewStuff.requests[selectedLanguage]}</Text>}
      </ScrollView>

    </View>
  )
}

export default NotificationsScreen