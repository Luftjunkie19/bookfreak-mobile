import React from 'react';

import LottieView from 'lottie-react-native';
import {
  Dimensions,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@ui-kitten/components';

const FlightModeScreen = () => {
    const theme=useTheme();
  return (
    <View style={{flex:1, backgroundColor:theme['color-basic-800'] }}>
        <LottieView source={require('../../../assets/lottieAnimations/Animation - 1708668796097.json')} autoPlay loop style={{width:Dimensions.get('screen').width, height:Dimensions.get('screen').height / 1.8, alignSelf:"center"}}/>
     <View style={{alignItems:"center", gap:8}}>
      <Text style={{fontSize:18, fontFamily:"OpenSans-Bold", color:"white"}}>Seems you're have your flight mode on.</Text>
      <Text style={{fontSize:12, fontFamily:"OpenSans-Regular", color:"white"}}>Turn it off in order to use the app.</Text>
     </View>
    </View>
  )
}

export default FlightModeScreen