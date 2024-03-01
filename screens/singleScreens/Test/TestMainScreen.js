import React, { useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { randomUUID } from 'expo-crypto';
import LottieView from 'lottie-react-native';
import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import {
  Button,
  ButtonGroup,
} from '@rneui/themed';
import { useTheme } from '@ui-kitten/components';

import {
  accColor,
  primeColor,
} from '../../../assets/ColorsImport';
import translations
  from '../../../assets/translations/BookPageTranslations.json';
import formTranslations
  from '../../../assets/translations/FormsTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import TestTable from './TestTable/TestTable';

const TestMainScreen = ({route, navigation}) => {
  const {id}=route.params;
  const {user}=useAuthContext();
  const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
  const {document}=useGetDocument('tests', id);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {removeFromDataBase}=useRealDatabase();
const removeTheTest=()=>{
  removeFromDataBase('tests', id);
  navigation.navigate('Tests');
};
  const moveToTest = () => {
    const attemptId = `Attempt${randomUUID()}`;
    navigation.navigate('TestPlayScreen', {
      testId: document.testId,
      startTime:new Date().getTime(),
      attemptId: attemptId,
    })
   
  };
  const theme=useTheme();
  return (
    <ScrollView style={{backgroundColor:theme['color-basic-800'], gap:4}} >
      {document &&  <>
        {document.refersToBook.photoURL ? <Image style={{width:250, height:250, alignSelf:"center", borderRadius:8, marginTop:6}} source={{uri:document.refersToBook.photoURL}}/> : <Image source={require('../../../assets/Logo.png')} style={{width:250, height:250, alignSelf:"center", borderRadius:6}}/>}
      {document.createdBy.id === user.uid && <View style={{flexDirection:"row", gap:32, alignSelf:"center", padding:8}}>
        <Button onPress={()=>{
          navigation.navigate('TestEdit', {
            id: id,
          });
        }} icon={{type:"material-community", name:"pencil", color:"white"}}>{translations.buttonsTexts.edit[selectedLanguage]}</Button>
        <Button onPress={removeTheTest} buttonStyle={{backgroundColor:"red"}} titleStyle={{color:'white'}} icon={{type:"material-community", name:"delete", color:"white"}}>{translations.buttonsTexts.delete[selectedLanguage]}</Button>
        </View>}
        {document.refersToBook.title ? <Text style={{fontFamily:"Inter-Black",color:"white", fontSize:24, marginLeft:4}}>{document.refersToBook.title}</Text> : <Text style={{fontFamily:"Inter-Black",fontSize:24, color:"white",marginLeft:4  }}>{document.refersToBook}</Text>}
       <Text style={{fontFamily:"Inter-Black",color:"white" }}> {Object.values(document.queries).length}{" "}
                {formTranslations.queries[selectedLanguage]}</Text>
      <Text style={{fontFamily:"Inter-Black", color:"white"}}>Created: {formatDistanceToNow(document.createdAt)} ago</Text>
          <Button onPress={moveToTest} icon={{type:"material-community", name:"gamepad-variant", color:"white"}} radius="lg" buttonStyle={{backgroundColor:primeColor, minWidth:250, maxWidth:280, borderWidth:2, borderColor:'white', marginTop:16}} containerStyle={{alignSelf:"center"}}>{formTranslations.playBtn[selectedLanguage]}</Button>
        {document.attempts && Object.values(document.attempts).length > 0 ? <View style={{marginTop:24}}>
        <Text style={{fontSize:28, textAlign:"center", fontFamily:"Inter-Black", color:"white"}}>{selectedIndex === 0 ? `${translations.attempts[selectedLanguage]}` : `${translations.yourAttempts[selectedLanguage]}`}</Text>
          <ButtonGroup selectedIndex={selectedIndex} onPress={(value) => {
        setSelectedIndex(value);
      }} selectedButtonStyle={{backgroundColor:primeColor}} buttonStyle={{backgroundColor:accColor}}  textStyle={{color:"white", fontFamily:"Inter-Black"}} buttons={[`${translations.attempts[selectedLanguage]}`, `${translations.yourAttempts[selectedLanguage]}`]}/>
        <TestTable dataItems={selectedIndex===0 ? Object.values(document.attempts) : Object.values(document.attempts).filter((item)=>item.player.uid === user.uid)}/>
        </View> : <View>
          <Text style={{color:"red", alignSelf:"center", fontFamily:"Inter-Black", fontSize:18}}>Perhabs somebody is solving now</Text>
          <LottieView autoPlay style={{width:300, height:350, alignSelf:"center"}} source={require('../../../assets/lottieAnimations/Animation - 1700236886731.json')}/>
          </View>}
        </>}


    </ScrollView>
  )
}

export default TestMainScreen