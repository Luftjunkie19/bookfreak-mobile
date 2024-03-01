import React from 'react';

import { styled } from 'nativewind';
import {
  Image,
  Platform,
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
import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';

import {
  accColor,
  primeColor,
} from '../../assets/ColorsImport';
import homeTranslations
  from '../../assets/translations/homePageTranslations.json';

const Book = ({data}) => {
  const selectedLanguage = useSelector((state) => state.languageSelection.selectedLangugage);
  const navigate = useNavigation();
  const NativeView = styled(View);
  const NativeText = styled(Text);
  const scale = useSharedValue(1);

  const pressIn = () => {
    scale.value = withSequence(withSpring(1), withSpring(1.05), withSpring(0.9));
  }
  
  const pressOut = () => {
    scale.value = withSequence(withSpring(1.05), withSpring(0.9), withSpring(1));
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {transform:[{scale:scale.value}]}
  })

  const rippleProps =
  Platform.OS === 'android'
    ? {
        background: TouchableNativeFeedback.Ripple(primeColor, false),
      }
    : {};
  const handlePress = () => {
    navigate.navigate('BookScreen', {
      id: data.id,
    });
  };


  return (
    <TouchableNativeFeedback onPressIn={pressIn} onPressOut={pressOut} onPress={handlePress} {...rippleProps}>
    <Animated.View
      key={data.id}
      style={[{
     maxWidth:360,
        height: 150, // Set your desired height here
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
        borderBottomStartRadius: 5,
        borderBottomEndRadius: 5,
        backgroundColor: accColor,
        flexDirection: 'row',
        margin: 8,
        ...Platform.select({
          android: {
            overflow: 'hidden',
            shadowColor: 'white',
            shadowOffset: {
              width: -5,
              height: -10,
           },
           shadowOpacity: 1,
           shadowRadius: 13,
           elevation: 3,
            // Set the desired elevation for the shadow
          },
          ios: {
            shadowColor: 'white',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 4,
          },
        }),
      }, animatedStyle]}
    >
      <NativeView className="w-2/5 sm:h-full 2xl:h-[150%] relative top-0 left-0 shadow-md shadow-white rounded-md">
        <Image
          source={{ uri: data.photoURL }}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            position: 'absolute',
            top: -5,
            left: -3,
            borderRadius: 4,
          }}
        />
      </NativeView>

      <View style={{ padding: 4 }}>
        <NativeText className="font-interBlack text-white text-base">{String(data.title).trim().length >= 13 ? `${data.title.slice(0,10)}...` : data.title}</NativeText>
        <NativeText className="font-interBlack text-xs text-white" style={{ width: 150 }}>
          {data.category}
        </NativeText>
        <NativeText className="font-interBlack text-xs text-white">
         {data.pagesNumber} {homeTranslations.homePage.bookObject.pages[selectedLanguage]}
        </NativeText>
        <NativeText className="font-interBlack text-white text-sm">{homeTranslations.homePage.bookObject.by[selectedLanguage]}:{" "} {data.author}</NativeText>
      </View>
    </Animated.View>
  </TouchableNativeFeedback>
  )
}

export default Book