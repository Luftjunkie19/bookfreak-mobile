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
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { useNavigation } from '@react-navigation/native';

import { accColor } from '../../../assets/ColorsImport';

const Book = ({data, condition, index}) => {
  const isPressed = useSharedValue(1);

  const animatedStyling = useAnimatedStyle(() => {
    return { transform: [{ scale: withSpring(isPressed.value) }] };
  });

  const navigation = useNavigation();

  return (
    <TouchableNativeFeedback
      onPressIn={() => {
        isPressed.value = withSequence(withSpring(1.02, {
          stiffness:50
        }), withSpring(1, {
          stiffness:50
        }), withSpring(0.85, {
          stiffness:50
        }));
      }}
      onPressOut={()=>{
        isPressed.value = withSequence(withSpring(0.85, {
          stiffness:50
        }), withSpring(1.02, {
          stiffness:50
        }), withSpring(1, {
          stiffness:50
        }));;
      }}
      onPress={() => {
        navigation.navigate('BookScreen', {
          id: data.id,
        });
      }}>
      <Animated.View style={[{ position: 'relative', top: 0, left: 0, width: 120, height: 150 }, animatedStyling]}>
        <Image source={{ uri: data.photoURL }} width={120} height={150} style={{ borderRadius: 5 }} />
        <View style={{ backgroundColor: accColor, paddingHorizontal: 4, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40%' }}>
          <Text style={{ color: 'white', fontFamily: 'Inter-Black', fontSize: 14 }}>{data.title.trim().length > 10 ? `${data.title.slice(0, 8)}...` : data.title}</Text>
          <Text style={{ color: 'white', fontFamily: 'Inter-Black', fontSize: 12 }}>{data.author}</Text>
        </View>
      </Animated.View>
    </TouchableNativeFeedback>
  )
}

export default Book