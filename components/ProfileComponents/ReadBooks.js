import React from 'react';

import LottieView from 'lottie-react-native';
import {
  FlatList,
  Text,
  View,
} from 'react-native';
import ReadBook from './ItemComponents/ReadBook';
import { useSelector } from 'react-redux';
import translations from '../../assets/translations/ProfileTranslations.json';
const ReadBooks = ({readBooks, readPages}) => {
  const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLanguage);
  return (<>
  {readBooks && readBooks.length > 0 ? <FlatList numColumns={3} columnWrapperStyle={{margin:6, flexWrap:"wrap", flexDirection:"row", gap:6}} data={readBooks} renderItem={({item, index})=>(<ReadBook index={index} data={item} readPages={readPages}/>)}/> : <View>
    <Text style={{textAlign:"center", color:"white", fontFamily:"Inter-Black", fontSize:20, marginVertical:12}}>{translations.emptyNotifications.booksRead[selectedLanguage]}</Text>
    <LottieView autoPlay source={require('../../assets/lottieAnimations/Animation - 1700320134586.json')} style={{width:200, height:300, alignSelf:"center"}}/>
    </View>}
  </>
  
  )
}

export default ReadBooks
