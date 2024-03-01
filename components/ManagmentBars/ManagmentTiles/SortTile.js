import React from 'react';

import {
  FlatList,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons
  from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@gluestack-ui/themed';

import {
  accColor,
  primeColor,
} from '../../../assets/ColorsImport';

const SortTile = ({sortings, selectedSorting, setSorting}) => {
  return (
    <View style={{ gap: 8 }}>
            <Select closeOnOverlayClick>
  <SelectTrigger gap={8} bgColor={accColor} android_ripple={{
          color:primeColor
        }} borderRadius={8} padding={6} maxWidth={100} justifyContent='center'>
          <Text style={{fontFamily:"OpenSans-Regular", color:"white"}}>Sorting</Text>
                <MaterialCommunityIcons name="sort" size={20} color="white"/>
  </SelectTrigger>
  <SelectPortal>
    <SelectBackdrop />
    <SelectContent backgroundColor={accColor}>
      <SelectDragIndicatorWrapper>
        <SelectDragIndicator />
      </SelectDragIndicatorWrapper>
            {sortings.map((item) => (<SelectItem bgColor={[selectedSorting].find((label)=>label === item.label) ? primeColor : accColor}  sx={{
              _text: {
                color: "white",
                fontFamily:"OpenSans-Regular"
                        },":active": {
                backgroundColor:primeColor
              },
              ":secletion": {
                    backgroundColor:primeColor
              },
              ":hover": {
                    backgroundColor:primeColor
              }
                      }} android_ripple={{color:primeColor}} onPress={() => {
                          setSorting(item.label);
     }} value={item.label} label={item.label} />))}
    </SelectContent>
  </SelectPortal>
      </Select>
      <Text style={{fontFamily:"OpenSans-Bold", color:"white"}}>Sorting:</Text>
     {selectedSorting.trim().length !== 0 &&  <FlatList showsHorizontalScrollIndicator={false} horizontal style={{maxWidth:150}} data={[selectedSorting]} renderItem={({ item }) => (<Text style={{padding:4, fontFamily:"OpenSans-Regular", color:"white", backgroundColor:accColor, borderRadius:8}}>{item}</Text>)} />}
</View>
  )
}

export default SortTile