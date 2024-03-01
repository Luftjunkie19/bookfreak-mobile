import React from 'react';

import { formatDistanceToNow } from 'date-fns';
import {
  Image,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';

import { ScrollView } from '@gluestack-ui/themed';
import { Button } from '@rneui/themed';
import { useTheme } from '@ui-kitten/components';

import {
  accColor,
  userColumnBgCol,
} from '../../../assets/ColorsImport';
import alertTranslations from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/ClubsTranslations.json';
import formsTranslations
  from '../../../assets/translations/FormsTranslations.json';
import reusableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import useRealtimeDocuments from '../../../hooks/useRealtimeDocuments';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';
import CommunityList from '../Competition/CommunityLists/CommunityList';

const OverallClub = ({route}) => {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const {dispatch}=useSnackbarContext();
  const {id}=route.params.params;
  const {documents:members}=useGetDocuments(`communityMembers/${id}/users`);
  const {document:communityObject}=useGetDocument('readersClubs', id);
  const {documents:readersObjects}=useGetDocuments('bookReaders');
  const {getDocuments}=useRealtimeDocuments();
  const readers=readersObjects.map((bookReader) => {
    return bookReader.readers;
  }).map((obj) => {
    const nestedObject = Object.values(obj);
    return nestedObject;
  }).flat();
  const {user}=useAuthContext();
const theme=useTheme();
const {addToDataBase}=useRealDatabase();
const isUserMember= members && members.find((member)=>member.value.id === user.uid);
const sendJoiningRequest = async () => {
  try {
    const ClubswithMembers = await getDocuments("communityMembers");

    const membersOfClubsEls = ClubswithMembers.map((club) => {
      return club.users;
    });

    const allMembersEls = membersOfClubsEls.map((object) => {
      return Object.values(object);
    });

    const finalConversion = allMembersEls.flat();

    if (
      finalConversion.find(
        (member) =>
          member.value.id === user.uid &&
          member.belongsTo.includes("readersClub")
      )
    ) {
     dispatch({type:"SHOW_SNACKBAR", payload:{message:alertTranslations.notifications.wrong.loyality[selectedLanguage], alertType:"error"}});
      return;
    }

    addToDataBase("notifications", `${communityObject.id}-${new Date().getTime()}`, {
      requestContent: `${user.displayName} sent a request to join ${communityObject.clubsName}`,
      directedTo: `${communityObject.createdBy.id}`,
      clubToJoin: `${communityObject.id}`,
      isRead: false,
      requestTo: "readersClubs",
      notificationTime: new Date().getTime(),
      joinerData: {
        label: user.displayName,
        belongsTo: communityObject.id,
        value: {
          nickname: user.displayName,
          id: user.uid,
          photoURL: user.photoURL,
        },
      },
    });
    dispatch({type:"SHOW_SNACKBAR", payload:{message:alertTranslations.notifications.successfull.send[selectedLanguage], alertType:"success"}});
    console.log(members);

  
  } catch (err) {
    console.log(err);
  }
};


  return (
    <ScrollView contentContainerStyle={{gap:8}} style={{backgroundColor:theme["color-basic-800"]}}>
  {communityObject && <>
  <Image source={{uri:communityObject.clubLogo}} style={{width:200, height:200, alignSelf:"center", margin:8, borderRadius:100}}/>
  <Text style={{color:"white", fontFamily:"Inter-Black"}}>{translations.clubObject.clubsName[selectedLanguage]}: {communityObject.clubsName}</Text>
  {!isUserMember && <Button onPress={sendJoiningRequest} icon={{type:"material-community", name:"account-arrow-right", color:"white"}} buttonStyle={{maxWidth:250, backgroundColor:accColor, margin:6}}>{reusableTranslations.joinTo.club[selectedLanguage]}</Button>}
<Text style={{color:"white", fontFamily:"Inter-Black"}}>{reusableTranslations.detailsText[selectedLanguage]}</Text>

  <Text style={{color:"white", fontFamily:"Inter-Black"}}>{translations.clubObject.createdBy[selectedLanguage]} {communityObject.createdBy.displayName}</Text>
  <Text style={{color:"white", fontFamily:"Inter-Black"}}>{translations.clubObject.community[selectedLanguage]}: {members.length} {translations.clubObject.members[selectedLanguage]}</Text>
  <Text style={{color:"white", fontFamily:"Inter-Black"}}>{translations.clubObject.community[selectedLanguage]} {translations.clubObject.founded.one[selectedLanguage]}: {formatDistanceToNow(communityObject.createdBy.createdAt)} ago</Text>
  <Text style={{color:"white", fontFamily:"Inter-Black"}}>{translations.clubObject.pagesRequiredText[
                          selectedLanguage
                        ]
                      }: {communityObject.requiredPagesRead} {reusableTranslations.pagesText[selectedLanguage]}</Text>

  <CommunityList communityMembers={members} readerObjects={readersObjects} communityObject={communityObject} expirationTimeNumber={null} />
  
  <Text style={{color:"white", fontFamily:"Inter-Black"}}> {
                        formsTranslations.descriptionTextarea.label[
                          selectedLanguage
                        ]
                      }</Text>
 <ScrollView scrollEnabled style={{backgroundColor:userColumnBgCol, padding:6}}>
  <Text style={{color:"white", fontFamily:"Inter-Black"}}>{communityObject.description}</Text>
                        </ScrollView>
  </>}
    </ScrollView>
  )
}

export default OverallClub