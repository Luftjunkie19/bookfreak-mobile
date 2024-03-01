import React, { useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import LottieView from 'lottie-react-native';
import {
  FlatList,
  Image,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  Divider,
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import {
  AirbnbRating,
  Button,
} from '@rneui/themed';

import {
  accColor,
  modalAccColor,
  primeColor,
} from '../../assets/ColorsImport';
import translations from '../../assets/translations/BookPageTranslations.json';
import ManagementBar from '../ManagmentBars/ManagementBar';

const BookRecensions = ({bookId, hasRecension, recensions, publishRecension, hasReadBook, readPages, bookPages, title}) => {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const [recensionText, setRecensionText]=useState('');
  const [rating, setRating]=useState(0);
  const [shownItems, setShownItems]=useState(1);

  const [selectedFilters, setFilters] = useState([]);
  const [selectedSorting, setSorting] = useState("");
const navigation=useNavigation();
  const filterOptions = [
    {
      label: "⭐ 10.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 10);
      },
    },
    {
      label: "⭐ 9.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 9);
      },
    },
    {
      label: "⭐ 8.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 8);
      },
    },
    {
      label: "⭐ 7.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 7);
      },
    },
    {
      label: "⭐ 6.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 6);
      },
    },
    {
      label: "⭐ 5.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 5);
      },
    },
    {
      label: "⭐ 4.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 4);
      },
    },
    {
      label: "⭐ 3.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 3);
      },
    },
    {
      label: "⭐ 2.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 2);
      },
    },
    {
      label: "⭐ 1.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 1);
      },
    },
  ];

  const sortOptions = [
    {
      label: "Highest Rating",
      sort: (array) => {
        return array.slice().sort((a, b) => b.bookRate - a.bookRate);
      },
    },
    {
      label: "Lowest Rating",
      sort: (array) => {
        return array.slice().sort((a, b) => a.bookRate - b.bookRate);
      },
    },
    {
      label: "Earliest Recensions",
      sort: (array) => {
        return array.slice().sort((a, b) => a.dateOfFinish - b.dateOfFinish);
      },
    },
    {
      label: "Latest Recensions",
      sort: (array) => {
        return array.slice().sort((a, b) => b.dateOfFinish - a.dateOfFinish);
      },
    },
  ];

  const addToFilters = (label) => {
    setFilters((prev) => {
      return [...prev, label];
    });
  }
  
  const removeFromFilters = (label) => {
    setFilters((prev) => {
      return prev.filter((item) => item !== label);
    });
  }

  const selectSorting = (label) => {
    setSorting(label);
  }

  const filteredArray = () => {
    let array = []
    if (selectedFilters.length > 0) {
      selectedFilters.map((filter) => {
        const option = filterOptions.find((filterOption) => filterOption.label === filter);
  
        array.push(...option.filter(recensions));
      });
     return  array;
    } else {
      return recensions;
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

  const bookRating=!isNaN(
    recensions.reduce((prev, cur) => prev + cur.bookRate, 0) /
      recensions.length
  )
    ? (
        recensions.reduce((prev, cur) => prev + cur.bookRate, 0) /
        recensions.length
      ).toFixed(1)
    : 0.0;

    const confirmRecension=()=>{
      publishRecension(recensionText, rating);
    }
  
  return (<>
  <Divider/>
    <View style={{flexDirection:"row", gap:6, alignItems:"center", justifyContent:"space-around", margin:6}}>
    <FontAwesome name="star" size={32} color="gold"/>
      <Text style={{gap:5, fontSize:20, fontFamily:"Inter-Black", letterSpacing:1, color:"white"}}>{translations.recensionsTo[selectedLanguage]} </Text>
      <FontAwesome name="star" color="gold" size={32}/>
    </View>
  
<View style={{margin:4}}>
  <Text style={{fontFamily:"Inter-Black", color:"white"}}>{translations.averadeateText[selectedLanguage]}: <Text style={{color:"gold", fontSize:20, fontFamily:"Inter-Black"}}>{bookRating}</Text></Text>
<AirbnbRating showRating={false} starContainerStyle={{alignSelf:"flex-start", padding:4}} count={10} size={28} defaultRating={bookRating} isDisabled/>
<Divider/>
</View>

{ hasReadBook && !hasRecension && <View style={{margin:6, gap:8}}>
    <Text style={{fontFamily:"Inter-Black", color:"white"}}>{translations.recensionLabel[selectedLanguage]}:</Text>
  <View style={{gap:16}}>
  <AirbnbRating onFinishRating={setRating} ratingContainerStyle={{alignSelf:"flex-start"}} defaultRating={0} count={10} size={28} showRating={false}/>
    <Textarea borderColor={accColor}>
    <TextareaInput onChangeText={setRecensionText} color='white' backgroundColor={modalAccColor}/>
    </Textarea>
  </View>
  <Button onPress={confirmRecension} radius='lg' buttonStyle={{maxWidth:200, backgroundColor:primeColor}} size='md'>{translations.buttonsTexts.rateBook[selectedLanguage]}</Button>
  </View>}
  <ManagementBar selectFilter={addToFilters} removeFilter={removeFromFilters} selectSorting={selectSorting} selectedSorting={selectedSorting} selectedFilters={selectedFilters} filters={filterOptions} sortings={sortOptions}/>


  <View style={{margin:2}}>
    {sortedArray().slice(0, shownItems).length > 0 ? <FlatList scrollEnabled pagingEnabled data={sortedArray().slice(0, shownItems)} renderItem={({item})=>(<View key={item.id} style={{backgroundColor:accColor, borderRadius:5, margin:4}}>
<AirbnbRating isDisabled showRating={false} ratingContainerStyle={{alignSelf:"flex-start", padding:4}} count={10} size={16} defaultRating={item.bookRate}/>
<Text style={{color:"white", padding:4, fontFamily:"Inter-Black", fontSize:12}}>{item.recension}</Text>
<View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:4}}>
<View style={{flexDirection:"row", gap:8, alignItems:"center", padding:6}}>
  <Image source={{uri:item.photoURL}} style={{width:50, height:50, borderRadius:100}}/>
  <Text style={{color:"white",fontFamily:"Inter-Black",fontSize:12 }}>{item.displayName}</Text>
</View>
<Text style={{color:"white", fontFamily:"Inter-Black", fontSize:12}}>{formatDistanceToNow(item.dateOfFinish)} ago</Text>
</View>

    </View>)}/> : <View>
      <Text style={{color:"white", fontFamily:"Inter-Black", padding:6, alignSelf:"center", fontSize:20}}>{translations.noRecensionYet[selectedLanguage]}</Text>
      <LottieView autoPlay source={require('../../assets/lottieAnimations/Animation - 1700233510410.json')} style={{width:200, height:250, alignSelf:"center"}}/>
      </View>}
      {sortedArray().slice(0, shownItems + 5).length > sortedArray().slice(0, shownItems).length && <Button onPress={()=>setShownItems((val)=>{
        return val + 5;
      })} radius='xl' buttonStyle={{backgroundColor:primeColor, margin:8}}>{translations.showMore[selectedLanguage]}</Button>}

{sortedArray().slice(0, shownItems + 5).length === sortedArray().slice(0, shownItems).length && <Button onPress={()=>{
  navigation.setParams({
    recensions:null,
    title: null,
  });
  
  navigation.navigate("BookRecensionsScreen", {
    recensions:recensions,
    title: title,
  });


}} radius='lg' buttonStyle={{backgroundColor:primeColor, margin:8}}>
{translations.showAll[selectedLanguage]}
  </Button>}

  </View>
  
  </>
  )
}

export default BookRecensions