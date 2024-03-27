import React, { useState } from 'react';

import {
  Dimensions,
  Image,
} from 'react-native';

import {
  FlatList,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectPortal,
  SelectTrigger,
} from '@gluestack-ui/themed';
import { Button } from '@rneui/themed';

import {
  accColor,
  primeColor,
} from '../../assets/ColorsImport';
import LanguagePhoneList from '../../assets/LanguagePhoneList';

const CountryListSelection = ({setSelected, selected}) => {
  const { countries }=LanguagePhoneList();
  const [open, setOpen]=useState(false);
    return (
    <Select>
    <SelectTrigger borderWidth='$0'>
    <Button onPress={()=>setOpen(true)} radius='md' icon={{name:"flag", type:"material-community", color:"white"}} buttonStyle={{backgroundColor:accColor}} titleStyle={{fontFamily:'OpenSans-Bold'}}>
Select Country
</Button>
    </SelectTrigger>
    <SelectPortal isOpen={open} closeOnOverlayClick onClose={()=>setOpen(false)}>
      <SelectBackdrop />
      <SelectContent backgroundColor={accColor}>
        <SelectDragIndicatorWrapper>
          <SelectDragIndicator />
        </SelectDragIndicatorWrapper>
<FlatList maxToRenderPerBatch={20} data={countries.flat()} renderItem={({item})=>(<Button onPress={()=>{
   setSelected(item);
    setOpen(false);
}} type='clear' buttonStyle={{gap:12, width:Dimensions.get('window').width, backgroundColor: selected.nationality.toLowerCase() === item.code.toLowerCase() ? primeColor : '', justifyContent:"flex-start"}} titleStyle={{fontFamily:"OpenSans-Regular", fontSize:14, color:"white"}}>
        <Image style={{width:45, height:30, alignSelf:"flex-start"}} source={{uri:`https://flagcdn.com/h20/${item.code.toLowerCase()}.jpg`}}/>

         {item.name}
 </Button>)}/>
      </SelectContent>
    </SelectPortal>
  </Select>
  )
}

export default CountryListSelection