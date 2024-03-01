import React, { useState } from 'react';

import LottieView from 'lottie-react-native';
import {
  FlatList,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { useTheme } from '@ui-kitten/components';

import translations from '../../../assets/translations/SearchTranslations.json';
import TestItem
  from '../../../components/HomePageComponents/ItemComponents/Test';
import ManagementBar from '../../../components/ManagmentBars/ManagementBar';
import useGetDocuments from '../../../hooks/useGetDocuments';

const Tests = () => {
    const {documents}=useGetDocuments('tests');
  const theme = useTheme();
  const sortOptions=[{label:"Test's name (Z-A)", sort:()=>{}}, {label:"Test's name (A-Z)", sort:()=>{}}];
const filterOptions=[{label:"Queries <= 10", filter:(array)=>{
  return array.filter(test => Object.values(test.queries).length <=10);
}}, {label:"Queries >= 10", filter:(array)=>{
  return array.filter(test => Object.values(test.queries).length >= 10);
}}];
  const selectedLanguage = useSelector((state) => state.languageSelection.selectedLangugage);
  const [selectedFilters, setFilters] = useState([]);
  const [selectedSorting, setSorting] = useState("");

  const addToFilters = (label) => {
    setFilters((prev) => {
      return [...prev, label];
    })
  }

  const removeFromFilters = (label) => {
    setFilters((prev) => prev.filter((item) => item !== label));
  }

  const selectSorting = (label) => {
    setSorting(label);
  }



  const filteredArray = () => {
    let array = []
    if (selectedFilters.length > 0) {
      selectedFilters.map((filter) => {
        const option = filterOptions.find((filterOption) => filterOption.label === filter);
  
        array.push(...option.filter(documents));
      });
     return  array;
    } else {
      return documents;
    }
  }

  const sortedArray = () => {
    if (selectedSorting.trim() !== "") {
      const selectedSortingOption = sortOptions.find((sort) => sort.label === selectedSorting);
    return selectedSortingOption.sort(filteredArray());
    } else {
      return filteredArray();
    }
  }


  return (
    <View style={{backgroundColor:theme['color-basic-800'], flex:1}}>
<ManagementBar selectFilter={addToFilters} removeFilter={removeFromFilters} selectedSorting={selectedSorting} selectedFilters={selectedFilters} selectSorting={selectSorting} sortings={sortOptions} filters={filterOptions} />
      {sortedArray().length === 0 && <View style={{alignSelf:"flex-start", gap:8}}>
        <LottieView autoPlay source={require('../../../assets/lottieAnimations/Animation - 1699294838586.json')} style={{width:150, height:300}} />
        <Text style={{ fontFamily: "OpenSans-Bold", fontSize: 20, color: "white", textAlign: "center" }}>{translations.noResultsText[selectedLanguage]}</Text>
      </View>}
   {documents && documents.length > 0 &&  <FlatList scrollEnabled numColumns={2} initialNumToRender={10} contentContainerStyle={{ margin:8}} data={sortedArray()} renderItem={({item, index})=>(<TestItem test={item}/>)}/>}
    </View>
  )
}

export default Tests