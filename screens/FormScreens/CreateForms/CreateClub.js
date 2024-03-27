import React, { useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { AppOpenAd } from 'react-native-google-mobile-ads';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import {
  Input,
  InputField,
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';
// Import your UI library components and styles here
import { useTheme } from '@ui-kitten/components';

import {
  accColor,
  modalAccColor,
  primeColor,
} from '../../../assets/ColorsImport';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import formTranslations
  from '../../../assets/translations/FormsTranslations.json';
import Loader from '../../../components/Loader';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';
import useStorage from '../../../hooks/useStorage';

const adUnitId = 'ca-app-pub-9822550861323688~6900348989';

const CreateClub = () => {
  const appOpenAd = AppOpenAd.createForAdRequest(adUnitId);

  const { user } = useAuthContext();
  const selectedLanguage = useSelector((state) => state.languageSelection.selectedLangugage);
  const { documents: users } = useGetDocuments('users');
  const {documents: members}=useGetDocuments('communityMembers');
  const {addToDataBase}=useRealDatabase();
  const allMembers= members.map((club) => {
    return club.users;
  }).map((object) => {
    return Object.values(object);
  }).flat();
  const [usersInput, setUsersInput] = useState('');
  const [isPending, setIsPending]=useState(false);
  const [error, setError]=useState(false);
  const [readersClub, setReadersClub] = useState({
    clubsName: '',
    clubLogo: null,
    description: '',
    requiredPagesRead: 0,
  });
  const {uploadConvertedUri}=useStorage();
const {dispatch}=useSnackbarContext();
  let data = users.filter((item) => item.id !== user.uid).map((userData)=>({key:userData.id, value:userData.nickname}));
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [invitedUsers, setInvitedUsers]=useState([]);
  const onSelect=(array)=>{
    setSelectedUsers(array);
    
    const invitedUsers=selectedUsers.map((dataId)=>{
    return users.filter((userData)=>userData.id === dataId);
    }).flat();
    
    setInvitedUsers(invitedUsers); 
  };
  
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log(result.assets[0]);
  
    if (!result.canceled) {

      setReadersClub({...readersClub, clubLogo:result.assets[0].uri});
    }
  };
 
const navigation=useNavigation();

  const submitForm = async () => {
    setError(null);
    setIsPending(true);

    if (
      allMembers.find(
        (member) =>
          member.value.id === user.uid &&
          member.belongsTo.includes("readersClub")
      )
    ) {
      setIsPending(false);
     dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.wrong.loyality[selectedLanguage]}`}});
      return;
    }


    if(!readersClub.clubLogo || readersClub.description.trim().length === 0 || readersClub.clubsName.trim().length === 0 || readersClub.requiredPagesRead === 0){
      setIsPending(false);
      dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.wrong.someFieldsEmpty[selectedLanguage]}`}});
      return;
    }
const uniqueId=`readersClub${uuidv4()}`;

    const uniqueImageId = `readersClub-logos/${user.uid}/${
      readersClub.clubsName ? readersClub.clubsName : `${uniqueId}`
    }`;

    const photoURL= await uploadConvertedUri(readersClub.clubLogo, uniqueImageId);

    addToDataBase("readersClubs", uniqueId, {
      clubsName: readersClub.clubsName,
      clubLogo: photoURL,
      description: readersClub.description,
      requiredPagesRead: readersClub.requiredPagesRead,
      createdBy: {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().getTime(),
        id: user.uid,
      },
      id: uniqueId,
    });

    addToDataBase("communityChats", uniqueId, {
      messages: {},
      chatId: uniqueId,
    });

    addToDataBase("communityMembers", uniqueId, {
      users: {
        [user.uid]: {
          label: user.displayName,
          belongsTo: uniqueId,
          value: {
            nickname: user.displayName,
            id: user.uid,
            photoURL: user.photoURL,
          },
        },
      },
    });

    invitedUsers.map((member) =>
      addToDataBase("notifications", member.id, {
        notificationContent: `You've been invited by ${user.displayName} to ${readersClub.clubsName} club.`,
        directedTo: member.id,
        linkTo: `/readers-club/${uniqueId}`,
        notificationId: uniqueId,
        isRead: false,
        notificationTime: new Date().getTime(),
        addedTo: readersClub.clubsName,
      })
    );
    setIsPending(false);
    dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.successfull.create[selectedLanguage]}`}});
    setError(null);
    appOpenAd.load();
    appOpenAd.show();
    navigation.navigate("HomePage");
  };


  const theme=useTheme();

  return (
    <>
    <ScrollView style={{backgroundColor:theme["color-basic-800"]}}>
      <View syle={{margin:8}}> 
        <Text style={{textAlign:"center", fontSize:18, fontFamily:'Inter-Black', color:"white"}}>{formTranslations.topText.clubs[selectedLanguage]}</Text>
        <Text style={{textAlign:"center", fontSize:14, fontFamily:'Inter-Black', color:"white"}}>{formTranslations.topText.clubs.underText[selectedLanguage]}</Text>
      </View>

      <View style={{ margin: 6 }}>
        <Text style={{fontFamily:'Inter-Black', color:"white"}}>{formTranslations.clubsNameInput.label[selectedLanguage]}:</Text>
        <Input variant='rounded'>
          <InputField fontFamily='OpenSans-Regular' backgroundColor={modalAccColor} fontSize={16} onChangeText={(value)=>setReadersClub({...readersClub, clubsName:value})} style={{ color:"white"}} placeholder={formTranslations.clubsNameInput.placeholder[selectedLanguage]} />
        </Input>
      </View>

      <View style={{ margin: 6 }}>
        <Text style={{fontFamily:'Inter-Black', color:"white"}}>{formTranslations.membersInput.label[selectedLanguage]}:</Text>

  <MultipleSelectList boxStyles={{
    backgroundColor:modalAccColor,
  }} inputStyles={{
    color:"white"
  }} 
  dropdownStyles={{
    backgroundColor:primeColor
  }}
  label={formTranslations.membersInput.label[selectedLanguage]}
  placeholder={formTranslations.inviteSomeUsers[selectedLanguage]}
  dropdownTextStyles={{color:"white"}} dropdownItemStyles={{
    backgroundColor:accColor,
    borderWidth:2,
    borderColor:primeColor
  }} fontFamily='OpenSans-Bold' searchPlaceholder={formTranslations.membersInput.label[selectedLanguage]} notFoundText={formTranslations.noResults[selectedLanguage]} setSelected={onSelect} data={data} save='key'/>
      </View>

      <View style={{ margin: 6 }}>
        <Text style={{fontFamily:'Inter-Black', color:"white"}}>{formTranslations.requiredPagesToJoin.label[selectedLanguage]}:</Text>
        <Input variant='rounded'>
          <InputField fontFamily='OpenSans-Regular' backgroundColor={modalAccColor} fontSize={16} onChangeText={(value)=>setReadersClub({...readersClub, requiredPagesRead:+value })} style={{ color:"white"}} keyboardType="number-pad" placeholder={formTranslations.clubsNameInput.placeholder[selectedLanguage]} />
        </Input>
      </View>

      <View style={{ marginHorizontal: 16, marginVertical:6 }}>
        <Text style={{fontFamily:'Inter-Black', color:"white"}}>{formTranslations.clubsLogoInput.label[selectedLanguage]}:</Text>
        <Button titleStyle={{fontFamily:'OpenSans-Bold'}} onPress={pickImage} buttonStyle={{ backgroundColor: accColor }} icon={{ type: 'fontawesome', name: 'image', color: 'white' }}>
          {formTranslations.selectImgBtn.text[selectedLanguage]}
        </Button>
      </View>

      <View style={{ marginHorizontal: 8, marginVertical:6 }}>
        <Text style={{fontFamily:"Inter-Black", color:"white"}}>{formTranslations.descriptionTextarea.label[selectedLanguage]}</Text>
        <Textarea>
          <TextareaInput backgroundColor={modalAccColor} color='white' fontFamily='OpenSans-Regular' onChangeText={(value)=>setReadersClub({...readersClub, description:value})}/>
        </Textarea>
      </View>

      <Button titleStyle={{fontFamily:'OpenSans-Bold'}} onPress={submitForm} buttonStyle={{ borderRadius:8, marginVertical: 16, marginHorizontal:12, backgroundColor:accColor}}>{formTranslations.testFields.buttonText.createBtn[selectedLanguage]}</Button>
    </ScrollView>
    {isPending && <Loader/>}
    </>
  );
};

export default CreateClub;
