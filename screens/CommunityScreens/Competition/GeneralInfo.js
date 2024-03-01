import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { Button } from '@rneui/themed';
import { useTheme } from '@ui-kitten/components';

import {
  accColor,
  userColumnBgCol,
} from '../../../assets/ColorsImport';
import alertTranslations from '../../../assets/translations/AlertMessages.json';
import competitionTranslations
  from '../../../assets/translations/CompetitionsTranslations.json';
import translations
  from '../../../assets/translations/ReusableTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';
import CommunityList from './CommunityLists/CommunityList';

const GeneralInfo = ({route, navigation}) => {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const {dispatch}=useSnackbarContext();
  const {id}=route.params.params;
  const {documents:members}=useGetDocuments(`communityMembers/${id}/users`);
  const {document:communityObject}=useGetDocument('competitions', id);
  const {documents:readersObjects}=useGetDocuments('bookReaders');
  const competitionExpirationDate =
  communityObject && (communityObject.expiresAt - new Date().getTime()) / 86400000;
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
const sendJoiningRequest =  () => {
    addToDataBase("notifications", `${communityObject.id}-${new Date().getTime()}`, {
      requestContent: `${user.displayName} sent a request to join ${communityObject.competitionTitle}`,
      directedTo: `${communityObject.createdBy.id}`,
      clubToJoin: `${communityObject.id}`,
      isRead: false,
      requestTo: "competitions",
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

    dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertTranslations.notifications.successfull.send[selectedLanguage]}`, alertType:"success"}});
};


  return (
<>
    <ScrollView style={{backgroundColor:theme["color-basic-800"]}}>
{communityObject && 

<View style={{gap:6,}}>
  <Text style={{color:"white", fontFamily:"Inter-Black", fontSize:24}}>{communityObject.competitionTitle}</Text>
  <Text style={{color:"white", fontFamily:"Inter-Black", fontSize:18}}>{communityObject.competitionsName}</Text>
 <Text style={{color:"white", fontFamily:"Inter-Black", fontSize:16}}>{competitionTranslations.competitionObject.createdBy[selectedLanguage]} {communityObject.createdBy.displayName}</Text>
 {!isUserMember && Math.round(competitionExpirationDate) > 0 && <Button onPress={sendJoiningRequest} icon={{type:"material-community", name:"account-arrow-right", color:"white"}} buttonStyle={{maxWidth:250, backgroundColor:accColor, margin:6}}>{translations.joinTo.competition[selectedLanguage]}</Button>}
  {Math.round(competitionExpirationDate) > 0 && <Text style={{color:"white", fontFamily:"Inter-Black", fontSize:24}}> {
        competitionTranslations.competitionObject.expiration
                          .notExpired.part1[selectedLanguage]
                      }{" "}
                      {
                        competitionTranslations.competitionObject.expiration
                          .notExpired.part2.notToday.expiresIN[selectedLanguage]
                      }
                      
                      <Text style={{color:"red", fontFamily:"Inter-Black", fontSize:24}}>{" "}
                            {Math.round(competitionExpirationDate)}{" "}
                            {
                              competitionTranslations.competitionObject
                                .expiration.notExpired.part2.notToday[
                                selectedLanguage
                              ]
                            }</Text>
                      
                      </Text>}
{Math.round(competitionExpirationDate) === 0 && <Text style={{color:"white", fontFamily:"Inter-Black", fontSize:24}}>
{competitionTranslations.competitionObject.expiration.notExpired.part1[selectedLanguage]} 

<Text style={{color:"red", fontFamily:"Inter-Black", fontSize:24}}>{' '}
{competitionTranslations.competitionObject.expiration.notExpired.part2.today[selectedLanguage]}
</Text>

  </Text>}

{Math.round(competitionExpirationDate) < 0 && <Text style={{color:"red", fontFamily:"Inter-Black", fontSize:20}}>{
                        competitionTranslations.competitionObject.expiration
                          .Expired.part1[selectedLanguage]
                      }{" "}
                        {competitionExpirationDate <= -1
                          ? `${Math.round(competitionExpirationDate) * -1} ${
                              competitionTranslations.competitionObject
                                .expiration.Expired.part2.notToday[
                                selectedLanguage
                              ]
                            }`
                          : ` ${competitionTranslations.competitionObject.expiration.Expired.part2.today[selectedLanguage]}`}
                      
                      </Text>}



  {communityObject.prize.moneyPrize.amount === 0 ? 
  <View>
  <View style={{flexDirection:"row", alignItems:"center", gap:24, justifyContent:"space-between"}}>
    <View>
<Text style={{fontSize:24, fontFamily:"Inter-Black", textTransform:"capitalize", color:"gold"}}>{competitionTranslations.competitionObject.prize[selectedLanguage]}: {communityObject.prize.itemPrize.typeOfPrize}</Text>
</View>
<Image source={require('../../../assets/ItemReward.webp')} style={{height:80, width:80}}/>
  </View>    
  {communityObject.prize.moneyPrize.amount === 0 && 
  <>
<Text style={{fontSize:18, fontFamily:"Inter-Black", color:"white"}}>{competitionTranslations.competitionObject.prizeDetails[selectedLanguage]}:</Text>
  <ScrollView scrollEnabled style={{backgroundColor:userColumnBgCol, padding:6}}>
    <Text style={{fontSize:14, fontFamily:"Inter-Black", color:"white"}}>{communityObject.prize.itemPrize.title}</Text>
    </ScrollView>
  </>
    }
  </View>
 : <View style={{flexDirection:"row", gap:16, alignItems:"center", justifyContent:"space-between"}}>
  <View>
<Text style={{fontSize:24, fontFamily:"Inter-Black", textTransform:"capitalize", color:"gold"}}>{competitionTranslations.competitionObject.prize[selectedLanguage]}: {(communityObject.prize.moneyPrize.amount / 100).toFixed(2)} {communityObject.prize.moneyPrize.currency}</Text>
  </View>

  <Image source={require('../../../assets/MoneyPrize.webp')} style={{height:80, width:80}}/>
    </View>}
</View>

}

      <View>
<Text style={{textAlign:"center", color:"white", padding:8, fontFamily:"Inter-Black", fontSize:20}}>Members</Text>
      <CommunityList expirationTimeNumber={competitionExpirationDate} communityObject={communityObject} communityMembers={members} readerObjects={readers}/>
      </View>
{communityObject &&
<>
<Text style={{fontSize:18, fontFamily:"Inter-Black", color:"white"}}>Description:</Text>
<ScrollView scrollEnabled style={{backgroundColor:userColumnBgCol, maxHeight:160}}>
  <Text style={{fontFamily:"Inter-Black", color:"white", fontSize:12}}>{communityObject.description}</Text>
</ScrollView>
</>
}


    </ScrollView> 
</>
  )
}

export default GeneralInfo