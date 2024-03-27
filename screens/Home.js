import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import * as StoreReview from 'expo-store-review';
import { styled } from 'nativewind';
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import MaterialCommunityIcons
  from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

import {
  Alert,
  AlertIcon,
  AlertText,
  InfoIcon,
} from '@gluestack-ui/themed';
import { useTheme } from '@ui-kitten/components';

import {
  accColor,
  primeColor,
} from '../assets/ColorsImport';
import homeTranslations from '../assets/translations/homePageTranslations.json';
import BooksSwiper from '../components/HomePageComponents/BooksSwiper';
import ClubSwiper from '../components/HomePageComponents/ClubSwiper';
import CompetitionSwiper
  from '../components/HomePageComponents/CompetitionSwiper';
import { useAuthContext } from '../hooks/useAuthContext';
import useGetDocument from '../hooks/useGetDocument';

const adUnitId= 'ca-app-pub-9822550861323688~6900348989';


const Home = ({navigation}) => {
  const animation = useRef(null);
  const NativeText= styled(Text);
  const [refreshing, setRefresh]=useState(false);
  const ref= useRef(null);
  const { user } = useAuthContext();
  const { document } = useGetDocument('users', user.uid);
const pressedTest=useSharedValue(1);
const pressedTestY =useSharedValue(0);
const pressedBooks=useSharedValue(1);
const pressedBooksY=useSharedValue(0);
const pressedGroups=useSharedValue(1);
const pressedGroupsY=useSharedValue(0);
const pressedComps=useSharedValue(1);
const pressedCompsY=useSharedValue(0);


  const pressedTests=()=>{
pressedTest.value=1.05;
pressedTestY.value=-5;
  }

  const onPressBooks=()=>{
    pressedBooks.value=1.05;
    pressedBooksY.value=-5;
  };

  const pressBooksOut=()=>{
    pressedBooksY.value=0;
    pressedBooks.value=withSequence(withSpring(1.05, {duration:50}), withSpring(0.8, {duration:50}), withSpring(0.95, {duration:50}), withSpring(1, {duration:50}));
  }

  const pressedTestsOut=()=>{
    pressedTest.value=withSequence(withSpring(1.05, {duration:50}), withSpring(0.8, {duration:50}), withSpring(0.95, {duration:50}), withSpring(1, {duration:50}));
    pressedTestY.value=0;
  }

  const pressComps=()=>{
    pressedComps.value=1.05;
    pressedCompsY.value=-5;
  }
  const  pressCompsOut=()=>{
    pressedComps.value=withSequence(withSpring(1.05, {duration:50}), withSpring(0.8, {duration:50}), withSpring(0.95, {duration:50}), withSpring(1, {duration:50}));
    pressedCompsY.value=0;
  }

  const pressClubsIn=()=>{
    pressedGroups.value= withSpring(1.05);
    pressedGroupsY.value= withSpring(-5);
  }

  const pressClubsOut=()=>{
    pressedGroups.value=withSequence(withSpring(1.05, {duration:50}), withSpring(0.8, {duration:50}), withSpring(0.95, {duration:50}), withSpring(1, {duration:50}));
    pressedGroupsY.value=withSpring(0);
  }

const clubsAnimatedStyle=useAnimatedStyle(()=>{
  return {transform:[{translateY:pressedGroupsY.value}, {scale:pressedGroups.value}]};
})

  const pressedTestsStyle=useAnimatedStyle(()=>{
    return { transform:[{scale: withSpring(pressedTest.value)}, {translateY:withSpring(pressedTestY.value)}]};
  });

  const pressedBooksStyle=useAnimatedStyle(()=>{
    return {transform:[{scale:withSpring(pressedBooks.value)},{translateY: withSpring(pressedBooksY.value)}]};
  })

  const pressedCompsStyle=useAnimatedStyle(()=>{
    return {transform:[{scale:withSpring(pressedComps.value)}, {translateY:withSpring(pressedCompsY.value)}]}
  })

const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
const navigateTo=(id)=>{
  navigation.navigate(id);
}
 const [isLoading, setIsLoading] = useState(false);

  const reloadApp = () => {
    setIsLoading(true);

    setIsLoading(false);
    setRefresh(false);
  };
const onRefresh=()=>{
  setRefresh(true);
  reloadApp();
}

  useEffect(() => {
    const handleReview = async () => {
      try { 
      const hasAction = await StoreReview.hasAction();
      const reviewable = await StoreReview.isAvailableAsync();

      if (reviewable && hasAction) {
        await StoreReview.requestReview();
        }
        } catch (e) {
        console.log(e); 
      }
    }
    
    handleReview();
},[])
  



const theme=useTheme();
  return (
    <ScrollView style={{backgroundColor:theme["color-basic-800"]}} refreshControl={<RefreshControl refreshing={refreshing} colors={['#5DA46F']} onRefresh={onRefresh} />}>


{document && !document.stripeAccountData.charges_enabled && <Alert gap={16} margin={8} action="error" variant="accent">
    <AlertIcon as={InfoIcon}/>
        <AlertText fontFamily='OpenSans-Regular' fontSize={14} color="$warning700">
    {homeTranslations.moneyError[selectedLanguage]}
  </AlertText>
      </Alert>}

      {document && !document.nationality && <Alert gap={16} margin={8} action="error" variant="accent">
        <AlertIcon as={InfoIcon}/>
  <AlertText fontFamily='OpenSans-Regular' fontSize={14} color="$warning700">
    {homeTranslations.nationalityError[selectedLanguage]}
  </AlertText>
      </Alert>}



<NativeText className='font-interBlack text-white text-xl m-1'>{homeTranslations.homePage.recentTexts.competitions[selectedLanguage]}</NativeText>
  <CompetitionSwiper />


<NativeText className='font-interBlack text-white text-xl m-1'>{homeTranslations.homePage.recentTexts.clubs[selectedLanguage]}</NativeText>
  <ClubSwiper />


<NativeText className='font-interBlack text-white text-xl m-1'>{homeTranslations.homePage.recentTexts.books[selectedLanguage]}</NativeText>
<BooksSwiper/>

<BannerAd unitId={adUnitId} size={BannerAdSize.FULL_BANNER}/>

<NativeText className='font-interBlack text-white text-xl m-1'>{homeTranslations.homePage.explorationOptions.title[selectedLanguage]}</NativeText>


<View style={{flexDirection: "row", flexWrap: "wrap", gap: 16, margin: 16, alignItems: "center", justifyContent: "space-around"}}>
  <TouchableNativeFeedback onPressOut={pressedTestsOut} onPressIn={pressedTests} onPress={()=>{
    navigateTo('Tests');
  }} background={TouchableNativeFeedback.Ripple(primeColor, false)}>
    <Animated.View style={[{width: 160, backgroundColor: accColor, paddingVertical:32, paddingHorizontal:24, borderRadius: 12, gap: 8, alignItems: "center"}, pressedTestsStyle]}>
      <MaterialCommunityIcons name="page-next" size={32} color="white"/>
      <Text style={{color: "white", fontFamily: "Inter-Black"}}>{homeTranslations.homePage.explorationOptions.option2[selectedLanguage]}</Text>
    </Animated.View>
  </TouchableNativeFeedback>
  <TouchableNativeFeedback onPressIn={pressComps} onPressOut={pressCompsOut} onPress={()=>{
    navigateTo('Comeptitions');
  }} background={TouchableNativeFeedback.Ripple(primeColor, false)}>
    <Animated.View style={[{width: 160, backgroundColor: accColor, paddingVertical:32, paddingHorizontal:24, borderRadius: 12, gap: 8, alignItems: "center"}, pressedCompsStyle]}>
      <MaterialCommunityIcons color='white' name="podium" size={32}/>
      <Text style={{color: "white", fontFamily: "Inter-Black"}}>{homeTranslations.homePage.explorationOptions.option3[selectedLanguage]}</Text>
    </Animated.View>
  </TouchableNativeFeedback>
  <TouchableNativeFeedback onPress={()=>{
    navigateTo('ReaderClubs');
  }} background={TouchableNativeFeedback.Ripple(primeColor, false)} onPressIn={pressClubsIn} onPressOut={pressClubsOut}>
    <Animated.View style={[{width: 160, backgroundColor: accColor,paddingVertical:32, paddingHorizontal:24, borderRadius: 12, gap: 8, alignItems: "center"}, clubsAnimatedStyle]}>
      <MaterialCommunityIcons color='white' name="account-multiple" size={32}/>
      <Text style={{color: "white", fontFamily: "Inter-Black", textAlign:"center"}}>{homeTranslations.homePage.explorationOptions.option4[selectedLanguage]}</Text>
    </Animated.View>
  </TouchableNativeFeedback>
  <TouchableNativeFeedback onPressIn={onPressBooks} onPressOut={pressBooksOut} onPress={()=>{
    navigateTo('Books');
  }} background={TouchableNativeFeedback.Ripple(primeColor, false)}>
    <Animated.View style={[{width: 160, backgroundColor: accColor, paddingVertical:32, paddingHorizontal:24, borderRadius: 12, gap: 8, alignItems: "center"}, pressedBooksStyle]}>
      <MaterialCommunityIcons color='white' name="book-multiple" size={32}/>
      <Text style={{color: "white", fontFamily: "Inter-Black"}}>{homeTranslations.homePage.explorationOptions.option1[selectedLanguage]}</Text>
    </Animated.View>
  </TouchableNativeFeedback>
</View>



  </ScrollView>
  )
}

export default Home