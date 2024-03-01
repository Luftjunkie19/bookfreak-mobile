import React, {
  useEffect,
  useState,
} from 'react';

import {
  Dimensions,
  ScrollView,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@ui-kitten/components';

import FirstScreen from './SubScreens/FirstScreen';
import SecondScreen from './SubScreens/SecondScreen';
import ThirdScreen from './SubScreens/ThirdScreen';

const WelcomeScreen = () => {
const theme= useTheme();
const [downloaded, setDownloaded]=useState(false);
const scrollX=useSharedValue(0);
const checkIfDownloaded= async ()=>{
  const isDownloaded= await AsyncStorage.getItem('downloaded');
  if(!isDownloaded){
    setDownloaded(false);
  }else{
    setDownloaded(true);
  }
}

useEffect(()=>{
  checkIfDownloaded();
},[])

    return (
    <ScrollView snapToInterval={Dimensions.get('screen').width} onScroll={({nativeEvent})=>{
        scrollX.value = nativeEvent.contentOffset.x;
        console.log(scrollX.value, Math.round(Dimensions.get('screen').width));
    
    }} bounces={false}  horizontal showsHorizontalScrollIndicator={false} pagingEnabled style={{backgroundColor:theme['color-basic-800'], width:Dimensions.get('screen').width, height:Dimensions.get('screen').height}}>
 <FirstScreen scrollX={scrollX} /> 
 <SecondScreen scrollX={scrollX}/> 

<ThirdScreen scrollX={scrollX}/>
    </ScrollView>
  )
}

export default WelcomeScreen