import React, { useLayoutEffect } from 'react';

import { formatDistanceToNow } from 'date-fns';
import LottieView from 'lottie-react-native';
import {
  FlatList,
  Image,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { AirbnbRating } from '@rneui/themed';
import { useTheme } from '@ui-kitten/components';

import { accColor } from '../../../assets/ColorsImport';
import translations
  from '../../../assets/translations/BookPageTranslations.json';

const RecensionsScreen = ({route, navigation}) => {
    const selectedLanguage = useSelector(
        (state) => state.languageSelection.selectedLangugage
      );
    const {recensions, title}=route.params;

    useLayoutEffect(()=>{
        navigation.setOptions({
headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Bold", fontSize:20, color:"white"}}>{title}</Text>)
        })
    },[]);

    const theme=useTheme();

  return (
    <View style={{flex:1, backgroundColor:theme['color-basic-800'], gap:12}}>
      <Text style={{color:"white", fontFamily:"OpenSans-Bold", textAlign:"center", fontSize:20}}>{translations.recensionsText[selectedLanguage]} {title}</Text>
    {recensions.length > 0 &&  
      <FlatList data={recensions} scrollEnabled renderItem={({item})=>(<View key={item.id} style={{backgroundColor:accColor, borderRadius:5, margin:4}}>
<AirbnbRating isDisabled showRating={false} ratingContainerStyle={{alignSelf:"flex-start", padding:4}} count={10} size={16} defaultRating={item.bookRate}/>
<Text style={{color:"white", padding:4, fontFamily:"Inter-Black", fontSize:12}}>{item.recension}</Text>
<View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:4}}>
<View style={{flexDirection:"row", gap:8, alignItems:"center", padding:6}}>
  <Image source={{uri:item.photoURL}} style={{width:50, height:50, borderRadius:100}}/>
  <Text style={{color:"white",fontFamily:"Inter-Black",fontSize:12 }}>{item.displayName}</Text>
</View>
<Text style={{color:"white", fontFamily:"Inter-Black", fontSize:12}}>{formatDistanceToNow(item.dateOfFinish)} ago</Text>
</View>

    </View>)}/>
    }

    {recensions.length === 0 && <View>
      <LottieView autoPlay source={require('../../../assets/lottieAnimations/Animation - 1700233510410.json')} style={{width:200, height:250, alignSelf:"center"}}/>
      <Text style={{color:"white", fontFamily:"Inter-Black", padding:6, alignSelf:"center", fontSize:20}}>{translations.noRecensionYet[selectedLanguage]}</Text>
      </View>}
    </View>
  )
}

export default RecensionsScreen