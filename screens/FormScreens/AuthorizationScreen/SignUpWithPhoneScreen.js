import {
  useRef,
  useState,
} from 'react';

import * as ImagePicker from 'expo-image-picker';
import { validatePhoneNumberLength } from 'libphonenumber-js';
import LottieView from 'lottie-react-native';
import {
  Dimensions,
  Image,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import IonIcons from '@expo/vector-icons/Ionicons';
import {
  Input,
  InputField,
  ScrollView,
} from '@gluestack-ui/themed';
import {
  Button,
  useTheme,
} from '@ui-kitten/components';

import translations from '../../../assets/translations/FormsTranslations.json';
import CountryPhoneInput from '../../../components/Inputs/CountryPhoneInput';
import usePhoneAuthentication from '../../../hooks/usePhoneAuthentication';

const SignUpWithPhoneScreen = () => {
  const {sendVerificationCode, confirmCode}=usePhoneAuthentication();
  const theme=useTheme();
  const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
  const [nickname, setNickname]=useState('');
  const [selectCountry, setSelectCountry]=useState(false);
  const [country, setCountry]=useState(null);
  const [textNumber, setTextNumber]=useState(null);
  const [error, setError]=useState(null);
  const [VerificationError, setVerificationError]=useState(null);
  const [verificationId, setVerificationId]=useState(null);
const [image, setImage]=useState(null);
  const [verificationCode, setVerificationCode]=useState(null);
const verifyRef=useRef();
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

const selectedNumber =(value)=>{
  setTextNumber(value);
}

const selectedCountryNumber = (val)=>{
  setSelectCountry(val);
}

const setVerificationID=(value)=>{
  setVerificationId(value);
}

const getVerificationError=(value)=>{
  setVerificationError(value);
}

const approveData= async ()=>{
 await sendVerificationCode(textNumber,country.phone, verifyRef.current, setVerificationID, getVerificationError);
};

const approveCode= async ()=>{
 await confirmCode(verificationId,verificationCode,getVerificationError, {
  nickname: nickname,
  photoURL: image,
 });
}

const pickImageAsync = async () => {
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
    
    } else {
      alert('You did not select any image.');
    }
  } catch (error) {
    console.error(error);
    // Handle the error as needed
  }
};


  return (
    <ScrollView style={{backgroundColor:theme["color-basic-800"], flex:1}}>
      <Text style={{fontFamily:"Inter-Black", fontSize: 24, color:'white', textAlign:"center", padding:16}}>{translations.signingOptions.passwordForgotten.verificationText[selectedLanguage]}</Text>
<LottieView autoPlay source={require('../../../assets/lottieAnimations/Animation - 1705615780718.json')} style={{
  width: Dimensions.get('window').width,
  height:400,
  margin:10,
  alignSelf:"center"
}}/>


       {
    !verificationId && <View>
      <View style={{margin:6}}>
        <Text style={{fontFamily:"Inter-Black", color:"white"}}>{translations.userFields.nickname[selectedLanguage]}:</Text>
      <Input>
      <InputField color='white' fontFamily='OpenSans-Regular' placeholder={translations.userFields.nickname[selectedLanguage]} onChangeText={setNickname} />
      </Input>
      </View>
      <View style={{margin:6}}>
        {image && <Image source={{uri:image}} style={{width:70, height:70}} />}
    <Button style={{color:"white", fontFamily:"OpenSans-Bold", margin:4}} onPress={pickImageAsync}>{translations.selectImgBtn.text[selectedLanguage]}</Button>
      </View>
  <CountryPhoneInput validation={validate}  select={selectedCountry} country={country} setTextNumber={selectedNumber} textNumber={textNumber} selectCountry={selectCountry} setSelectCountry={selectedCountryNumber}/>
<View>
<Button style={{margin:8, fontSize:32}} onPress={approveData}> 
{translations.submit[selectedLanguage]}
<IonIcons name='checkmark-circle' size={16} style={{padding:8}}/>
</Button>
   </View>
{error && <Text style={{ fontWeight:"600", color:"red"}}>{error}</Text>}
{VerificationError &&  <Text style={{ fontWeight:"600", color:"red"}}>{VerificationError}</Text>}
    </View>
  }

{verificationId && <View>
  
<View style={{margin:6}}>
  <Text style={{fontFamily:"Inter-Black", color:"white"}}>Verification code:</Text>
  <Input>
  <InputField fontFamily='OpenSans-Bold' color='white' maxLength={6} keyboardType='number-pad' onChangeText={setVerificationCode} />
  </Input>
</View>
  
<Button onPress={approveCode} style={{margin:6}}>
  Verify code
</Button>

  </View>}

    </ScrollView>
  )
}

export default SignUpWithPhoneScreen