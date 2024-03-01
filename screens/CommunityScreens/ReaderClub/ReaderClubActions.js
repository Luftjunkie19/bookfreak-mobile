import React, { useState } from 'react';

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
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';

const ReaderClubActions = ({route}) => {
    const {id}=route.params.params;
  const { user } = useAuthContext();
  const [isPending, setIsPending]=useState(false);
  const [isOpen, setOpen] = useState(false);
    const {document}=useGetDocument("readersClubs", id); 
  const { dispatch } = useSnackbarContext();
  const { removeFromDataBase,  } = useRealDatabase();
    const ownerCondition= document && document.createdBy.id === user.uid;
    const {documents: members}=useGetDocuments(`communityMembers/${id}/users`);
    const navigation=useNavigation();
const theme=useTheme();
    const leaveClub = async () => {
    const arrayWithoutYou = members.filter((doc) => doc.value.id !== user.uid);

    if (arrayWithoutYou && document.createdBy.id === user.uid) {
      setOpen(true);
      return;
    } else {
      
      removeFromDataBase("communityMembers", `${id}/users/${user.uid}`);
        dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertTranslations.notifications.successfull.leave[selectedLanguage]}`, alertType:"success"}});
    }

  };

  const deleteClub = async (id) => {
    setIsPending(true);
    removeFromDataBase("readersClubs", id);
    removeFromDataBase("communityChats", id);
    removeFromDataBase("communityMembers", id);
    navigation.setParams({ params:{id: null}});
    navigation.navigate('HomeScreen');
    setIsPending(false);
    dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.successfull.update[selectedLanguage]}`, alertType:"success"}});
  };


    const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
    return (
      <>
      <ScrollView contentContainerStyle={{gap:16, marginTop:48 }} style={{backgroundColor:theme["color-basic-800"]}}>
        <Button onPress={leaveClub} buttonStyle={{color:"white", backgroundColor:"red",marginHorizontal:16}} icon={{type:"material-community", name:"exit-run",color:"white"}}>
        {translations.communitiesBar.leaveBtn[selectedLanguage]}
        </Button>
        {ownerCondition && 
        <>
        <Button onPress={()=>{
  navigation.navigate('ClubEdit', {
    id:id
  })
}} buttonStyle={{color:"white",marginHorizontal:16}} icon={{type:"fontawesome", name:"edit",color:"white"}}>
        {translations.communitiesBar.editBtn[selectedLanguage]}
        </Button>
          <Button onPress={async () => {
          await  deleteClub(id);
        }} buttonStyle={{backgroundColor:"red", color:"white",marginHorizontal:16}} icon={{type:"fontawesome", name:"cancel",color:"white"}}>
        {translations.communitiesBar.deleteBtn[selectedLanguage]}
        </Button>
        </>
        } 

     
         <AlertDialog isOpen={isOpen}>
    <AlertDialogBackdrop />
    <AlertDialogContent bgColor={accColor}>
      <AlertDialogHeader>
              <Text style={{fontFamily:"OpenSans-Bold", fontSize:16, color:"white"}}>{selectedLanguage === "de" ? `${alertTranslations.leavingWarning.query[selectedLanguage]} ${alertTranslations.leavingWarning.query.part2[selectedLanguage]}` : `${alertTranslations.leavingWarning.query[selectedLanguage]}`}</Text>
      </AlertDialogHeader>
            <AlertDialogBody>
              <Text style={{fontFamily:"OpenSans-Bold", fontSize:16, color:"white"}}>{selectedLanguage === "de" ? `${alertTranslations.leavingWarning.consequences[selectedLanguage]} ${alertTranslations.leavingWarning.consequences.part2[selectedLanguage]} ${alertTranslations.leavingWarning.consequences.part3[selectedLanguage]}` : `${alertTranslations.leavingWarning.consequences[selectedLanguage]} ${alertTranslations.leavingWarning.consequences.part2[selectedLanguage]}`}</Text>
            
            </AlertDialogBody>
            <AlertDialogFooter gap={8}>
              <Button onPress={()=>setOpen(false)}>Stay</Button>
                      <Button color='error'>Leave</Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

            </ScrollView>
      
      </>
          )
}

export default ReaderClubActions