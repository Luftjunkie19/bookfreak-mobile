import React from 'react';

import {
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { Button } from '@rneui/themed';
import { useTheme } from '@ui-kitten/components';

import { accColor } from '../../assets/ColorsImport';
import translations from '../../assets/translations/SearchTranslations.json';

const SearchOptions = ({navigation}) => {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const theme=useTheme();
  return (
    <View style={{justifyContent:"center", alignItems:"center", flex:1, gap:16, backgroundColor:theme['color-basic-800']}}>

<Text style={{
   fontSize:24,fontFamily:"Inter-Black", color:"white"
}}>{translations.title[selectedLanguage]}</Text>
<View style={{ gap:24, flexWrap:"wrap"}}>
<Button onPress={()=>{
  navigation.navigate("SearchedChoice", {
    collection:"users"
  })
}} iconPosition='top' titleStyle={{fontFamily:"Inter-Black"}} buttonStyle={{paddingHorizontal:42, paddingVertical:42, borderRadius:8,  backgroundColor:accColor}} icon={{type:"material-community", name:"account-multiple", color:"white", size:32}}>
{translations.options.users[selectedLanguage]}
</Button>

<Button  onPress={()=>{
  navigation.navigate("SearchedChoice", {
    collection:"books"
  })
}} iconPosition='top' titleStyle={{fontFamily:"Inter-Black"}}  buttonStyle={{paddingHorizontal:42, paddingVertical:42, borderRadius:8, backgroundColor:accColor}} icon={{type:"material-community", name:"book-multiple", color:"white", size:32}}>
{translations.options.books[selectedLanguage]}
</Button>

</View>

    </View>
  )
}

export default SearchOptions