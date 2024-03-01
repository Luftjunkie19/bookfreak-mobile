import React, { useState } from 'react';

import LottieView from 'lottie-react-native';
import { styled } from 'nativewind';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import IonIcons from '@expo/vector-icons/Ionicons';
import {
  Button,
  ButtonText,
  Input,
  InputField,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@ui-kitten/components';

import {
  accColor,
  primeColor,
} from '../../../assets/ColorsImport';
import translations from '../../../assets/translations/FormsTranslations.json';
import Loader from '../../../components/Loader';
import { useLogin } from '../../../hooks/useLogin';
import useSignInWithGithub from '../../../hooks/useSignInWithGithub';
import useSignInWithGoogle from '../../../hooks/useSignInWithGoogle';

const LoginScreen = () => {
const { signInNormally, signInWithFacebook, isPending}=useLogin();
const {promiseAsync, isPending: googlePending}=useSignInWithGoogle();
const {promiseAsync: githubPromise, isPending:githubPending}=useSignInWithGithub();
const navigation=useNavigation();
const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
const theme=useTheme();
const [userData, setUserData]=useState({
  email: null,
  password: null,
});

const signIn=()=>{
signInNormally(userData.email, userData.password);
}

const navigatePhoneLogin=()=>{
  navigation.navigate('PhoneLogin');
}

const NativeText=styled(Text);

  return (<>
    <ScrollView style={{backgroundColor:theme["color-basic-800"]}}>
   <View style={{justifyContent:"center", alignItems:"center", gap:24, padding:16}}>
    <NativeText className='text-white' style={{fontSize:26, fontWeight:"900", fontFamily:'Inter-Black'}}>{translations.signInForm.topText[selectedLanguage]}</NativeText>
    <LottieView source={require('../../../assets/lottieAnimations/Animation - 1700689978781.json')} style={{
      width:200, height:200
    }} autoPlay loop/>
   </View>

   <View>
<View style={{
  margin:8
}}>
  <NativeText fontFamily='Inter-Black' className='text-white font-interBlack'>Email:</NativeText>
  <Input variant="rounded">
  <InputField fontFamily='OpenSans-Regular' keyboardType='email-address' placeholder='Provide your email' onChangeText={(value)=>{
    setUserData((data)=>{
      data.email=value;
      return data;
    });
  }}/>
  </Input>
</View>

<View style={{
  margin:8
}}>
  <NativeText  className='text-white font-interBlack' >{translations.userFields.password[selectedLanguage]}:</NativeText>
  <Input variant="rounded">
  <InputField fontFamily='OpenSans-Regular' type='password' placeholder='Provide your email' onChangeText={(value)=>{
    setUserData((data)=>{
      data.password=value;
      return data;
    });
  }}/>
  </Input>
</View>

<Button android_ripple={{color:primeColor}} backgroundColor={accColor} marginVertical={16} marginHorizontal={8} onPress={signIn}>
  <ButtonText fontFamily='OpenSans-Bold'>{translations.signInForm.btnText[selectedLanguage]}</ButtonText>
</Button>
   </View>

   <View style={{
    alignItems:"center"
   }}>
    <Text style={{fontSize:24, color:"white",  fontFamily:'OpenSans-Bold', margin:8, fontWeight:"900", letterSpacing:1}}>{translations.signInForm.optionsText[selectedLanguage]}</Text>
<View style={{flexDirection:"row", gap:16, flexWrap:"wrap"}}>

<TouchableOpacity onPress={()=>promiseAsync()}>
 <IonIcons name="logo-google" color="white" size={32} style={{padding:16, backgroundColor: "red", borderRadius:100}}/>
</TouchableOpacity>

<TouchableOpacity onPress={()=>githubPromise()}>
<IonIcons name="logo-github" color="white" size={32} style={{padding:16, backgroundColor: "gray", borderRadius:100}}/>
</TouchableOpacity>

<TouchableOpacity onPress={signInWithFacebook}>
<IonIcons name="logo-facebook" color="white" size={32} style={{padding:16, backgroundColor: accColor, borderRadius:100}}/>
</TouchableOpacity>

<TouchableOpacity onPress={navigatePhoneLogin}>
<IonIcons name="call" color="white" size={32} style={{padding:16, backgroundColor: "green", borderRadius:100}}/>
</TouchableOpacity>
</View>
   </View>



    </ScrollView>
    {isPending || githubPending || googlePending && <Loader/>}
  </>
  )
}

export default LoginScreen