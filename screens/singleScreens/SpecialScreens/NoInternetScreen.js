import React from 'react';

import LottieView from 'lottie-react-native';
import {
  Dimensions,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@ui-kitten/components';

const NoInternetScreen = () => {
    const theme=useTheme();
  return (
    <View style={{flex:1, backgroundColor:theme['color-basic-800']}}>
    <LottieView source={require('../../../assets/lottieAnimations/Animation - 1708669211624.json')} autoPlay loop style={{width:Dimensions.get('screen').width, height:Dimensions.get('screen').height / 2}}/>
     <View style={{alignItems:"center", gap:8}}>
      <Text style={{fontSize:16, fontFamily:"OpenSans-Bold", color:"white"}}>Seems you're not connected to any network.</Text>
      <Text style={{fontSize:12, fontFamily:"OpenSans-Regular", color:"white"}}>Connect to any network in order to use the app further.</Text>
     </View>
    </View>
  )
}

export default NoInternetScreen