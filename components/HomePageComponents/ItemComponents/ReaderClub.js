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
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';

import {
  accColor,
  primeColor,
} from '../../../assets/ColorsImport';
import readerClubTranslations
  from '../../../assets/translations/ClubsTranslations.json';

const ReaderClub = ({ data, itemWidth, scrollX, index }) => {
  const NativeText = styled(Text);
  const selectedLanguage = useSelector((state) => state.languageSelection.selectedLangugage);
const navigation=useNavigation();

const animatedStyle=useAnimatedStyle(()=>{
  const scale = interpolate(scrollX.value, [itemWidth * (index - 1), itemWidth * index, itemWidth * (index + 1)], [0, 1, 0], Extrapolate.CLAMP);
  const transformY=interpolate(scrollX.value, [itemWidth * (index - 1), itemWidth * index, itemWidth * (index + 1)], [100, 0, -100])
return {transform:[{scale}, {translateX:withSpring(transformY, {damping:10, stiffness:40})},  {translateY:withSpring(transformY, {damping:10, stiffness:40})}]}
})


const rippleProps =
Platform.OS === 'android'
  ? {
      background: TouchableNativeFeedback.Ripple(primeColor, false),

    }
  : {};



  return (
    <TouchableNativeFeedback key={index}  {...rippleProps} onPress={() => {
      navigation.setParams({ params: { id: null } });
      navigation.navigate('ReadersClub', {
        params: { id: data.id },
          screen:"OverallClub"
      })
      }} android_ripple={{ color: primeColor }} style={{ overflow: 'hidden' }}>

        <Animated.View
          key={data.id}
          style={[{
            flexDirection: 'row',
            gap: 24,
            alignItems: 'center',
            padding: 8,
            backgroundColor: accColor,
            marginHorizontal: 4,
            minWidth: itemWidth,
            maxHeight: 240,
            minHeight: 110,
            borderRadius: 5,
            shadowColor: '#ffffff',
            shadowOffset: {
              width: -3,
              height: 5,
            },
            shadowOpacity: 1,
            shadowRadius: 15,
            elevation: 5,
          }, animatedStyle]}
        >
          <Image source={{ uri: data.clubLogo }} style={{ width: 100, height: 100, borderRadius: 100 }} />
          <View>
            <Text style={{ fontFamily: 'Inter-Black', fontSize: 16, color: 'white' }}>{data.clubsName.trim().length >=10 ? `${data.clubsName.slice(0,8)}...` : data.clubsName}</Text>
            <NativeText style={{fontSize:10}} className='font-interBlack text-white'>
              {readerClubTranslations.clubObject.required[selectedLanguage]}
              {data.requiredPagesRead} {readerClubTranslations.clubObject.pages[selectedLanguage]}
            </NativeText>
          </View>
        </Animated.View>

    </TouchableNativeFeedback>
  );
};

export default ReaderClub;
