import React, {
  useRef,
  useState,
} from 'react';

import {
  Animated,
  Image,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons
  from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

import IonIcons from '@expo/vector-icons/Ionicons';
import {
  Button,
  ButtonIcon,
  ButtonText,
  SettingsIcon,
} from '@gluestack-ui/themed';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import {
  accColor,
  darkRed,
  primeColor,
} from '../assets/ColorsImport';
import typesTranslations
  from '../assets/translations/homePageTranslations.json';
import translations from '../assets/translations/navbarTranslations.json';
import profileTranslations
  from '../assets/translations/ProfileTranslations.json';
import { useAuthContext } from '../hooks/useAuthContext';
import useGetDocument from '../hooks/useGetDocument';
import { useLogout } from '../hooks/useLogout';

const DrawerComponent = (props) => {
const {logout}=useLogout();
const {user}=useAuthContext();
const [openedMenu, setOpenedMenu]=useState(false);
const animationValue = useRef(new Animated.Value(0)).current;
const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
const navigate=useNavigation();
const {document}=useGetDocument('users',user.uid);

const toggleMenu = () => {
  setOpenedMenu(!openedMenu);

  Animated.timing(animationValue, {
    toValue: openedMenu ? 0 : 1,
    duration: 300,
    useNativeDriver: false, 
  }).start();
};

const animatedStyle = {
  opacity: animationValue,
  height: animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 230], 
  }),
};


  return (
 <DrawerContentScrollView {...props} style={{
  backgroundColor:"rgb(66,103,181)",
 }}>
<Text style={{
  fontSize:28,
  lineHeight:54,
  fontWeight:"700",
  color:"white",
  padding:2,
  letterSpacing:1
}}><Text style={{color:"rgb(26, 35, 57)"}}>B</Text>ook<Text style={{color:"rgb(26, 35, 57)"}}>F</Text>reak</Text>

<View style={{justifyContent:"center", alignItems:"center", padding:8, width:"100%"}}>
  <View style={{width:"100%", gap:10, paddingVertical:16, alignItems:"center"}}>
<View style={{ width:100,
    height:100,}}>
 {document && 
 <Image source={{uri: document.photoURL}} style={{
    width:"100%",
    height:"100%",
    borderRadius:50,
    padding:4,
  }} />
 }
</View>
<Text style={{
  color:"white",
  fontSize:14,
  fontWeight:"600",
  fontStyle:"italic"
}}>{user.displayName}</Text>
  </View>

<View style={{width:"100%", flexDirection:"row", gap:8, justifyContent:"space-evenly"}}>
  <Button bg={primeColor} android_ripple={{
    color:accColor
  }} onPress={()=>navigate.navigate("ProfileEdit")} >
    <ButtonText fontSize={10}>{profileTranslations.managmentButtons.editButton[selectedLanguage]}</ButtonText>
    <ButtonIcon ml="$2"  as={SettingsIcon} size='md'/>
  </Button>
  <Button variant="solid"
  action="negative" gap={6} android_ripple={{
    color:darkRed
  }} onPress={logout}>
    <ButtonText fontSize={10}>{translations.hamburdeMenu.logOut[selectedLanguage]}</ButtonText>
    <MaterialCommunityIcons name='exit-to-app' size={14} color='white'/>
  </Button>
</View>
</View>

<DrawerItem label={translations.hamburdeMenu.home[selectedLanguage]} icon={()=>(
  <IonIcons name="home" color="white" size={24}/>
  )} labelStyle={{fontFamily:"Inter-Black", fontSize:18}} inactiveTintColor='white' onPress={()=>{
  navigate.navigate("HomeScreen");
}}/>

  <DrawerItem icon={(color, size, focused)=>(
    <IonIcons name='add-circle' color="white" size={24}/>
  )} label={translations.hamburdeMenu.addForms[selectedLanguage]} inactiveTintColor='white' labelStyle={{
    fontSize:18,
    fontFamily:"Inter-Black"
  }} onPress={toggleMenu} />


<Animated.View style={[animatedStyle, { borderColor: "rgb(26, 35, 57)", borderBottomWidth: 2, borderRightWidth: 1, borderTopWidth: 2 }]}>
    <DrawerItem style={{
  borderColor:"rgb(26, 35, 57)",
  borderBottomWidth:1
}}  icon={(color, size, focused)=>(
    <MaterialCommunityIcons color="white" name='sword-cross' size={12}/>
  )} label={typesTranslations.homePage.explorationOptions.option3[selectedLanguage]} inactiveTintColor='white' labelStyle={{
    fontSize:12,
    fontFamily:"Inter-Black"
  }} onPress={()=>navigate.navigate('CompetitionCreate')}/>
<DrawerItem style={{
  borderColor:"rgb(26, 35, 57)",
  borderBottomWidth:1
}} labelStyle={{
    fontSize:12,
    fontFamily:"Inter-Black"
  }}  icon={(color, size, focused)=>(
    <IonIcons color="white" name='people' size={12} />
  )} label={typesTranslations.homePage.explorationOptions.option4[selectedLanguage]} inactiveTintColor='white' onPress={()=>navigate.navigate('ClubCreate')}/>
<DrawerItem  onPress={()=>navigate.navigate('TestCreate')} labelStyle={{
    fontSize:12,
    fontFamily:"Inter-Black"
  }} style={{
    borderColor:"rgb(26, 35, 57)",
    borderBottomWidth:1
  }}  icon={(color, size, focused)=>(
    <MaterialCommunityIcons color="white" name='file' size={12}/>
  )} label={typesTranslations.homePage.explorationOptions.option2[selectedLanguage]} inactiveTintColor='white'/>
  <DrawerItem labelStyle={{
    fontSize:12,
    fontFamily:"Inter-Black"
  }}  icon={(color, size, focused)=>(
    <MaterialCommunityIcons color="white" name='book' size={12}/>
  )} label={typesTranslations.homePage.explorationOptions.option1[selectedLanguage]} inactiveTintColor='white'  onPress={()=>navigate.navigate('BookCreate')}/>

</Animated.View>

<DrawerItem onPress={()=>{
  navigate.navigate('YourStatsScreen');
}} labelStyle={{
   fontSize:18,fontFamily:"Inter-Black",
  color:"white",
}} label={profileTranslations.featuresButtons.statsBtn[selectedLanguage]} icon={()=>(<IonIcons name="stats-chart" color="white" size={24}  />)}/>

<DrawerItem labelStyle={{
   fontSize:18,fontFamily:"Inter-Black",
  color:"white",
}} icon={()=>(<IonIcons name="search" color="white" size={24}  />)} label={translations.hamburdeMenu.search[selectedLanguage]} onPress={()=>navigate.navigate('SearchOptions')}/>


 </DrawerContentScrollView>
  )
}

export default DrawerComponent