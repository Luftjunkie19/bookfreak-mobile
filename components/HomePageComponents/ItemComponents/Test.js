import React from 'react';

import {
  Dimensions,
  Image,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';

import { accColor } from '../../../assets/ColorsImport';
import formTranslations
  from '../../../assets/translations/FormsTranslations.json';

const TestItem = ({test}) => {
    const navigation=useNavigation();
    const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
  return (
    <TouchableNativeFeedback
    key={test.testId}
    onPress={()=>{
        navigation.navigate('TestStartScreen', {
            id:test.testId,
        })
    }}
  >
    <View style={{backgroundColor:accColor, borderRadius:8, margin:6, width:Dimensions.get('screen').width / 2.5}}>
    {test.refersToBook.photoURL ? (

<Image
  source={{uri:test.refersToBook.photoURL}}
style={{width:"100%", height:130, alignSelf:"center"}}
/>
) : (

<Image
  source={require('../../../assets/Logo.png')}
  style={{width:"100%", height:130, alignSelf:"center"}}
/>

)}
<View style={{paddingVertical:12, paddingHorizontal:20,}}>
      <Text style={{color:"white", fontFamily:"Inter-Black"}} >{test.testName.trim().length >= 10 ? `${test.testName.slice(0,7)}...` : test.testName}</Text>
      {test.refersToBook.title ? (
        <Text style={{color:"white", fontFamily:"Inter-Black"}}>{test.refersToBook.title.trim().length >= 10 ? `${test.refersToBook.title.slice(0,7)}...` : test.refersToBook.title}</Text>
      ) : (
        <>
          <Text style={{color:"white", fontFamily:"Inter-Black"}}>{test.refersToBook}</Text>
        </>
      )}
      <Text style={{color:"white", fontFamily:"Inter-Black"}}>{Object.values(test.queries).length} {formTranslations.queries[selectedLanguage]}</Text>
</View>
    </View>
  </TouchableNativeFeedback>
  )
}

export default TestItem