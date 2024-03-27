import { useState } from 'react';

import { validatePhoneNumberLength } from 'libphonenumber-js';
import LottieView from 'lottie-react-native';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import IonIcons from '@expo/vector-icons/Ionicons';
import {
  Button,
  useTheme,
} from '@ui-kitten/components';

import translations from '../../../assets/translations/FormsTranslations.json';
import CountryPhoneInput from '../../../components/Inputs/CountryPhoneInput';
import usePhoneAuthentication from '../../../hooks/usePhoneAuthentication';

const LoginWithPhoneScreen = () => {
  const [selectCountry, setSelectCountry]=useState(false);
  const [country, setCountry]=useState(null);
  const [textNumber, setTextNumber]=useState(null);
  const [error, setError]=useState(null);
  const [verificationNumber, setVerificationNumber]=useState(null);
  const [isVerificationNumberSent, setIsVerificationSent] = useState(null);
  
  const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
const {sendVerificationCode, confirmCode}=usePhoneAuthentication();
  const validate= ()=>{
if(!country || !textNumber){
  setError('You haven`t selected anything. Either country code or provided an number.');
return;
}

    if(country){
      setError(null);
      const isNumberValid= validatePhoneNumberLength(`${textNumber}`,`${country.code}`);

      if(!textNumber || textNumber &&  textNumber.trim().length === 0){
        setError('Nothing typed yet.');
        return;
      }

      if(isNumberValid === "TOO_SHORT"){
        setError('Number is too short.');
      return;
      }
      if(isNumberValid === "TOO_LONG"){
        setError('Number is too long.');
      return;
      }
      if(isNumberValid === "INVALID_COUNTRY"){
        setError('The country is not valid.');
        return;
      }
      if(isNumberValid === "INVALID_LENGTH"){
        setError(`The number's length is not valid.`);
        return;
      }
      if(isNumberValid === "NOT_A_NUMBER"){
        setError(`The input is not a number.`);
        return;
      }
      
  }
}
    
const selectedCountry = (value)=>{
  setCountry(value);
};

const setVerificationID =(value)=>{
  setIsVerificationSent(value);
}

const selectedNumber =(value)=>{
  setTextNumber(value);
}

const selectedCountryNumber = (val)=>{
  setSelectCountry(val);
}

const sendCode= async ()=>{
  await sendVerificationCode(textNumber, country.phone, isVerificationNumberSent, setVerificationID, setError);
 };

 const approveCode= async ()=>{
  await confirmCode(isVerificationNumberSent, verificationNumber, setError)
 }
 
const theme=useTheme();
  return (
    <ScrollView style={{backgroundColor:theme['color-basic-800'], flex:1}}>
<LottieView autoPlay loop source={require('../../../assets/lottieAnimations/Animation - 1705615780718.json')} style={{
  width:250,
  height:350,
  alignSelf:"center"
}}/>



  {
    !isVerificationNumberSent && <View>
  <CountryPhoneInput validation={validate}  select={selectedCountry} country={country} setTextNumber={selectedNumber} textNumber={textNumber} selectCountry={selectCountry} setSelectCountry={selectedCountryNumber}/>
{error && <Text style={{ fontWeight:"600", color:"red"}}>{error}</Text>}
<View>
<Button style={{margin:8, fontSize:32, gap:8}} onPress={sendCode}> 
{translations.signingOptions.passwordForgotten.verifyBtn[selectedLanguage]}
<IonIcons name='checkmark-circle' size={16} style={{padding:8, margin:6}}/>
</Button>
   </View>
    </View>
  }

{isVerificationNumberSent &&<View>
  
  <View style={{margin:6}}>
    <Text>{translations.signingOptions.passwordForgotten.verificationCode[selectedLanguage]}</Text>
    <Input>
    <InputField fontFamily="OpenSans-Regular" maxLength={6} keyboardType='number-pad' onChangeText={setVerificationNumber} />
    </Input>
  </View>
    
  <Button onPress={approveCode} style={{margin:6}}>
    Verify code
  </Button>
  
    </View>}

    </ScrollView>
  )
}

export default LoginWithPhoneScreen