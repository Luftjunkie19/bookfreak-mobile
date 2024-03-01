import React from 'react';

import {
  Image,
  View,
} from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const ImageShowCase = ({imgURL}) => {
const sharedScale=useSharedValue(1);

const pinchGesture=Gesture.Pinch().onUpdate((e)=>{
    sharedScale.value= sharedScale.value + e.scale;
});

const animatedStyle=useAnimatedStyle(()=>{
    return {transform:[{scale:sharedScale.value}]};
})

  return (
    <View style={{flex:1, zIndex:500}}>
     
     <View style={{width:250, height:250}}>
     {imgURL &&

 <Image source={{uri:imgURL}} style={[{width:250, height:250}, animatedStyle]}/>
}
     </View>

    </View>
  )
}

export default ImageShowCase