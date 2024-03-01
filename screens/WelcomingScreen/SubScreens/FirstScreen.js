import React, { useState } from 'react';

import LottieView from 'lottie-react-native';
import {
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  FadeInDown,
  FadeInUp,
  interpolate,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import MaterialCommunityIcons
  from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

import { useTheme } from '@ui-kitten/components';

import translations
  from '../../../assets/translations/aboutUsTranslations.json';

const FirstScreen = ({scrollX}) => {
const theme=useTheme();
const fontSize=useSharedValue(15);
const arrowPosition=useSharedValue(0);
const [pressed, setPressed]=useState(false);
const animatedStyle=useAnimatedStyle(()=>{
    return {fontSize:fontSize.value}
});
const widthScreen=Dimensions.get('screen').width;

const animationStyles=useAnimatedStyle(()=>{
    const y=interpolate(scrollX.value,[-widthScreen, 0, widthScreen], [-100, 0, 100],Extrapolate.CLAMP);
    const x=interpolate(scrollX.value,[-widthScreen, 0, widthScreen], [50, 0, -50],Extrapolate.CLAMP);
    const scale=interpolate(scrollX.value, [-widthScreen, 0, widthScreen], [0, 1, 0],Extrapolate.CLAMP);

    return {transform:[{translateX:withSpring(x, {
      duration:750
    })}, {scale:withSpring(scale)}, {translateY:withSpring(y, {
      duration:750
    })}]}
});

const screenStyles=useAnimatedStyle(()=>{
  const scale=interpolate(scrollX.value, [-widthScreen, 0, widthScreen], [0, 1, 0],Extrapolate.CLAMP);
  const x=interpolate(scrollX.value, [-widthScreen, 0, widthScreen], [, 1, 0],Extrapolate.CLAMP);
  const opacity=interpolate(scrollX.value, [-widthScreen, 0, widthScreen], [0, 1, 0],Extrapolate.CLAMP);

  return {transform:[{scale:withSpring(scale, {
    duration:750
  })}], opacity:withSpring(opacity, {
    duration:750
  })}
})

const animatedViewStyle=useAnimatedStyle(()=>{

    return {transform:[{translateX:arrowPosition.value}]};
});

const pressInArrow=()=>{
    setPressed(true);
    fontSize.value=withSpring(16);
    arrowPosition.value=withSpring(5);
}

const pressOutArrow=()=>{
    setPressed(false);
    fontSize.value=withSpring(15);
    arrowPosition.value=withSpring(0);
}

    const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
  return (
    <Animated.View style={[{width:Dimensions.get('screen').width, height:Dimensions.get('screen').height}, screenStyles]}>
<Animated.View style={{flexDirection:"row", gap:6, justifyContent:"center", marginTop:32}}>
    <Animated.Text entering={FadeInUp} style={{fontSize:24, fontFamily:"OpenSans-Bold", color:"white"}}>{translations.WelcomeScreenTopText.first[selectedLanguage]}</Animated.Text>

    <Animated.Text entering={FadeInDown.delay(250)} style={{fontSize:24, fontFamily:"OpenSans-Bold", color:"white"}}>{translations.WelcomeScreenTopText.second[selectedLanguage]}</Animated.Text>

    <Animated.Text entering={FadeInUp.delay(500)} style={{fontSize:24, fontFamily:"OpenSans-Bold", color:"white"}}>{translations.WelcomeScreenTopText.third}</Animated.Text>
</Animated.View>
<Animated.View style={animationStyles}>
<LottieView source={require('../../../assets/lottieAnimations/Animation - 1707671640008.json')} autoPlay style={{height:Dimensions.get('screen').height / 2.25, width: 200, alignSelf:"center", marginHorizontal:12, marginBottom:36, marginTop:16}}/>
</Animated.View>
    <View style={{ gap:6, padding:8}}>
    <Animated.Text entering={SlideInRight.delay(625)} style={{ fontSize:18, fontFamily:"OpenSans-Bold", color:"white"}}>{translations.WelcomeScreenTopText.text.top[selectedLanguage]}</Animated.Text>
    <Animated.Text entering={SlideInRight.delay(750)} style={{fontSize:15, fontFamily:"OpenSans-Regular", color:"white"}}>{translations.WelcomeScreenTopText.text.description[selectedLanguage]} 😅</Animated.Text>
    </View>

    <TouchableOpacity activeOpacity={1} onPressOut={pressOutArrow} onPressIn={pressInArrow} style={{flexDirection:"row", gap:16, alignItems:"center",  justifyContent:"center", marginTop:24}}>
            <Animated.Text style={[animatedStyle, {fontFamily:"OpenSans-Bold", color:"white"}]}>{translations.WelcomeScreenTopText.swipeRight[selectedLanguage]}</Animated.Text>
<Animated.View style={[animatedViewStyle, {alignSelf:"center"}]}>
   <MaterialCommunityIcons name='arrow-right' size={pressed ? 24 : 16} color='white' /> 
</Animated.View>
      

    </TouchableOpacity>

    </Animated.View>
  )
}

export default FirstScreen