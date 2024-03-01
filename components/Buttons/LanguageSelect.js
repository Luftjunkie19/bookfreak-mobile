import React from 'react';

import {
  Image,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';

import { Button } from '@gluestack-ui/themed';
import { ListItem } from '@rneui/base';
import { BottomSheet } from '@rneui/themed';

import {
  accColor,
  primeColor,
} from '../../assets/ColorsImport';

const LanguageSelect = ({handleClose, handleOpen, selectLangugage, showLanguage}) => {
const selectedLanguage= useSelector((state)=>state.languageSelection.selectedLangugage);
const languagesOptions=[{
  value:"de",
  label: "Deutsch",
  icon:"https://flagsapi.com/DE/shiny/64.png",
},
{
  value:"pl",
  label: "Polski",
  icon:"https://flagsapi.com/PL/shiny/64.png",
},{
  value:"en",
  label: "English",
  icon:"https://flagsapi.com/GB/shiny/64.png",
}]

const condition=(i)=>{
 return i === 0 && {borderTopStartRadius:5, borderTopEndRadius:5};
}

const secondCondition=(i)=>{
  return i === 0 && {borderWidth:0, borderColor:'transparent'}
}


  return (
<>
<Button android_ripple={{
  color:"black"
}} backgroundColor='transparent' gap={5} onPress={handleOpen}>
  <Image width={30} height={30}  source={{uri: languagesOptions.find((val)=>val.value===selectedLanguage).icon}}/>
  <Text style={{color:"white", fontFamily:"OpenSans-Regular"}}>{languagesOptions.find((val)=>val.value===selectedLanguage).label}</Text>
</Button>
  
  <BottomSheet isVisible={showLanguage}  >
{languagesOptions.map((val, i)=>(<ListItem 
containerStyle={[condition(i), {
  backgroundColor: accColor
}]}
style={[secondCondition(i), {
  borderWidth:2,
  borderColor:primeColor,
}]} key={val.icon} onPress={()=>{
    selectLangugage(val.value);
    handleClose();
  }}>

<ListItem.Content style={{flexDirection:"row", gap:16}}>
  <ListItem.Title style={{color:"white", fontFamily:"Inter-Black"}}>{val.label}</ListItem.Title>
  <Image source={{uri: val.icon}} width={30} height={30}/>
</ListItem.Content>

</ListItem>))}
  </BottomSheet>
</>

  )
}

export default LanguageSelect