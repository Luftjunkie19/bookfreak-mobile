import React from 'react';

import LottieView from 'lottie-react-native';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { useSelector } from 'react-redux';

import IonIcons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@ui-kitten/components';

import statsTranslations
  from '../../assets/translations/StatsTranslations.json';
import LineChart from '../../components/ProfileComponents/charts/LineChart';
import PieChart from '../../components/ProfileComponents/charts/PieChart';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocuments from '../../hooks/useGetDocuments';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-9822550861323688~6900348989';

const YourStatistics = () => {
const {user}=useAuthContext();
const {documents}=useGetDocuments('books');
const {documents: readers}=useGetDocuments("bookReaders");

const readerObjects=readers.map((bookReader) => {
  return bookReader.readers;
}).map((obj) => {
  const nestedObject = Object.values(obj);
  return nestedObject;
}).flat();
const theme=useTheme();
const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
  const readersFiltered = readerObjects.filter((reader) => reader.id === user.uid);
  return (
    <ScrollView contentContainerStyle={{gap:6, marginTop:16}} style={{backgroundColor:theme['color-basic-800']}}>
     <Text style={{color:"white", alignSelf:"center", fontFamily:"Inter-Black", fontSize:26}}><IonIcons name='bar-chart' size={32}/> {statsTranslations.yourStats[selectedLanguage]} <IonIcons name='bar-chart' size={32}/></Text>
     
{readersFiltered.length === 0 && <View>
  <LottieView source={require('../../assets/lottieAnimations/Animation - 1699294838586.json')} autoPlay loop style={{width:250, height:400, alignSelf:'center'}}/>
  <Text style={{color:"white", alignSelf:"center", fontFamily:"OpenSans-Bold", fontSize:20}}>{statsTranslations.noProgressToshow[selectedLanguage]}</Text>
  </View>}

      {readersFiltered.length > 0 && <>
      <Text style={{color:"white", alignSelf:"center", fontFamily:"Inter-Black"}}>{statsTranslations.categoriesText[selectedLanguage]}</Text>
     <View style={{alignSelf:"center"}}>
      <PieChart data={readersFiltered}/>
     </View>
      </>}

      <BannerAd unitId={adUnitId} size={BannerAdSize.FULL_BANNER}/>

      {documents.length > 0 && readersFiltered.length > 0 && <>
      <Text style={{color:"white", alignSelf:"center", fontFamily:"Inter-Black"}}>{statsTranslations.progressBookAmount[selectedLanguage]}</Text>
        <LineChart data={readersFiltered} secondData={documents}/>
      </>
      }
    </ScrollView>
  )
}

export default YourStatistics