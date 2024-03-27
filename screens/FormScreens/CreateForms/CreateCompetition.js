import React, { useState } from 'react';

import { httpsCallable } from 'firebase/functions';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import {
  AppOpenAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import {
  Input,
  InputField,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import { Button } from '@rneui/themed';
import {
  Datepicker,
  useTheme,
} from '@ui-kitten/components';

import {
  accColor,
  modalAccColor,
  primeColor,
} from '../../../assets/ColorsImport';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import formTranslations
  from '../../../assets/translations/FormsTranslations.json';
import Loader from '../../../components/Loader';
import { functions } from '../../../firebaseConfig';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-9822550861323688~6900348989';

const CreateCompetition = ({navigation}) => {
  const appOpenAd = AppOpenAd.createForAdRequest(adUnitId);
  const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
  const [competition, setCompetition] = useState({
    competitionTitle: "",
    competitionsName: "",
    expiresAt: null,
    description: "",
    prizeType: null,
    chargeId: null,
    prizeHandedIn: false,
    prize: {
      moneyPrize: {
        amount: 0,
        currency: null,
      },
      itemPrize: { title: null, typeOfPrize: null },
    },
  });
  const {updateDatabase, addToDataBase}=useRealDatabase();
  const payCompetitionCharge = httpsCallable(functions, 'payCompetitionCharge');
  const getBalance = httpsCallable(functions, 'getBalance');
  const [isPending, setIsPending]=useState(false);
  const [error, setError]=useState(false);
  const [invitedUsersIds, setInvitedUsersIds]=useState([]);
  const [invitedUsers, setInvitedUsers]=useState([]);
  const {dispatch}=useSnackbarContext();
  const {user}=useAuthContext();
  const {document}=useGetDocument('users', user.uid);
  const {documents}=useGetDocuments('users');
  const competitionTypes = [
    { value: "First read, first served", label: formTranslations.competitionTypes.first[selectedLanguage] },
    {
      value: "Lift others, rise",
      label: formTranslations.competitionTypes.second[selectedLanguage],
    },
    { value: "Teach to fish", label: formTranslations.competitionTypes.third[selectedLanguage] },
  ];
  
   const prizeTypes = [
    { value: "item", label: formTranslations.item[selectedLanguage] },
    {
      value: "Money",
      label: formTranslations.money[selectedLanguage],
    },
  ];
  
   const differentPrize = [
    { value: "book", label:formTranslations.book[selectedLanguage] },
    {
      value: "Voucher",
      label: "Voucher",
    },
    { value: "ticket", label: formTranslations.ticket[selectedLanguage] },
  ];
  const onSelect=(array)=>{
setInvitedUsersIds(array);

const invitedUsers=invitedUsersIds.map((dataId)=>{
return documents.filter((userData)=>userData.id === dataId);
}).flat();

setInvitedUsers(invitedUsers);
  };

  const transformedUsers=documents.filter((item)=>item.id !== user.uid).map((itemData, i)=>({value:itemData.nickname, key:itemData.id}));

  const finalizeAll = () => {
    const uniqueId = uuidv4();
    addToDataBase("competitions", uniqueId, {
      competitionTitle: competition.competitionTitle,
      competitionsName: competition.competitionsName,
      expiresAt: new Date(competition.expiresAt).getTime(),
      description: competition.description,
      prizeHandedIn: false,
      chargeId: competition.chargeId,
      prize: competition.prize,
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
      addToDataBase("notifications", `${uniqueId}-${new Date().getTime()}`, {
        notificationContent: `You've been invited by ${user.displayName} to join the ${competition.competitionsName} competition.`,
        directedTo: member.id,
        linkTo: `/competition/${uniqueId}`,
        isRead: false,
        notificationId: uniqueId,
        notificationTime: new Date().getTime(),
        addedTo: competition.competitionsName,
      })
    );

    setIsPending(false);
    setError(null);
  };


  const submitForm = async () => {
    setError(null);
    setIsPending(true);
    try {
      if (!competition.expiresAt) {
        dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.wrong.earlyDate[selectedLanguage]}`,alertType:"error"}});
        setIsPending(false);
        return;
      }

      if (
        competition.prizeType === "Money" &&
        competition.prize.moneyPrize.amount === 0
      ) {
        dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.wrong.zeroAmount[selectedLanguage]}`, alertType:"error"}});          
        setIsPending(false);
        return;
      }

      if (competition.prize.moneyPrize.amount > document.creditsAvailable.valueInMoney) {
        dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.wrong.notEnoughCredits[selectedLanguage]}`, alertType:"error"}});        
     
        setIsPending(false);
        return;
      }

      if (
        (competition.prizeType==="item" &&
        competition.prize.itemPrize === undefined ||
          competition.prize.itemPrize === null) ||
        (competition.prizeType==="Money" &&
        competition.prize.moneyPrize === null ||
        competition.prize.moneyPrize === undefined)
      ) {
        
       dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.wrong[selectedLanguage]}`,alertType:"error"}});
        setIsPending(false);
        return;
      }

      if (competition.prize.moneyPrize.amount > 0) {
        const payoutObject = await payCompetitionCharge({
          organizatorObject: document,
          payerId: document.stripeAccountData.id,
          amount: competition.prize.moneyPrize.amount,
          currency:
            document.stripeAccountData.default_currency.toUpperCase(),
        });
        console.log(payoutObject);
        const { error, chargeObject } = await payoutObject.data;
        console.log(payoutObject.data);
        console.log(chargeObject);

        if (error) {
          setError(error);
          dispatch({type:"SHOW_SNACKBAR", payload:{message:error, alertType:"error"}});
          setIsPending(false);
          return;
        }

        if (chargeObject) {
          setCompetition((comp) => {
            comp.chargeId = chargeObject.id;
            comp.prize.moneyPrize.currency =
              document.stripeAccountData.default_currency;
            return comp;
          });

          const balance = await getBalance({ accountId: document.stripeAccountData.id });
        console.log(competition);
          const balanceValue = await balance.data.available[0].amount;
          updateDatabase(
            {
              valueInMoney:
                balanceValue -
                competition.prize.moneyPrize.amount,
            },
            "users",
            `${user.uid}/creditsAvailable`
          );
        }
      }
      finalizeAll();
      setIsPending(false);
      appOpenAd.load();
      if(appOpenAd.loaded){
        appOpenAd.show();
      }
     navigation.goBack();
      dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.successfull.create[selectedLanguage]}`, alertType:"success"}});        
    } catch (err) {
      console.log(err);
      setIsPending(false);
    }
  };



  const theme=useTheme();
  return (
    <>
    <ScrollView style={{backgroundColor:theme["color-basic-800"]}}>
      <View style={{margin:4}}>
      <Text style={{fontFamily:"Inter-Black", color:"white", fontSize:18, textAlign:"center"}}>{formTranslations.topText.competitions[selectedLanguage]}</Text>
      </View>

<View style={{margin:6}}>
  <Text style={{fontFamily:"Inter-Black", color:"white"}}>{formTranslations.bookTitleInput.label[selectedLanguage]}</Text>
  <Input variant='rounded'>
  <InputField backgroundColor={modalAccColor} fontSize={16} fontFamily='OpenSans-Regular' color="white" onChangeText={(value)=>setCompetition({...competition, competitionTitle:value})}/>
  </Input>
</View>

<View style={{margin:4}}>
  <Text style={{fontFamily:"Inter-Black", color:"white"}}>{formTranslations.expirationDateInput.label[selectedLanguage]}</Text>
  <Datepicker controlStyle={{backgroundColor:modalAccColor}} onSelect={(date)=>setCompetition({...competition, expiresAt:new Date(date) })}  min={new Date()} date={competition.expiresAt ? competition.expiresAt : new Date()}/>
</View>

<View style={{margin:4}}>
  <Text style={{fontFamily:"Inter-Black", color:"white"}}>{formTranslations.membersInput.label[selectedLanguage]}</Text>
{documents && <MultipleSelectList  boxStyles={{
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
  }} fontFamily='OpenSans-Regular' searchPlaceholder={formTranslations.membersInput.label[selectedLanguage]} notFoundText={formTranslations.noResults[selectedLanguage]} setSelected={onSelect} data={transformedUsers} save='key'/>} 
</View>


      <View style={{margin:4}}>
<Text style={{fontFamily:"Inter-Black", color:"white"}}>{formTranslations.competitionCategory.label[selectedLanguage]}</Text>
<Select onValueChange={(value)=>setCompetition({...competition, competitionsName:value})}>
    <SelectTrigger>
      <SelectInput backgroundColor={modalAccColor} color='white' fontFamily='OpenSans-Bold' />
    </SelectTrigger>
    <SelectPortal>
      <SelectBackdrop />
      <SelectContent>
        <SelectDragIndicatorWrapper>
          <SelectDragIndicator />
        </SelectDragIndicatorWrapper>
     {competitionTypes.map((itemData)=>(<SelectItem label={itemData.label} value={itemData.value}/>))}
      </SelectContent>
    </SelectPortal>
  </Select>
      </View>


<View style={{margin:4}}>
<Text style={{fontFamily:"Inter-Black", color:"white"}}>{formTranslations.competitionsPrize[selectedLanguage]}</Text>
<Select onValueChange={(value)=>setCompetition({...competition, prizeType:value })}>
    <SelectTrigger>
      <SelectInput backgroundColor={modalAccColor} color='white' fontFamily='OpenSans-Regular' />
    </SelectTrigger>
    <SelectPortal>
      <SelectBackdrop />
      <SelectContent>
        <SelectDragIndicatorWrapper>
          <SelectDragIndicator />
        </SelectDragIndicatorWrapper>
        {prizeTypes.map((itemData)=>(<SelectItem  label={itemData.label} value={itemData.value}/>))}
      </SelectContent>
    </SelectPortal>
  </Select>
</View>

{competition.prizeType && competition.prizeType === "Money" && <View style={{margin:6}}>
  <Text style={{fontFamily:"Inter-Black", color:"white"}}>{formTranslations.prizeMoneyAmountInYourCurrency[selectedLanguage]}</Text>
  <Input variant='rounded'>
  <InputField fontFamily='OpenSans-Regular' color='white' backgroundColor={modalAccColor} onChangeText={(value)=>setCompetition({...competition, prize:{
    moneyPrize:{amount:+value * 100, currency:document.stripeAccountData.default_currency}
  }})} keyboardAppearance='dark' keyboardType='number-pad'/>
  </Input>
  </View>}

  

{competition.prizeType && competition.prizeType === "item" && 
<>
<View style={{margin:4, gap:4}}>
<Text style={{fontFamily:"Inter-Black", color:"white"}}>{formTranslations.item[selectedLanguage]}:</Text>
<Select onValueChange={(value)=>{
  setCompetition((comp)=>{
    comp.prize.itemPrize.typeOfPrize=value;
  return comp;
  });
}}>
    <SelectTrigger>
      <SelectInput backgroundColor={modalAccColor} color='white' fontFamily='OpenSans-Regular' />
    </SelectTrigger>
    <SelectPortal>
      <SelectBackdrop />
      <SelectContent>
        <SelectDragIndicatorWrapper>
          <SelectDragIndicator />
        </SelectDragIndicatorWrapper>
        {differentPrize.map((itemData)=>(<SelectItem label={itemData.label} value={itemData.value}/>))}
      </SelectContent>
    </SelectPortal>
  </Select>
</View>

<View style={{margin:6,gap:4}}>
  <Text style={{fontFamily:"Inter-Black", color:"white"}}>{formTranslations.prizeDetails[selectedLanguage]}:</Text>
  <Textarea  maxHeight={90}>
  <TextareaInput backgroundColor={modalAccColor} fontFamily='OpenSans-Regular' color="white" onChangeText={(value)=>setCompetition((comp)=>{
  comp.prize.itemPrize.title=value;
  return comp;
})}  keyboardAppearance='dark'/>
  </Textarea>
  </View>
</>}




<View style={{margin:4, gap:4}}>
  <Text style={{fontFamily:"Inter-Black", color:"white"}}>{formTranslations.descriptionTextarea.label[selectedLanguage]}:</Text>
  <Textarea>
    <TextareaInput backgroundColor={modalAccColor} fontFamily='OpenSans-Regular' color="white" onChangeText={(value)=>setCompetition({...competition, description:value })}/>
  </Textarea>
</View>


<Button titleStyle={{fontFamily:'OpenSans-Bold'}} onPress={submitForm} buttonStyle={{margin:12, borderRadius:8, backgroundColor:accColor}}>{formTranslations.finishText[selectedLanguage]}</Button>

    </ScrollView>
    {isPending && <Loader/>}
    </>
  )
}

export default CreateCompetition