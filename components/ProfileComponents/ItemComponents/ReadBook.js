import React from 'react';

import {
  Image,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import { useNavigation } from '@react-navigation/native';

import {
  accColor,
  primeColor,
} from '../../../assets/ColorsImport';

const ReadBook = ({data, readPages, index}) => {
 const navigation=useNavigation();
const translateY=useSharedValue(0);
const rotate=useSharedValue(0);

const onInpress=()=>{
  translateY.value=-5;
  rotate.value=360;
}

const animatedStyling=useAnimatedStyle(()=>{
  return {transform:[
    { translateY:withSpring(translateY.value)},
    {rotate: withDelay(200, withSpring(`${rotate.value}deg`))}
  ]}
})

 return (
<TouchableNativeFeedback onPressOut={()=>{
  translateY.value=0;
  rotate.value=0;
}} onPressIn={onInpress} background={TouchableNativeFeedback.Ripple(primeColor, false)}  onPress={()=>{
  navigation.navigate('BookScreen', {
    id:data.id
  })
}}>
  <Animated.View style={[{position:"relative", top:0, left:0, width: 120, height:150, borderRadius:5}, animatedStyling]}>
    <Image source={{uri:data.photoURL}} width={120} height={150} style={{borderRadius:5}}/>

    <View style={{position:"absolute",padding:2, bottom:0, left:0, width:"100%", height:50, backgroundColor:accColor, borderBottomEndRadius:5,borderBottomStartRadius:5 }}>
<Text style={{color:"white", fontWeight:"500", fontFamily:"Inter-Black"}}>{data.title.trim().length >= 10 ? `${data.title.slice(0,10)}...` : data.title}</Text>
<Text style={{color:"white", fontWeight:"500", fontSize:10,fontFamily:"Inter-Black"}}>{data.category.trim().length >= 15 ? `${data.category.slice(0,15)}...` : data.category}</Text>
    </View>
  </Animated.View>
   </TouchableNativeFeedback>
  )
}

export default ReadBook