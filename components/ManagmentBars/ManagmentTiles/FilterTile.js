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

const FilterTile = ({filters, selectedFilters, selectFilter, removeFilter}) => {
    return (<View style={{gap:6}}>
      <Select closeOnOverlayClick>
        <SelectTrigger gap={8} bgColor={accColor} android_ripple={{
          color:primeColor
        }} borderRadius={8} padding={4} maxWidth={100} justifyContent='center'>
          <Text style={{fontFamily:"OpenSans-Regular", color:"white"}}>Filters</Text>
          <MaterialCommunityIcons name='filter' color="white" size={20} />
    </SelectTrigger>
    <SelectPortal>
      <SelectBackdrop/>
      <SelectContent bgColor={accColor}>
        <SelectDragIndicatorWrapper>
          <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <FlatList showsVerticalScrollIndicator={false} scrollEnabled data={filters} renderItem={({ item }) => (<SelectItem width="100%" android_ripple={{
              color:primeColor
            }} bgColor={selectedFilters.find((label)=>label === item.label) ? primeColor : accColor} sx={{
              _text: {
                color: "white",
                fontFamily:"OpenSans-Regular"
              },
              ":active": {
                backgroundColor:primeColor
              },
              ":secletion": {
                    backgroundColor:primeColor
              },
              ":hover": {
                    backgroundColor:primeColor
              }
            }} onPress={() => {
                        if (selectedFilters.find((label) => label === item.label)) {
                            removeFilter(item.label);
                        } else {
                            selectFilter(item.label);
    }
}} label={item.label} value={item.label} />)} />
                
      </SelectContent>
    </SelectPortal>
  </Select>
    <Text style={{fontFamily:"OpenSans-Bold", color:"white"}}>Filters:</Text>        
              <View>
                  <FlatList style={{minWidth:150, maxWidth:180}} contentContainerStyle={{gap:8}} horizontal showsHorizontalScrollIndicator={false} scrollEnabled data={selectedFilters} renderItem={({ item }) => (<View style={{alignSelf:"center", padding:4, backgroundColor:accColor, borderRadius:8}}>
                      <Text style={{fontFamily:"OpenSans-Regular", color:"white"}}>{item}</Text>
                  </View>)} />
  </View>
  </View>
  )
}

export default FilterTile