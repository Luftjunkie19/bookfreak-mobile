import React, {
  useEffect,
  useState,
} from 'react';

import { httpsCallable } from 'firebase/functions';
import {
  Image,
  Text,
  View,
} from 'react-native';
import {
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import MaterialCommunityIcons
  from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import { useStripe } from '@stripe/stripe-react-native';
import { useTheme } from '@ui-kitten/components';

import {
  accColor,
  darkRed,
  primeColor,
} from '../../../assets/ColorsImport';
import translations
  from '../../../assets/translations/TopupScreenTranslations.json';
import { functions } from '../../../firebaseConfig';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-9822550861323688~6900348989';

const interstitial = InterstitialAd.createForAdRequest(adUnitId);
const PaymentOption = ({data, index, scrollY, btnText}) => {
const [isLoading, setLoading]=useState(false);
const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
const [success, setSuccess]=useState(null);
const [paymentClient, setPaymentClient]=useState(null);
const [error, setError]=useState(null);
const { initPaymentSheet, presentPaymentSheet, retrievePaymentIntent } = useStripe();
  const createStripeMobileCheckout=httpsCallable(functions, 'createStripePaymentMobile');
const {user}=useAuthContext();
const theme=useTheme();
const {document}=useGetDocument('users', user.uid);
const animatedStyles=useAnimatedStyle(()=>{
  const inputRange=[(index - 1) * 200, index * 200, (index + 1) * 200];
  const scale= interpolate(scrollY.value, inputRange, [0.85, 1, 0.85]);

  return {transform:[{scale: scale}]}

});

  const fetchPaymentSheetParams=async ()=>{
    try{
      if(document){
        const stripeRequest= await createStripeMobileCheckout({price:data.bucksToToUp, destinationId: document.stripeAccountData.id, customerCurrency: document.stripeAccountData.default_currency, customer:{
          id: user.uid,
          nickname: user.displayName,
          selectedOptionName: data.name,
          priceForOffer: data.id,
          priceInNumber: data.price,
          boughtOption: data.bucksToToUp,
          destinationId: document.stripeAccountData.id,
        }});
      
        
      
        const stripeResults= await stripeRequest.data;
      
      
        return {paymentIntent: stripeResults.paymentIntent, empheral: stripeResults.empheral, customer: stripeResults.customer, publishableKey: stripeResults.publishableKey, buyer: stripeResults.buyer};

      }
    } catch (err){
      setError(err.message);
    }

  }

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      empheral,
      customer,
      buyer,
      publishableKey,
    } = await fetchPaymentSheetParams();
    
    setPaymentClient(paymentIntent);

    const { error } = await initPaymentSheet({
      appearance:{
        font:{
         scale:1.15
        },
   colors:{
  secondaryText:"#ffffff",
  primaryText:"#ffffff",
  background:"#384b7a",
  primary:"#4367B5",
  icon:"#FF0000",
  componentBackground:"#1a2339",
componentText:"#ffffff",
placeholderText:"#ffffff"
   }
      },
      merchantDisplayName: "BookFreak",
      customerId: customer,
      customerEphemeralKeySecret: empheral,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      googlePay: {
        testEnv: false,
        merchantName:"BookFreak",
        merchantCountryCode: 'PL',
        currencyCode:"PLN",
      },
    });


    if (!error) {
      setLoading(true);
    }else{
      setError(error.message);
    }
  };

  const openPaymentSheet = async () => {
   await initializePaymentSheet();

   
   const {error}= await presentPaymentSheet();

    if (!error) {
      setLoading(true);
    }else{
      setError(error.message);
    }
  }

 
  const managePaymentClient= async ()=>{
    if(paymentClient){
  
    const {error, paymentIntent}= await retrievePaymentIntent(paymentClient);
  
  
  
  if(error){
    setError(error.message);
    return;
  }
  
  if(paymentIntent.status === 'Succeeded'){
    setSuccess({amount:paymentIntent.amount, currency:paymentIntent.currency});
  }
      }
    else {
      console.log(paymentClient);
      }
  }
  
  useEffect(()=>{

managePaymentClient();

  },[paymentClient])

  return (
    <Animated.View style={[{backgroundColor:accColor, borderRadius:8}, animatedStyles]}>
      <Image source={require('../../../assets/moneyOption3.webp')} style={{width: 100, height: 100, margin:8,}} />
      <View style={{flexDirection:"row", padding:8, gap:32, justifyContent:"space-between"}}>
      <View>
      <Text style={{fontFamily:"OpenSans-Bold", color:"white"}}>{data.name}</Text>
      <Text style={{fontFamily:"OpenSans-Regular", color:'white'}}>{data.price}$</Text>
      </View>
<Button action="positive"  onPress={openPaymentSheet} android_ripple={{
  color:primeColor
}}>
  <ButtonText>{btnText}</ButtonText>
</Button>
      </View>


      <AlertDialog isOpen={success !== null}>
    <AlertDialogBackdrop />
    <AlertDialogContent bg={accColor} borderColor={primeColor} borderWidth={2}>
      <AlertDialogHeader justifyContent='space-between' gap={4}>
        <Text style={{fontFamily:"OpenSans-Bold", color:"lightgreen", fontSize:18}}>{translations.success[selectedLanguage]}</Text>
        <AlertDialogCloseButton>
          <Button gap={8} onPress={()=>setSuccess(null)} action='negative' ripple_android={{
            color:darkRed
          }}>
            <ButtonText style={{fontFamily:"OpenSans-Regular"}}>Close</ButtonText>
            <MaterialCommunityIcons name='close-circle' size={18} color='white'/>
          </Button>
        </AlertDialogCloseButton>
      </AlertDialogHeader>
      <AlertDialogBody>
        <Text style={{fontFamily:"OpenSans-Bold", fontSize:18, color:"white"}}>
  
          
{translations.creditsInformation.part1[selectedLanguage]} {success && success.amount / 100} {success && success.currency} {translations.creditsInformation.part2[selectedLanguage]}
          
        </Text>
      </AlertDialogBody>
      <AlertDialogFooter />
    </AlertDialogContent>
  </AlertDialog>

      <AlertDialog isOpen={error !== null}>
    <AlertDialogBackdrop />
    <AlertDialogContent bg={accColor} borderColor={primeColor} borderWidth={2}>
      <AlertDialogHeader alignSelf='flex-end'>
        <AlertDialogCloseButton>
          <Button gap={8} onPress={()=>setError(null)} action='negative' ripple_android={{
            color:darkRed
          }}>
            <ButtonText style={{fontFamily:"OpenSans-Regular"}}>Close</ButtonText>
            <MaterialCommunityIcons name='close-circle' size={18} color='white'/>
          </Button>
        </AlertDialogCloseButton>
      </AlertDialogHeader>
      <AlertDialogBody>
        <Text style={{fontFamily:"OpenSans-Bold", fontSize:18, color:"white"}}>{error}</Text>
      </AlertDialogBody>
      <AlertDialogFooter />
    </AlertDialogContent>
  </AlertDialog>

    </Animated.View>
  )
}

export default PaymentOption