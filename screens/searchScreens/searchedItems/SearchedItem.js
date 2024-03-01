import React from 'react';

import {
  Image,
  TouchableNativeFeedback,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { useNavigation } from '@react-navigation/native';

import { accColor } from '../../../assets/ColorsImport';
import { useAuthContext } from '../../../hooks/useAuthContext';

const SearchedItem = ({ item }) => {
    const navigation = useNavigation();
 const opacity=useSharedValue(0);
  const display = useSharedValue('none');
  const scale = useSharedValue(1);
const {user}=useAuthContext();
  const onPressUser = () => {
    opacity.value= withSpring(1);
    display.value='flex';
    scale.value = withSequence(withSpring(0.85), withSpring(0.9), withSpring(1.05));
  };

  const onPressOutUser=()=>{
    opacity.value= withSpring(0);
    display.value='none';
    scale.value = withSequence(withSpring(1.05), withSpring(0.9), withSpring(1));
  };



  const userComponentStyle=useAnimatedStyle(()=>{
    return {
      transform: [{ scale: scale.value }, { translateY: scale.value > 0 ? -5 : 0 }],
    }
  });

  return (
<TouchableNativeFeedback onPressIn={onPressUser} onPressOut={onPressOutUser} onPress={()=>{
if(item.id === user.uid){
  navigation.navigate('HomeScreen', {
    screen:"yourProfile"
  });
}else{
navigation.navigate('ProfileScreen', {
  id: item.id
});
}

}}>
  <Animated.View style={[{flexDirection:"row", gap:16, alignItems:"center", backgroundColor:accColor, padding:4, borderRadius:8}, userComponentStyle]}>
              <Image source={{ uri: item.photoURL }} style={{ width: 70, height: 70, borderRadius: 8 }} />
  </Animated.View>
</TouchableNativeFeedback>
  )
}


export default SearchedItem