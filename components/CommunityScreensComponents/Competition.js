import React from 'react';

import { styled } from 'nativewind';
import {
  Image,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { useNavigation } from '@react-navigation/native';

import {
  accColor,
  primeColor,
} from '../../assets/ColorsImport';

const Competition = ({data}) => {
    const NativeText = styled(Text);
    const navigation=useNavigation();
    const rippleProps =
    Platform.OS === 'android'
      ? {
          background: TouchableNativeFeedback.Ripple(primeColor, false),
    
        }
      : {};

  return (
    <TouchableNativeFeedback onPress={()=>{
        navigation.navigate('CompetitionScreen', { 
          params:{id: data.id}
           });
           console.log(data.id);
      }} {...rippleProps}>
        <Animated.View
          style={{
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
          }}
        >
          {data.prize.moneyPrize.amount === 0 ? (
            <Image source={require('../../assets/ItemReward.webp')} style={{ width: 60, height: 60 }} />
          ) : (
            <Image source={require('../../assets/MoneyPrize.webp')} style={{ width: 50, height: 50 }} />
          )}

          <View style={{ gap: 4 }}>
            <NativeText className='text-white font-interBlack text-base'>{data.competitionTitle}</NativeText>
            <NativeText className='text-white font-interBlack text-xs'>{data.competitionsName}</NativeText>
            <NativeText className='text-white font-interBlack text-xs'>
              {data.prize.moneyPrize.amount === 0
                ? data.prize.itemPrize.typeOfPrize
                : `${data.prize.moneyPrize.amount} ${data.prize.moneyPrize.currency}`}
            </NativeText>
          </View>
        </Animated.View>
      </TouchableNativeFeedback>
  )
}

export default Competition