import React, { useState } from 'react';

import LottieView from 'lottie-react-native';
import {
  Dimensions,
  FlatList,
  Text,
  View,
} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import { Searchbar } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { useTheme } from '@ui-kitten/components';

import { accColor } from '../../../assets/ColorsImport';
import clubsTranslations
  from '../../../assets/translations/ClubsTranslations.json';
import translations from '../../../assets/translations/SearchTranslations.json';
import Club from '../../../components/CommunityScreensComponents/Club';
import ManagementBar from '../../../components/ManagmentBars/ManagementBar';
import useGetDocuments from '../../../hooks/useGetDocuments';

const adUnitId = 'ca-app-pub-9822550861323688/3794649396';
const ReaderClubs = () => {
    const {documents}=useGetDocuments('readersClubs');
  const theme = useTheme();
   const filterOptions = [{
    label:"<= 100 read pages", filter:(array)=>{
        return array.filter((doc)=>doc.requiredPagesRead <= 100);
    }
}, 
{
    label:">= 100 read pages", filter:(array)=>{
        return array.filter((doc)=>doc.requiredPagesRead >= 100);
    }
}, 
{
    label:">= 500 read pages", filter:(array)=>{
        return array.filter((doc)=>doc.requiredPagesRead >= 500);
    }
}, 
{
    label:">= 1000 read pages", filter:(array)=>{
        return array.filter((doc)=>doc.requiredPagesRead >= 1000);
    }
}, 
    
  ];


  const sortOptions = [
    {
        label:"Time (Ascending)", 
        sort:(array)=>{
            return array.sort((a,b)=>b.createdBy.createdAt - a.createdBy.createdAt);
        }
    },
    {
        label:"Time (Descending)", 
        sort:(array)=>{
            return array.sort((a,b)=>a.createdBy.createdAt - b.createdBy.createdAt);
        }
    }
  ];

  const [selectedFilters, setFilters] = useState([]);
  const [selectedSorting, setSorting] = useState("");
  const selectedLanguage = useSelector((state) => state.languageSelection.selectedLangugage);
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
<Searchbar placeholderTextColor="white" placeholder={clubsTranslations.clubObject.clubsName[selectedLanguage]} elevation={12} iconColor='white' inputStyle={{color:"white", fontFamily:"OpenSans-Regular"}} style={{margin:12, backgroundColor:accColor}} />
<BannerAd unitId={adUnitId} size={BannerAdSize.FULL_BANNER}/>
<ManagementBar selectFilter={addToFilters} removeFilter={removeFromFilters} selectedSorting={selectedSorting} selectedFilters={selectedFilters} selectSorting={selectSorting} sortings={sortOptions} filters={filterOptions} />
   {sortedArray().length === 0 && <View style={{alignSelf:"flex-start", gap:8}}>
        <LottieView autoPlay source={require('../../../assets/lottieAnimations/Animation - 1699294838586.json')} style={{width:150, height:300}} />
        <Text style={{ fontFamily: "OpenSans-Bold", fontSize: 20, color: "white", textAlign: "center" }}>{translations.noResults[selectedLanguage]}</Text>
      </View>}
        {documents && <FlatList style={{marginTop:8}} scrollEnabled pagingEnabled initialNumToRender={10} contentContainerStyle={{ gap: 8, alignItems: "center" }} data={sortedArray()} renderItem={({ item, index }) => (<Club data={item} index={index} itemWidth={Dimensions.get('screen').width/1.2} />)}/>}
    </View>
  )
}

export default ReaderClubs