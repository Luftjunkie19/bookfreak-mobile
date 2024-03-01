import React from 'react';

import LottieView from 'lottie-react-native';
import {
  Dimensions,
  Text,
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';

import { accColor } from '../../../assets/ColorsImport';
import translations
  from '../../../assets/translations/aboutUsTranslations.json';

const ThirdScreen = ({scrollX}) => {
    const navigation=useNavigation();
    const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
    const widthScreen=Dimensions.get('screen').width;
    const animatedStyle=useAnimatedStyle(()=>{
      const scale= interpolate(scrollX.value, [widthScreen, widthScreen * 2],[0, 1],Extrapolate.CLAMP);

      return {transform:[{scale:withSpring(scale, {
        duration:750
      })}], opacity:withSpring(scale, {
        duration:750
      })}
    });

    const setDownloadedItem= async()=>{
      const downloadedState= await AsyncStorage.getItem('downloaded');
    
      if(!downloadedState){
        await AsyncStorage.setItem('downloaded', "true");
      }else{
        return true;
      }
    }
    
    const navigateSignIn=()=>{
      setDownloadedItem();
    navigation.navigate('Login');
}

const navigateSignUp=()=>{
  setDownloadedItem();
    navigation.navigate('SignUp');
}



  return (
    <Animated.View style={[{flex:1, width:Dimensions.get('screen').width, height:Dimensions.get('screen').height}, animatedStyle]}>
   <View style={{marginHorizontal:6, marginVertical:24}}>
    <Text style={{fontSize:20, color:"white", fontFamily:"OpenSans-Bold", textAlign:"center"}}>{translations.thirdScreen.topText[selectedLanguage]}</Text>
    <LottieView source={require('../../../assets/lottieAnimations/Animation - 1707680768225.json')} autoPlay style={{width:Dimensions.get('screen').width/1.25, height:Dimensions.get('screen').height/2.5, alignSelf:"center"}}/>
    <Text style={{fontSize:20, color:"white", fontFamily:"OpenSans-Bold", textAlign:"center"}}>{translations.thirdScreen.bottom[selectedLanguage]}</Text>
   </View>

<View style={{flexDirection:'row', justifyContent:"center", gap:16, position:"relative", top:50, alignItems:"center"}}>
    <Button radius='md' titleStyle={{fontFamily:"OpenSans-Bold"}} iconRight icon={{name:"account-plus", type:"material-community", color:"white"}} buttonStyle={{ gap:8, backgroundColor:accColor}} onPress={navigateSignUp}>{translations.thirdScreen.buttonTexts.signUp[selectedLanguage]}</Button>
    <Text style={{alignSelf:"center", fontFamily:"OpenSans-Bold", color:"white"}}>{translations.thirdScreen.buttonTexts.or[selectedLanguage]}</Text>
<Button radius='md' titleStyle={{fontFamily:"OpenSans-Bold"}} iconRight icon={{name:"account", type:"material-community", color:"white"}} buttonStyle={{ gap:8, backgroundColor:accColor}} onPress={navigateSignIn}>{translations.thirdScreen.buttonTexts.signIn[selectedLanguage]}</Button>
</View>

    </Animated.View>
  )
}

export default ThirdScreen