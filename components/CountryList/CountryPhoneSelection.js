import React, { useState } from 'react';

import {
  Dimensions,
  Image,
  Text,
} from 'react-native';
import MaterialCommunityIcons
  from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  FlatList,
  Input,
  InputField,
  InputSlot,
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

const CountryPhoneSelection = ({countryNumber, open, setClose, setOpen, setSelected}) => {

  const [searchQuery, setSearchQuery] = useState('');

    const { countries }=LanguagePhoneList();
    return (
    <Select>
    <SelectTrigger borderWidth='$0'>
    <Button onPress={()=>setOpen()} radius='md' icon={{name:"flag", type:"material-community", color:"white"}} buttonStyle={{backgroundColor:accColor, padding:8}} titleStyle={{fontFamily:'OpenSans-Bold'}}>
<Text style={{fontFamily:'OpenSans-Bold', color:"white"}}>+{countryNumber ? countryNumber.phone : "?"}</Text>
</Button>
    </SelectTrigger>
    <SelectPortal isOpen={open} closeOnOverlayClick onClose={()=>setClose()}>
      <SelectBackdrop />
      <SelectContent backgroundColor={accColor}>
        <SelectDragIndicatorWrapper>
          <SelectDragIndicator />
        </SelectDragIndicatorWrapper>
       <Input margin={4} variant='rounded'>
       <InputSlot marginLeft={6}>
<MaterialCommunityIcons name='magnify' size={24} color='white'/>
    </InputSlot>
       <InputField color='white' fontFamily='OpenSans-Regular' onChangeText={(val)=>setSearchQuery(val)}/>
       </Input>
        <FlatList maxToRenderPerBatch={20} data={countries.flat().filter((item)=> item.name.includes(searchQuery))} renderItem={({item})=>(<Button onPress={() => {
          setOpen(false);
    setSelected(item);
}} type='clear' buttonStyle={{ gap: 12, width: Dimensions.get('window').width, backgroundColor: countryNumber && +countryNumber.phone === +item.code && primeColor, justifyContent: "flex-start" }} titleStyle={{ fontFamily: "OpenSans-Regular", fontSize: 14, color: "white" }}>
    <Image style={{ width: 45, height: 30, alignSelf: "flex-start" }} source={{ uri: `https://flagcdn.com/h20/${item.code.toLowerCase()}.jpg` }} />
    {item.name}
</Button>)}/>
      </SelectContent>
    </SelectPortal>
  </Select>
  )
}

export default CountryPhoneSelection