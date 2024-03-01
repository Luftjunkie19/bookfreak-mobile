import React from 'react';

import { View } from 'react-native';
import {
  ActivityIndicator,
  MD2Colors,
} from 'react-native-paper';

import { imgCover } from '../assets/ColorsImport';

const Loader = () => {
  return (
    <View style={{ flex:1, position:"absolute", top:0, left:0, zIndex:60, alignItems:'center', justifyContent:'center',width:"100%", height:"100%", backgroundColor:imgCover
    }}>
      <ActivityIndicator size={60} animating={true} color={MD2Colors.blue500}/>
    </View>
  )
}

export default Loader