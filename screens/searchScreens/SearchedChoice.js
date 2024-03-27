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
} from 'react-native-google-mobile-ads';
import { Searchbar } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { useTheme } from '@ui-kitten/components';

import {
  accColor,
  primeColor,
} from '../../assets/ColorsImport';
import translations from '../../assets/translations/SearchTranslations.json';
import Book from '../../components/CommunityScreensComponents/Book';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocuments from '../../hooks/useGetDocuments';
import SearchedItem from './searchedItems/SearchedItem';

const adUnitId= 'ca-app-pub-9822550861323688~6900348989';

const SearchedChoice = ({route, navigation}) => {
  const {collection}=route.params;
  const {user}=useAuthContext();
  const [searchQuery, setSearchQuery]=useState('');
  const {documents}=useGetDocuments(collection);
  const theme=useTheme();
  const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);


  return (
    <View style={{backgroundColor:theme['color-basic-800'], flex:1}}>


<Searchbar rippleColor={primeColor} iconColor='white' placeholderTextColor='white' clearButtonMode='while-editing' placeholder={collection ==='books' ? translations.searchInput.placeholderBooks[selectedLanguage] : translations.searchInput.placeholderUsers[selectedLanguage]} style={{margin:16, backgroundColor:accColor}} inputStyle={{color:"white", fontFamily:"OpenSans-Regular"}} onTextInput={({nativeEvent})=>{
  setSearchQuery(nativeEvent.text);
}} />

<BannerAd unitId={adUnitId} size={BannerAdSize.LEADERBOARD}/>

<Text style={{color:"white", fontFamily:"OpenSans-Bold", textAlign:"center", fontSize:16, paddingVertical:8}}>{translations.searchedParam[selectedLanguage]} {searchQuery}</Text>

{documents && collection==="books" && documents.filter((book)=>String(book.title).toLowerCase().includes(searchQuery.toLowerCase()) || String(book.author).toLowerCase().includes(searchQuery.toLowerCase())) === 0 && <View>
  <LottieView source={require('../../assets/lottieAnimations/Animation - 1700320134586.json')} autoPlay style={{width:300, height:300}}/>
 
 <Text style={{textAlign:"center", fontFamily:"OpenSans-Regular"}}>{translations.noResults[selectedLanguage]} {searchQuery}</Text>

  </View>}

  {documents && collection === 'users' && documents.filter((book)=>String(book.nickname).toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && <View>
  <LottieView source={require('../../assets/lottieAnimations/Animation - 1700320134586.json')} autoPlay style={{width:300, height:300, alignSelf:"center"}}/>
  <Text style={{textAlign:"center", fontFamily:"OpenSans-Regular"}}>{translations.noResults[selectedLanguage]} {searchQuery}</Text>
  </View>}

{documents && collection === "books" && <FlatList scrollEnabled initialNumToRender={10} contentContainerStyle={{alignItems:"center", padding:8}} data={documents.filter((book)=>String(book.title).toLowerCase().includes(searchQuery.toLowerCase()) || String(book.author).toLowerCase().includes(searchQuery.toLowerCase()))} renderItem={({item})=>(<Book data={item}/>)}/>}

{documents  && collection ==="users" && <FlatList scrollEnabled numColumns={4} columnWrapperStyle={{flexWrap:"wrap", gap:8}} initialNumToRender={10} contentContainerStyle={{gap:16, padding:8, alignItems:"center"}} data={documents.filter((book)=>String(book.nickname).toLowerCase().includes(searchQuery.toLowerCase()))} renderItem={({item})=>(<SearchedItem item={item}/>)} />}



    </View>
  )
}

export default SearchedChoice