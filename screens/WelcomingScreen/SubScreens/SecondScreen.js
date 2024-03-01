import React from 'react';

import LottieView from 'lottie-react-native';
import {
  Dimensions,
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';

import translations
  from '../../../assets/translations/aboutUsTranslations.json';

const SecondScreen = ({scrollX}) => {
    const fontSize=useSharedValue(14);
    const arrowPosition=useSharedValue(0);
    const widthScreen=Dimensions.get('screen').width;


const animatedScreen=useAnimatedStyle(()=>{
  const scale=interpolate(scrollX.value, [0, widthScreen, widthScreen * 2], [0, 1, 0],Extrapolate.CLAMP);
  const x=interpolate(scrollX.value, [0, widthScreen, widthScreen * 2], [-50, 0, 50], Extrapolate.CLAMP);

  return {transform:[{scale:withSpring(scale, {
    duration:750
  })}, {translateX:x}], opacity:withSpring(scale, {
    duration:750
  })}
})
 
  
    

    const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
  return (
    <Animated.View style={[{flex:1, width:Dimensions.get('screen').width, height:Dimensions.get('screen').height}, animatedScreen]}>
      <View style={{flexDirection:"row", gap:4, alignItems:"center", justifyContent:"center", marginTop:16}}>
<Animated.Text style={{fontSize:18, fontFamily:"OpenSans-Bold", color:"white"}}>{translations.secondScreen.first[selectedLanguage]}, </Animated.Text>
<Animated.Text style={{fontSize:18, fontFamily:"OpenSans-Bold", color:"white"}}>{translations.secondScreen.second[selectedLanguage]}</Animated.Text>
<Animated.Text style={{fontSize:18, fontFamily:"OpenSans-Bold", color:"white"}}>BookFreak ?</Animated.Text>
      </View>

<Animated.View>
<LottieView source={require('../../../assets/lottieAnimations/Animation - 1699176767867.json')} autoPlay style={{height:Dimensions.get('screen').height / 2.25, width: 200, alignSelf:"center", marginHorizontal:12, marginBottom:24, marginTop:16}}/>
</Animated.View>
<View style={{margin:8, gap:6}}>
    <Animated.Text style={{fontFamily:"OpenSans-Bold", fontSize:24, color:"white"}}>BookFreak</Animated.Text>
    <Animated.Text style={{fontFamily:"OpenSans-Regular", fontSize:15, color:"white"}}>{translations.secondScreen.desciption[selectedLanguage]} 😎</Animated.Text>
</View>

    </Animated.View>
  )
}

export default SecondScreen