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

import { useNavigation } from '@react-navigation/native';

import {
  accColor,
  primeColor,
} from '../../../assets/ColorsImport';

const Competition = ({data, index, scrollX}) => {
  const NativeText = styled(Text);
  const navigation= useNavigation();


  const animatedStyles = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * 280, index * 280, (index + 1) * 280];
    const scaleValue = withSpring(interpolate(scrollX.value, inputRange, [0.7, 1, 0.7], Extrapolate.CLAMP));
    const transformY= withSpring(interpolate(scrollX.value, [(index - 1) * 280, index * 280, (index + 1) * 280], [50, 0, -50]));
  
    return {
      transform: [{ scale: scaleValue },{translateY: transformY}, {translateX:transformY}],
    };
  }, []);

  const rippleProps =
    Platform.OS === 'android'
      ? {
          background: TouchableNativeFeedback.Ripple(primeColor, false),
    
        }
      : {};


  return (
  
    <TouchableNativeFeedback onPress={() => {
            navigation.setParams({ params: { id: null } });
        navigation.navigate('CompetitionScreen', {
          params: { id: data.id },
          screen:"CommunityOverall"
           });
           console.log(data.id);
      }} {...rippleProps}>
        <Animated.View
          style={[{
            flexDirection: 'row',
            shadowColor: '#ffffff',
            shadowOffset: {
              width: -3,
              height: 2,
            },
            shadowOpacity: 1,
            shadowRadius: 10,
            elevation: 5,
            gap: 16,
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: 8,
            width: 280,
            maxHeight: 240,
            minHeight: 110,
            backgroundColor: data.expiresAt < new Date().getTime() ? "gray" : accColor,
            margin: 2,
            borderRadius: 10,
            ...Platform.select({
              android: {
                overflow: 'hidden',
                elevation: 5,
              },
            }),
          }, animatedStyles]}
        >
          {data.prize.moneyPrize.amount === 0 ? (
            <Image source={require('../../../assets/ItemReward.webp')} style={{ width: 60, height: 60 }} />
          ) : (
            <Image source={require('../../../assets/MoneyPrize.webp')} style={{ width: 50, height: 50 }} />
          )}

          <View style={{ gap: 4 }}>
            <NativeText className='text-white font-interBlack text-base'>{data.competitionTitle.trim().length > 10 ? `${data.competitionTitle.slice(0, 10)}...`: data.competitionTitle}</NativeText>
            <NativeText className='text-white font-interBlack text-xs'>{data.competitionsName}</NativeText>
            <NativeText className='text-white font-interBlack text-xs'>
              {data.prize.moneyPrize.amount === 0
                ? data.prize.itemPrize.typeOfPrize
                : `${(data.prize.moneyPrize.amount / 100).toFixed(2)} ${data.prize.moneyPrize.currency}`}
            </NativeText>
          </View>
        </Animated.View>
      </TouchableNativeFeedback>

  );
}

export default Competition