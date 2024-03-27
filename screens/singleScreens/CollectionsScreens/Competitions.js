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
import competitionTranslations
  from '../../../assets/translations/CompetitionsTranslations.json';
import translations from '../../../assets/translations/SearchTranslations.json';
import Competition
  from '../../../components/CommunityScreensComponents/Competition';
import ManagementBar from '../../../components/ManagmentBars/ManagementBar';
import useGetDocuments from '../../../hooks/useGetDocuments';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-9822550861323688~6900348989';
const Competitions = () => {
    const {documents}=useGetDocuments('competitions');
  const theme = useTheme();
      const filterOptions = [{
        label:"prize (Money)", filter:(array)=>{
            return array.filter((doc)=>doc.prize.moneyPrize.amount > 0);
        }
    }, 
    {
        label:"prize (Item)", filter:(array)=>{
            return array.filter((doc)=> doc.prize.moneyPrize.amount === 0);
        }
    }, 
    {
        label:"Type (Teach to fish)", filter:(array)=>{
            return array.filter((doc)=>doc.competitionsName === "Teach to fish");
        }
    }, 
    {
        label:"Type (Lift others, rise)", filter:(array)=>{
            return array.filter((doc)=>doc.competitionsName ==="Lift others, rise");
        }
    }, 
    {
        label:"Type (First Come, First Booked)",
        filter: (array) =>{
            return array.filter((doc)=>doc.competitionsName ==="First read, first served");
        },
    },
    {label:"Expired",filter:(array)=>{
      return array.filter((doc)=>doc.expiresAt < new Date().getTime());
    }},{
      label:"Not Expired",filter:(array)=>{
        return array.filter((doc)=> doc.expiresAt >= new Date().getTime())
      }
    }
      ];
      const selectedLanguage = useSelector((state) => state.languageSelection.selectedLangugage);
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
        <Searchbar placeholderTextColor="white" placeholder={competitionTranslations.competitionObject.competitionsName[selectedLanguage]} elevation={12} iconColor='white' inputStyle={{color:"white", fontFamily:"OpenSans-Regular"}} style={{margin:12, backgroundColor:accColor}} />
        <BannerAd unitId={adUnitId} size={BannerAdSize.FULL_BANNER}/>
<ManagementBar selectFilter={addToFilters} removeFilter={removeFromFilters} selectedSorting={selectedSorting} selectedFilters={selectedFilters} selectSorting={selectSorting} sortings={sortOptions} filters={filterOptions} />
     {sortedArray().length === 0 && <View style={{alignSelf:"flex-start", gap:8}}>
        <LottieView autoPlay source={require('../../../assets/lottieAnimations/Animation - 1699294838586.json')} style={{width:150, height:300}} />
        <Text style={{ fontFamily: "OpenSans-Bold", fontSize: 20, color: "white", textAlign: "center" }}>{translations.noResultsText[selectedLanguage]}</Text>
      </View>}
        {documents && <FlatList scrollEnabled contentContainerStyle={{ alignItems: "center", gap: 16, marginTop:4 }} data={sortedArray()} renderItem={({ item, index }) => (<Competition data={item} />)} />}
    </View>
  )
}

export default Competitions
