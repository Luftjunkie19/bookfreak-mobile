import React, { useState } from 'react';

import LottieView from 'lottie-react-native';
import {
  FlatList,
  Text,
  View,
} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { Searchbar } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { useTheme } from '@ui-kitten/components';

import { accColor } from '../../../assets/ColorsImport';
import translations from '../../../assets/translations/SearchTranslations.json';
import typesTranslation
  from '../../../assets/translations/TypesTranslations.json';
import Book from '../../../components/CommunityScreensComponents/Book';
import ManagementBar from '../../../components/ManagmentBars/ManagementBar';
import useGetDocuments from '../../../hooks/useGetDocuments';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-9822550861323688~6900348989';
const Books = () => {
    const {documents}=useGetDocuments('books');
  const theme = useTheme();
  const selectedLanguage = useSelector((state) => state.languageSelection.selectedLangugage);
  const [inputValue, setInputValue] = useState("");
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


   const filterOptions=[
    {
      filter:(array)=>{
        return array.filter((book) => book.category ===  "Fiction");
      },
      label: typesTranslation.bookFilter.fiction[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Non-fiction");
      },
      label: typesTranslation.bookFilter["non-fiction"][selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "Crime");
      },
      label: typesTranslation.bookFilter.crime[selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "Science fiction and fantasy");
      },
      label: typesTranslation.bookFilter.scienceFF[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Children's and young adult literature");
      },
      label: typesTranslation.bookFilter.cayal[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Travel and adventure literature");
      },
      label: typesTranslation.bookFilter.travelaal[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Popular science and popular history");
      },
      label: typesTranslation.bookFilter.popularScience[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Self-help and personal development");
      },
      label: typesTranslation.bookFilter.selfHelp[selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "History and culture");
      },
      label: typesTranslation.bookFilter.history[selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "Art and design");
      },
      label: typesTranslation.bookFilter.artDesign[selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "Business and economics");
      },
      label: typesTranslation.bookFilter.Business[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Psychology and philosophy");
      },
      label: typesTranslation.bookFilter.Psychology[selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "Health and medicine");
      },
      label: typesTranslation.bookFilter.Health[selectedLanguage],
    },
    {
      filter:   (array)=>{
        return array.filter((book) => book.category === "Erotic literature");
      },
      label: typesTranslation.bookFilter.Erotic[selectedLanguage],
    },
  ];

  const sortOptions=[
     {
    label: typesTranslation.bookSort.Default[selectedLanguage],
    sort: (array) => array.slice().sort((a, b) => a.title - b.title),
  },
  {
    label: typesTranslation.bookSort.pagesDescending[selectedLanguage],
    sort: (array) => array.slice().sort((a, b) => b.pagesNumber - a.pagesNumber),
  },
  {
    label: typesTranslation.bookSort.pagesAscending[selectedLanguage],
    sort: (array) => array.slice().sort((a, b) => a.pagesNumber - b.pagesNumber),
  },
  ];


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
<Searchbar placeholderTextColor="white" placeholder={translations.searchInput.placeholderBooks[selectedLanguage]} elevation={12} iconColor='white' inputStyle={{color:"white", fontFamily:"OpenSans-Regular"}} style={{margin:12, backgroundColor:accColor}} />
<BannerAd unitId={adUnitId} size={BannerAdSize.FULL_BANNER}/>
<ManagementBar selectedFilters={selectedFilters} selectedSorting={selectedSorting} selectFilter={addToFilters} selectSorting={selectSorting} removeFilter={removeFromFilters} filters={filterOptions} sortings={sortOptions}/>
      {sortedArray().length === 0 && <View style={{alignSelf:"flex-start", gap:8}}>
        <LottieView autoPlay source={require('../../../assets/lottieAnimations/Animation - 1699294838586.json')} style={{width:150, height:300}} />
        <Text style={{ fontFamily: "OpenSans-Bold", fontSize: 20, color: "white", textAlign: "center" }}>{translations.noResultsText[selectedLanguage]} {selectedFilters.forEach((item)=>(<Text>{item}</Text>))}</Text>
      </View>}
{documents && <FlatList scrollEnabled style={{marginTop:4}} contentContainerStyle={{alignSelf:"center"}} data={sortedArray()} renderItem={({item, index})=>(<Book data={item}/>)}/>}
    </View>
  )
}

export default Books