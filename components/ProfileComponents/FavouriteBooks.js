import React from 'react';

import LottieView from 'lottie-react-native';
import {
  Dimensions,
  FlatList,
  Text,
  View,
} from 'react-native';

import Book from './ItemComponents/Book';
import { useSelector } from 'react-redux';
import translations from '../../assets/translations/ProfileTranslations.json';
const FavouriteBooks = ({favBooks, openedSection}) => {

  const condition=openedSection === "belovedbooks";
  const selectedLanguage = useSelector((state) => state.languageSelection.selectedLangugage);
  return (<>
  {favBooks && favBooks.length > 0 ?
    <FlatList numColumns={3} columnWrapperStyle={{margin:6, flexWrap:"wrap", flexDirection:"row", gap:6}} data={favBooks} renderItem={({item, index})=>(<Book index={index} data={item} />)}/> :
    <View>
        <Text style={{ textAlign: "center", color: "white", fontFamily: "Inter-Black", fontSize: 20, marginVertical: 12 }}>{!condition ? translations.emptyNotifications.books[selectedLanguage] : translations.emptyNotifications.favourited[selectedLanguage]}</Text>
<LottieView autoPlay loop source={require('../../assets/lottieAnimations/Animation - 1700320134586.json')} style={{
  width: Dimensions.get('screen').width,
  height:300,
  alignSelf:"center"
}}/>
    </View>
  }
  </>
  )
}

export default FavouriteBooks