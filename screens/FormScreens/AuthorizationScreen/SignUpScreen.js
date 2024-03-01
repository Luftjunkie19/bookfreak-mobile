import React, { useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import LottieView from 'lottie-react-native';
import {
  Image,
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
import { useLogin } from '../../../hooks/useLogin';
import useSignInWithGithub from '../../../hooks/useSignInWithGithub';
import useSignInWithGoogle from '../../../hooks/useSignInWithGoogle';

const SignUpScreen = () => {
  const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
  const { signUpUser, signInWithFacebook, isPending}=useLogin();
  const {promiseAsync, isPending:googlePending}=useSignInWithGoogle();
  const {promiseAsync:promiseAsyncGithub, isPending:githubPending}=useSignInWithGithub();
const navigation=useNavigation();
  const theme= useTheme();
const [userData,setUserData]=useState({
  displayName:null,
  email:null,
  password:null,
  photoURL: null,
});

  const navigateToLogin=()=>{
    navigation.navigate('Login');
  };

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
        setUserData((prev) => {
          prev.photoURL = uri;
          return prev;
        });
      
      } else {
        alert('You did not select any image.');
      }
    } catch (error) {
      console.error(error);
      // Handle the error as needed
    }
  };
  

  const submitForm= async ()=>{
   console.log(userData);
   await signUpUser(userData.email, userData.password, userData.displayName,userData.photoURL);
  }

const navigateToPhoneSignUp=()=>{
  navigation.navigate("PhoneSignUp");
}

  return (<>
    <ScrollView style={{backgroundColor: theme['color-basic-800']}}>
<View>
  <Text style={{textAlign:"center", color:"white", fontFamily: "Inter-Black", fontSize:20, fontWeight:600, padding:8}}>{translations.signUpForm.topText[selectedLanguage]}</Text>
  <LottieView autoPlay loop source={require('../../../assets/lottieAnimations/Animation - 1703334331539.json')} style={{
    width:300, 
    height:300,
    alignSelf:"center"
  }}/>
</View>


<View>

<View style={{
  margin:8
}}>
<Text style={{color:"white", fontFamily: "Inter-Black"}}>{translations.userFields.nickname[selectedLanguage]}:</Text>
<Input variant="rounded" size="lg">
<InputField fontFamily='OpenSans-Regular' color='white'  placeholder='Type your nickname' onChangeText={(value)=>{
setUserData((data)=>{
  data.displayName=value;
  return data;
});
}}/>
</Input>
      </View>

      <View style={{
  margin:8
}}>
<Text style={{color:"white", fontFamily: "Inter-Black"}}>Email:</Text>
<Input variant="rounded" size="lg">
<InputField keyboardType='email-address' fontFamily='OpenSans-Regular' color='white' placeholder='Type your email' onChangeText={(value)=>{
  setUserData((data)=>{
    data.email=value;
    return data;
  });
}} />
</Input>
</View>

  <View style={{
  margin:8
}}>
<Text style={{color:"white", fontFamily: "Inter-Black"}}>{translations.userFields.password[selectedLanguage]}:</Text>
<Input variant="rounded" size="lg">
<InputField type='password' fontFamily='OpenSans-Regular'  placeholder='Type your password' onChangeText={(value)=>{
  setUserData((data)=>{
    data.password=value;
    return data;
  })
}}/>
</Input>
  </View>

  <View>
{userData.photoURL && <Image style={{width:150, height:150, alignSelf:"center", margin:6, borderRadius:100}} source={{uri:userData.photoURL}} />}

    <Button android_ripple={{color:primeColor}} backgroundColor={accColor} gap={8} alignItems='center' margin={20} onPress={pickImageAsync}>
<ButtonText fontFamily='OpenSans-Bold'>{translations.selectImgBtn.text[selectedLanguage]}</ButtonText>
      <IonIcons name="image" size={24} color="white"/>
    </Button>
  </View>


  <Button backgroundColor={accColor} margin={8} onPress={submitForm}>
    <ButtonText fontFamily='OpenSans-Bold'>{translations.signUpForm.btnText[selectedLanguage]}</ButtonText>
  </Button>
</View>

<Button variant="link" gap={6} alignItems='center' onPress={navigateToLogin}>
  <ButtonText color='white' fontFamily="Inter-Black">
   {translations.signUpForm.haveAccount[selectedLanguage]}
  </ButtonText>
<IonIcons name='person' color="white" size={24}/>
</Button>

<Text style={{fontWeight:900, color:"white", fontFamily:"OpenSans-Bold", textAlign:"center", fontSize:24, margin:6}}>{translations.signUpForm.optionsText[selectedLanguage]}</Text>
<View style={{flexDirection:"row", gap:24, flexWrap:"wrap", alignItems:"center", justifyContent:"center", marginVertical:6}}>

<TouchableOpacity onPress={()=>promiseAsync()}>
 <IonIcons name="logo-google" color="white" size={32} style={{padding:16, backgroundColor: "red", borderRadius:100}}/>
</TouchableOpacity>

<TouchableOpacity onPress={()=>promiseAsyncGithub()}>
<IonIcons name="logo-github" color="white" size={32} style={{padding:16, backgroundColor: "gray", borderRadius:100}}/>
</TouchableOpacity>

<TouchableOpacity onPress={signInWithFacebook}>
<IonIcons name="logo-facebook" color="white" size={32} style={{padding:16, backgroundColor: accColor, borderRadius:100}}/>
</TouchableOpacity>

<TouchableOpacity onPress={navigateToPhoneSignUp}>
<IonIcons name="call" color="white" size={32} style={{padding:16, backgroundColor: "green", borderRadius:100}}/>
</TouchableOpacity>

</View>

    </ScrollView>
    {isPending || githubPending || googlePending && <Loader/>}
  </>
  )
}

export default SignUpScreen