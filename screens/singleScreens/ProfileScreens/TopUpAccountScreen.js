import { useState } from 'react';

import { httpsCallable } from 'firebase/functions';
import {
  Image,
  KeyboardAvoidingView,
  Text,
  View,
} from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import MaterialCommunityIcons
  from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

import {
  Button,
  ButtonText,
  Input,
  InputField,
} from '@gluestack-ui/themed';
import { useTheme } from '@ui-kitten/components';

import {
  accColor,
  modalAccColor,
  primeColor,
} from '../../../assets/ColorsImport';
import { allOffers } from '../../../assets/CreateVariables';
import formTranslations
  from '../../../assets/translations/FormsTranslations.json';
import translations
  from '../../../assets/translations/TopupScreenTranslations.json';
import Loader from '../../../components/Loader';
import PaymentOption
  from '../../../components/ProfileComponents/ItemComponents/PaymentOption';
import { functions } from '../../../firebaseConfig';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';

const TopUpAccountScreen = () => {
  const theme = useTheme();
  const [isPending, setIsPending] = useState(false);
  const [amountToPayout, setAmountToPayout] = useState(0);
  const {user}=useAuthContext();
  const {document}=useGetDocument('users', user.uid);
const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
  const scrollY=useSharedValue(0);
  const createPayout = httpsCallable(functions, "createPayout");
  const { dispatch } = useSnackbarContext();
   const payoutAmount = async () => {
    try {
      setIsPending(true);
console.log(amountToPayout);
      if(document.creditsAvailable.valueInMoney < amountToPayout){
        setIsPending(false);
        dispatch({type:"SHOW_SNACKBAR",payload:{message:translations.errorToBigAmount[selectedLanguage], alertType:"error"}});
        return;
      }


     const payout = await createPayout({
        amount: +amountToPayout,
        currentUserId: user.uid,
        userId: document.stripeAccountData.id,
        currency: document.stripeAccountData.default_currency,
        destinationAccount:
          document.stripeAccountData.external_accounts.data["0"].id,
      });
       const {error}= await payout.data;

       console.log(error);
       
       if(error){
        setIsPending(false);
        dispatch({type:"SHOW_SNACKBAR",payload:{message:error, alertType:"error"}});
        return;
       }
    
      setAmountToPayout(0);
      dispatch({type:"SHOW_SNACKBAR",payload:{message:translations.successfullyPaidOut[selectedLanguage], alertType:"success"}});
      setIsPending(false);
    } catch (err) {
      dispatch({type:"SHOW_SNACKBAR",payload:{message:err.message, alertType:"error"}});
      setIsPending(false);
    }
  };
  return (
    <>
    <View style={{backgroundColor:theme['color-basic-800'], flex:1}}>
      <Image source={require('../../../assets/moneyOption1.webp')} style={{width:140, height:140, alignSelf:"center"}}/>
<Text style={{color:"white", fontFamily:"OpenSans-Bold", fontSize:20, textAlign:"center"}}>{translations.topText[selectedLanguage]}</Text>
<Text style={{color:"white", fontFamily:"OpenSans-Regular", padding:3, alignSelf:"center"}}>{translations.downText[selectedLanguage]}</Text>
 <KeyboardAvoidingView behavior='position' style={{padding:6, gap:8}}>
  <Text style={{color:"white", fontFamily:"OpenSans-Bold"}}>{formTranslations.payoutText[selectedLanguage]}:</Text>
  <Input backgroundColor={modalAccColor}>
  <InputField onChangeText={(value)=>{
    const convertedAmount = (+value) * 100;
    setAmountToPayout(convertedAmount);
  }} value={amountToPayout} keyboardType='numeric' maxWidth={250} fontFamily="OpenSans-Regular" color="white" />
  </Input>
  <Button onPress={payoutAmount} gap={16} alignItems='center' justifyContent='center' android_ripple={{color:primeColor}} marginTop={16} marginHorizontal={8} backgroundColor={accColor}>
          <ButtonText>{formTranslations.payoutText[selectedLanguage]}</ButtonText>
          <MaterialCommunityIcons name='cash-fast' size={20} color='white'/>
  </Button>
 </KeyboardAvoidingView>
 
  <Animated.FlatList onScroll={({nativeEvent})=>{
    console.log(nativeEvent.contentOffset.y);
    scrollY.value=nativeEvent.contentOffset.y;
  }} width={"100%"} pagingEnabled snapToInterval={200} maxHeight={400} contentContainerStyle={{gap:24, padding:8}} showsVerticalScrollIndicator={false} scrollEnabled data={allOffers} renderItem={({item, index})=><PaymentOption btnText={translations.buyBtnText[selectedLanguage]} scrollY={scrollY} index={index} data={item}/>}/>
    </View>
  {isPending && <Loader/>}
    </>
  )
}

export default TopUpAccountScreen