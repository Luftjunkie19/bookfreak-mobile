import React, { useState } from 'react';

import { httpsCallable } from 'firebase/functions';
import {
  ScrollView,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import { useTheme } from '@ui-kitten/components';

import { accColor } from '../../../assets/ColorsImport';
import alertTranslations from '../../../assets/translations/AlertMessages.json';
import translations
  from '../../../assets/translations/ReusableTranslations.json';
import Loader from '../../../components/Loader';
import { functions } from '../../../firebaseConfig';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import useRealtimeDocument from '../../../hooks/useRealtimeDocument';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';

const CompetitionActionsScreen = ({route}) => {
  const selectedLanguage = useSelector((state) => state.languageSelection.selectedLangugage);
  const [isOpen, setOpen] = useState(false);
  const [isPending, setIsPending]=useState(false);
  const {id}=route.params.params;
  const {removeFromDataBase}=useRealDatabase();
  const {document}=useGetDocument('competitions', id);
  const {getDocument}=useRealtimeDocument();
  const sendRefund=httpsCallable(functions,'sendRefund');
  const {dispatch}=useSnackbarContext();
  const {user}=useAuthContext();
  const navigation = useNavigation();
  const { documents:members } = useGetDocuments(`competitions/${id}/users`);
  const competitionExpirationDate =
  document && (document.expiresAt - new Date().getTime()) / 86400000;
  const deleteCompetition = async (id) => {
    setIsPending(true);
    if (
      !document.prizeHandedIn &&
      document.prize.moneyPrize &&
      !document.prize.itemPrize &&
      competitionExpirationDate > 0
    ) {
      const userDoc = await getDocument("users", document.createdBy.id);
      console.log(document.chargeId);
      const response=  await sendRefund({
        chargeId: document.chargeId,
      });

      
      const { error } = await response.data;

      if (error) {
        setIsPending(false);
        dispatch({type:"SHOW_SNACKBAR", payload:{message:error, alertType:"error"}});
        return;
      }

      updateDatabase(
        {
          ...userDoc,
          creditsAvailable: {
            ...userDoc.creditsAvailable,
            valueInMoney: increment(document.prize.moneyPrize.amount),
            balance: {
              ...userDoc.creditsAvailable.balance,
              0: {
                ...userDoc.creditsAvailable.balance["0"],
                amount: increment(document.prize.moneyPrize.amount),
              },
            },
          },
        },
        "users",
        userDoc.id
      );
      removeFromDataBase("competitions", id);
      removeFromDataBase("communityChats", id);
      removeFromDataBase("communityMembers", id);
      setIsPending(false);
    }

    if (
      competitionExpirationDate <= 0 &&
      !document.prizeHandedIn &&
      document.prize.moneyPrize &&
      !document.prize.itemPrize
    ) {
      setIsPending(false);
      dispatch({type:"SHOW_SNACKBAR", payload:{message:alertTranslations.notifications.wrong.winnerClaimError, alertType:"error"}});
    
      return;
    } else {
      removeFromDataBase("competitions", id);
      removeFromDataBase("communityChats", id);
      removeFromDataBase("communityMembers", id);
      setIsPending(false);
    }
    navigation.navigate("HomeScreen");
    navigation.setParams({ params:{id: null}});
 dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertTranslations.notifications.successfull.remove[selectedLanguage]}`, alertType:"success"}});

   
  };


  const leaveCompetition = async () => {
    const arrayWithoutYou = members && members.filter((doc) => doc.value.id !== user.uid);

    if (arrayWithoutYou && document.createdBy.id === user.uid) {
      setOpen(true);
    } else {
      removeFromDataBase("communityMembers", `${id}/users/${user.uid}`);
      dispatch(snackbarActions.showMessage({message:`${alertTranslations.notifications.successfull.leave[selectedLanguage]}`, alertType:"success"}));
    }
  };

  

  const ownerCondition= document && document.createdBy.id === user.uid;
const theme=useTheme();
  return (<>
<ScrollView contentContainerStyle={{gap:16, marginTop:48 }} style={{backgroundColor:theme["color-basic-800"]}}>
<Button onPress={leaveCompetition} buttonStyle={{color:"white", backgroundColor:"red",marginHorizontal:16}} icon={{type:"material-community", name:"exit-run",color:"white"}}>
{translations.communitiesBar.leaveBtn[selectedLanguage]}
</Button>
{ownerCondition && 
<>
<Button onPress={()=>{
  navigation.navigate('CompetitionEdit', {
 id:id
  });
}} buttonStyle={{color:"white",marginHorizontal:16}} icon={{type:"fontawesome", name:"edit",color:"white"}}>
{translations.communitiesBar.editBtn[selectedLanguage]}
</Button>
        <Button onPress={async () => {
          await deleteCompetition(id);
}} buttonStyle={{backgroundColor:"red", color:"white",marginHorizontal:16}} icon={{type:"fontawesome", name:"cancel",color:"white"}}>
{translations.communitiesBar.deleteBtn[selectedLanguage]}
</Button>
</>
      } 
      
        <AlertDialog isOpen={isOpen} >
    <AlertDialogBackdrop />
    <AlertDialogContent bgColor={accColor}>
      <AlertDialogHeader>
<Text style={{fontFamily:"OpenSans-Bold", fontSize:20, color:"white"}}>{selectedLanguage === "de" ? `${alertTranslations.leavingWarning.query[selectedLanguage]}  ${document && document.competitionTitle} ${alertTranslations.leavingWarning.query.part2[selectedLanguage]}` : `${alertTranslations.leavingWarning.query[selectedLanguage]}`}</Text>
      </AlertDialogHeader>
            <AlertDialogBody>
              
              <Text style={{fontFamily:"OpenSans-Bold", fontSize:16, color:"white"}}>{selectedLanguage === "de" ? `${alertTranslations.leavingWarning.consequences[selectedLanguage]} ${alertTranslations.leavingWarning.consequences.part2[selectedLanguage]}  ${document && document.competitionTitle} ${alertTranslations.leavingWarning.consequences.part3[selectedLanguage]}` : `${alertTranslations.leavingWarning.consequences[selectedLanguage]} ${alertTranslations.leavingWarning.consequences.part2[selectedLanguage]}`}</Text>
            
            </AlertDialogBody>
    <AlertDialogFooter gap={8}>
              <Button titleStyle={{fontFamily:"OpenSans-Bold"}} onPress={()=>setOpen(false)}>Stay</Button>
                      <Button titleStyle={{fontFamily:"OpenSans-Bold"}} color='error'>Leave</Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
    </ScrollView>
  {isPending && <Loader/>}
  </>
  )
}

export default CompetitionActionsScreen