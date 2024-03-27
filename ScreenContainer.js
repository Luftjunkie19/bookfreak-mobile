import {
  useEffect,
  useState,
} from 'react';

import * as Network from 'expo-network';
import { initializeApp } from 'firebase/app';
import { Text } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import MaterialCommunityIcons
  from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';

import NetInfo from '@react-native-community/netinfo';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  createMaterialBottomTabNavigator,
} from '@react-navigation/material-bottom-tabs';
import {
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from '@rneui/base';
import {
  Icon,
  withBadge,
} from '@rneui/themed';

import {
  accColor,
  primeColor,
} from './assets/ColorsImport';
import LanguageSelect from './components/Buttons/LanguageSelect';
import DrawerComponent from './components/DrawerComponent';
import SnackbarAlert from './components/Snackbars/Snackbar';
import { languageActions } from './context/LanguageContext';
import { firebaseConfig } from './firebaseConfig';
import { useAuthContext } from './hooks/useAuthContext';
import useGetDocuments from './hooks/useGetDocuments';
import { useSnackbarContext } from './hooks/useSnackbarContext';
import CommunityChat from './screens/CommunityScreens/CommunityChat';
import CompetitionActionsScreen
  from './screens/CommunityScreens/Competition/CompetitionActionsScreen';
import GeneralInfo from './screens/CommunityScreens/Competition/GeneralInfo';
import OverallClub from './screens/CommunityScreens/ReaderClub/OverallClub';
import ReaderClubActions
  from './screens/CommunityScreens/ReaderClub/ReaderClubActions';
import StatisticsScreen
  from './screens/CommunityScreens/StatisticsScreens/StatisticsScreen';
import LoginScreen from './screens/FormScreens/AuthorizationScreen/LoginScreen';
import LoginWithPhoneScreen
  from './screens/FormScreens/AuthorizationScreen/LoginWithPhoneScreen';
import SignUpScreen
  from './screens/FormScreens/AuthorizationScreen/SignUpScreen';
import SignUpWithPhoneScreen
  from './screens/FormScreens/AuthorizationScreen/SignUpWithPhoneScreen';
import CreateBook from './screens/FormScreens/CreateForms/CreateBook';
import CreateClub from './screens/FormScreens/CreateForms/CreateClub';
import CreateCompetition
  from './screens/FormScreens/CreateForms/CreateCompetition';
import CreateLink from './screens/FormScreens/CreateForms/CreateLink';
import CreateTest from './screens/FormScreens/CreateForms/CreateTest';
import EditBook from './screens/FormScreens/EditForms/EditBook';
import EditClub from './screens/FormScreens/EditForms/EditClub';
import EditCompetition from './screens/FormScreens/EditForms/EditCompetition';
import EditProfile from './screens/FormScreens/EditForms/EditProfile';
import EditTest from './screens/FormScreens/EditForms/EditTest';
import Home from './screens/Home';
import SearchedChoice from './screens/searchScreens/SearchedChoice';
import SearchOptions from './screens/searchScreens/SearchOptions';
import Book from './screens/singleScreens/Book';
import ReaderEditScreen
  from './screens/singleScreens/BookScreens/ReaderEditScreen';
import ReaderStateScreen
  from './screens/singleScreens/BookScreens/ReaderStateScreen';
import RecensionsScreen
  from './screens/singleScreens/BookScreens/RecensionsScreen';
import AllYourChats from './screens/singleScreens/ChatScreens/AllYourChats';
import UsersChat from './screens/singleScreens/ChatScreens/UsersChat';
import Books from './screens/singleScreens/CollectionsScreens/Books';
import Competitions
  from './screens/singleScreens/CollectionsScreens/Competitions';
import ReaderClubs
  from './screens/singleScreens/CollectionsScreens/ReaderClubs';
import Tests from './screens/singleScreens/CollectionsScreens/Tests';
import Contact from './screens/singleScreens/Contact';
import NotificationsScreen from './screens/singleScreens/NotificationsScreen';
import Profile from './screens/singleScreens/Profile';
import TopUpAccountScreen
  from './screens/singleScreens/ProfileScreens/TopUpAccountScreen';
import FlightModeScreen
  from './screens/singleScreens/SpecialScreens/FlightModeScreen';
import NoInternetScreen
  from './screens/singleScreens/SpecialScreens/NoInternetScreen';
import TestMainScreen from './screens/singleScreens/Test/TestMainScreen';
import TestPlayScreen from './screens/singleScreens/Test/TestPlayScreen';
import UsersProfile from './screens/singleScreens/UsersProfile';
import YourStatistics from './screens/singleScreens/YourStatistics';
import WelcomeScreen from './screens/WelcomingScreen/WelcomeScreen';

mobileAds()
  .initialize()
  .then(adapterStatuses => {
    // Initialization complete!
  });
const BottomNavigation = () => {
    const BottomTab = createMaterialBottomTabNavigator();
const {user}=useAuthContext();
const {documents}=useGetDocuments('notifications');
const condition=documents && documents.filter((item)=>item.directedTo === user.uid).length
  const BadgedIcon=withBadge(documents.filter((item)=>item.directedTo === user.uid && !item.isRead).length)(Icon)
    return (
      <BottomTab.Navigator  activeColor='white' barStyle={{
        backgroundColor:primeColor,
      }} activeIndicatorStyle={{
        backgroundColor:"transparent",
      }} 
      screenOptions={{
        tabBarColor:primeColor,

      }}
      shifting={true}>
  <BottomTab.Screen name='homeScreen'  options={{
          tabBarLabel:"Home",
          
          tabBarIcon:({color, focused})=>(
            <MaterialCommunityIcons name='home' color={"white"} size={32} />
    )}}  component={Home} />
  

        <BottomTab.Screen name='yourProfile' component={Profile}   options={{
          tabBarLabel:"Your Profile",
          tabBarIcon:({color, focused})=>(
            <MaterialCommunityIcons name='account' color={"white"} size={24} />
    )}}/>

<BottomTab.Screen name='Notifications' component={NotificationsScreen}   options={{
          tabBarLabel:"Notifications",
          tabBarIcon:({color, focused})=>(
            <>
            {condition > 0 ? <BadgedIcon color={focused ? "gold" : 'white'} type="material-community" name="bell"/> : <MaterialCommunityIcons name='bell' color={focused ? "gold" : 'white'} size={24} />}
            </>
    )}}/>

        <BottomTab.Screen name='chats' component={AllYourChats}   options={{
          tabBarLabel:'Messages',
          tabBarIcon: ({color, focused}) => (
            <MaterialCommunityIcons name='chat' color={"white"} size={24} />
          )
          
        }} />
      </BottomTab.Navigator>
    );
  };


  const TopCompetitionNavigation=({route})=>{
    const TopNavigation=createMaterialTopTabNavigator();
  const {user}=useAuthContext();
const {documents}=useGetDocuments(`communityMembers/${route.params.params.id}/users`);
const isMember= documents.find((member)=>member.value.id === user.uid)
    return(
      <TopNavigation.Navigator
      screenOptions={{
        tabBarInactiveTintColor:"gray",
        tabBarContentContainerStyle:{
          backgroundColor:accColor
        },
        tabBarBounces:true,
        tabBarActiveTintColor:"white",
        tabBarAndroidRipple:{
          borderless:false,
        },
      }}>
        {isMember ? 
        <>
        <TopNavigation.Screen initialParams={route.params}  options={{tabBarLabel:"Chat", tabBarIcon:({focused, color})=>(<MaterialCommunityIcons color="white" size={20} name='chat'/>), animationEnabled:true}} name='CommunityChat' component={CommunityChat}/>
        <TopNavigation.Screen initialParams={route.params} options={{tabBarLabel:"Overall",  tabBarIcon:({focused, color})=>(<MaterialCommunityIcons color="white" size={20} name='information'/>),animationEnabled:true}} name='CommunityOverall' component={GeneralInfo}/>
        <TopNavigation.Screen initialParams={route.params} options={{tabBarLabel:"Stats", tabBarIcon:({focused, color})=>(<MaterialCommunityIcons color="white" size={20} name='poll'/>),animationEnabled:true}} name='Statistics' component={StatisticsScreen}/>
        <TopNavigation.Screen initialParams={route.params} options={{tabBarLabel:"Actions",  tabBarIcon:({focused, color})=>(<MaterialCommunityIcons color="white" size={20} name='dots-horizontal'/>),animationEnabled:true}} name='CommunityActions' component={CompetitionActionsScreen}/>
        </>: <>
        <TopNavigation.Screen initialParams={route.params} options={{tabBarLabel:"Overall",  tabBarIcon:({focused, color})=>(<MaterialCommunityIcons color="white" size={20} name='information'/>),animationEnabled:true}} name='CommunityOverall' component={GeneralInfo}/>
        <TopNavigation.Screen initialParams={route.params} options={{tabBarLabel:"Stats", tabBarIcon:({focused, color})=>(<MaterialCommunityIcons color="white" size={20} name='poll'/>),animationEnabled:true}} name='Statistics' component={StatisticsScreen}/>
        </>
      }
      </TopNavigation.Navigator>
    )
  }

  const TopReadersClubNavigation=({route})=>{
    const TopNavigation=createMaterialTopTabNavigator();
    const {user}=useAuthContext();
    const {documents}=useGetDocuments(`communityMembers/${route.params.params.id}/users`);
    const isMember= documents.find((member)=>member.value.id === user.uid);
    return(  <TopNavigation.Navigator
      screenOptions={{
        tabBarInactiveTintColor:"gray",
        tabBarContentContainerStyle:{
          backgroundColor:accColor
        },
        tabBarBounces:true,
        tabBarActiveTintColor:"white",
        tabBarAndroidRipple:{
          borderless:false,
        },
      }}>{
        isMember ? <>
         <TopNavigation.Screen options={{tabBarLabel:"Chat", tabBarIcon:({focused, color})=>(<MaterialCommunityIcons name='chat' color={focused ? 'white' : "gray"} size={24}/>)}} initialParams={route.params} name='ReadersChat' component={CommunityChat}/>
      <TopNavigation.Screen initialParams={route.params} name='OverallClub' options={{tabBarLabel:"Info", tabBarIcon:({focused, color})=>(<MaterialCommunityIcons name='information' size={24} color={focused ? 'white' : "gray"}/>)}} component={OverallClub}/>
        <TopNavigation.Screen initialParams={route.params} options={{tabBarLabel:"Stats", tabBarIcon:({focused, color})=>(<MaterialCommunityIcons color={focused ? 'white' : "gray"} size={20} name='poll'/>),animationEnabled:true}} name='Statistics' component={StatisticsScreen}/>
     <TopNavigation.Screen initialParams={route.params} options={{tabBarLabel:"Actions",  tabBarIcon:({focused, color})=>(<MaterialCommunityIcons color="white" size={20} name='dots-horizontal'/>),animationEnabled:true}} name='CommunityActions' component={ReaderClubActions}/>
     </> : <>
      <TopNavigation.Screen initialParams={route.params} name='OverallClub' options={{tabBarLabel:"Info", tabBarIcon:({focused, color})=>(<MaterialCommunityIcons name='information' size={24} color={focused ? 'white' : "gray"}/>)}} component={OverallClub}/>
        <TopNavigation.Screen initialParams={route.params} options={{tabBarLabel:"Stats", tabBarIcon:({focused, color})=>(<MaterialCommunityIcons color={focused ? 'white' : "gray"} size={20} name='poll'/>),animationEnabled:true}} name='Statistics' component={StatisticsScreen}/>
     </>
      }
       
      </TopNavigation.Navigator>)
  }

  
  const DrawerNavigation = ({navigation}) => {
    const DrawerNav = createDrawerNavigator();
  const dispatch=useDispatch();
  const [open, setOpen]=useState(false);

  const openBottom=()=>{
    setOpen(true);
  }

  const closeBottom=()=>{
    setOpen(false);
  }

  const selectLanguage=(val)=>{
    dispatch(languageActions.selectLanguage(val));
    closeBottom();
  }

    return (
      <DrawerNav.Navigator screenOptions={{
        headerStyle:{
          backgroundColor:accColor,
        },
        headerTintColor: "white",
        headerRight:({color})=>(<LanguageSelect selectLangugage={selectLanguage} showLanguage={open} handleClose={closeBottom} handleOpen={openBottom}/>)
      }} initialRouteName='HomeScreen' drawerContent={(props)=><DrawerComponent {...props}/>}>
        <DrawerNav.Screen name="HomeScreen" options={{headerTitle:"BookFreak", headerTitleStyle:{
          color:"white",
          fontFamily: "Inter-Bold",
          fontSize:24,
        }, headerLeft:()=>{}}} component={BottomNavigation}/>
        <DrawerNav.Screen name="ContactScreen" component={Contact} />
        <DrawerNav.Screen options={{
          headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Regular", fontSize:24, color:"white"}}>
           <Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>B</Text> 
          ook<Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>
          F
            </Text>reak</Text>),
          headerLeft:()=>{}
        }} name="SearchedChoice" component={SearchedChoice}/>
        <DrawerNav.Screen options={{
          headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Regular", fontSize:24, color:"white"}}>
           <Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>B</Text> 
          ook<Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>
          F
            </Text>reak</Text>),
          headerLeft:()=>{}
        }} name="SearchOptions" component={SearchOptions} />
        <DrawerNav.Screen options={{
          headerTitleStyle:{
            opacity:0
          },
          headerLeft:()=>(<Button titleStyle={{color:'white'}} type='clear' icon={{type:"material-community", name:"arrow-left", color:"white"}} onPress={()=>{
            navigation.navigate('HomeScreen', {
              screen:"homeScreen"
            });
          }}>Back</Button>)
        }} name='ProfileScreen' component={UsersProfile}/>
        <DrawerNav.Group>
        <DrawerNav.Screen options={{
          headerTitleStyle:{
            opacity:0
          },
          headerLeft:()=>(<Button titleStyle={{color:'white'}} type='clear' icon={{type:"material-community", name:"arrow-left", color:"white"}} onPress={()=>{
            navigation.navigate('HomeScreen', {
              screen:"homeScreen"
            });
          }}>Back</Button>)
        }} name='BookScreen' component={Book}/>
        <DrawerNav.Screen name='BookRecensionsScreen' component={RecensionsScreen} />
        <DrawerNav.Screen options={{ headerShown:false}} name='CompetitionScreen' component={TopCompetitionNavigation}/>
        <DrawerNav.Screen options={{ headerShown:false}} name='ReadersClub' component={TopReadersClubNavigation}/>
        <DrawerNav.Screen options={{
         headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Regular", fontSize:24, color:"white"}}>
           <Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>B</Text> 
          ook<Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>
          F
            </Text>reak</Text>),
          headerLeft:()=>(<Button titleStyle={{color:'white'}} type='clear' icon={{type:"material-community", name:"arrow-left", color:"white"}} onPress={()=>{
            navigation.navigate('HomeScreen', {
              screen:"homeScreen"
            });
          }}>Back</Button>)
        }}   name='TestStartScreen' component={TestMainScreen}/>
        <DrawerNav.Screen options={{ headerShown:false}} name='TestPlayScreen' component={TestPlayScreen}/>
        </DrawerNav.Group>

<DrawerNav.Screen options={{
  headerTitleStyle:{
    opacity:0
  },
   headerLeft:()=>(<Button onPress={()=>{
    navigation.navigate('HomeScreen', {
      screen:"homeScreen"
    });
   }} type='clear' buttonStyle={{marginLeft:6}} titleStyle={{color:"white", fontFamily:"OpenSans-Regular"}} icon={{name:"arrow-left", type:"material-community", color:"white"}}>Back</Button>)
        }} name="YourStatsScreen" component={YourStatistics}/>
<DrawerNav.Screen options={{
  headerTitle:"",
     headerLeft:()=>(<Button onPress={()=>{
       navigation.navigate('HomeScreen');
     }} type='clear' buttonStyle={{marginLeft:6}} titleStyle={{color:"white", fontFamily:"OpenSans-Regular"}} icon={{name:"arrow-left", type:"material-community", color:"white"}}>Back</Button>)
}} name='TopUpScreen' component={TopUpAccountScreen}/>

<DrawerNav.Group>
  <DrawerNav.Screen name='Comeptitions' component={Competitions} options={{
            headerTitle: () => (<Text style={{ color: "white", fontSize: 20, fontFamily: "OpenSans-Bold" }}>BookFreak</Text>),
          headerLeft:()=>(<Button onPress={()=>{
            navigation.navigate("HomeScreen")
          }} icon={{name:"arrow-left", type:"material-community", color:"white", size:20}} type="clear"></Button>)}}/>
  <DrawerNav.Screen name='ReaderClubs' component={ReaderClubs} options={{
            headerTitle: () => (<Text style={{ color: "white", fontSize: 20, fontFamily: "OpenSans-Bold" }}>BookFreak</Text>),
          headerLeft:()=>(<Button onPress={()=>{
            navigation.navigate("HomeScreen")
          }} icon={{name:"arrow-left", type:"material-community", color:"white", size:20}} type="clear"></Button>)}}/>
  <DrawerNav.Screen name='Tests' component={Tests} options={{
            headerTitle: () => (<Text style={{ color: "white", fontSize: 20, fontFamily: "OpenSans-Bold" }}>BookFreak</Text>),
          headerLeft:()=>(<Button onPress={()=>{
            navigation.navigate("HomeScreen")
          }} icon={{name:"arrow-left", type:"material-community", color:"white", size:20}} type="clear"></Button>)}}/>
          <DrawerNav.Screen name='Books' component={Books} options={{
            headerTitle: () => (<Text style={{ color: "white", fontSize: 20, fontFamily: "OpenSans-Bold" }}>BookFreak</Text>),
          headerLeft:()=>(<Button onPress={()=>{
            navigation.navigate("HomeScreen")
          }} icon={{name:"arrow-left", type:"material-community", color:"white", size:20}} type="clear"></Button>)}} />
</DrawerNav.Group>

        <DrawerNav.Screen options={{ headerShown:false}} name="UsersChatScreen" component={UsersChat}/>
  
        <DrawerNav.Group>
          <DrawerNav.Screen options={{
          headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Regular", fontSize:20, color:"gold"}}>
           <Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>B</Text> 
          ook<Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>
          F
          </Text>reak</Text>)
        }} name='BookCreate' component={CreateBook}/>
          <DrawerNav.Screen options={{
          headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Regular", fontSize:20, color:"gold"}}>
           <Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>B</Text> 
          ook<Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>
          F
          </Text>reak</Text>)
        }} name='ClubCreate' component={CreateClub}/>
          <DrawerNav.Screen options={{
          headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Regular", fontSize:20, color:"gold"}}>
           <Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>B</Text> 
          ook<Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>
          F
          </Text>reak</Text>)
        }} name='CompetitionCreate' component={CreateCompetition}/>
          <DrawerNav.Screen options={{
          headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Regular", fontSize:20, color:"gold"}}>
           <Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>B</Text> 
          ook<Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>
          F
          </Text>reak</Text>)
        }} name='TestCreate' component={CreateTest}/>
          <DrawerNav.Screen options={{
          headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Regular", fontSize:20, color:"gold"}}>
           <Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>B</Text> 
          ook<Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>
          F
          </Text>reak</Text>)
        }} name='LinkCreate' component={CreateLink}/>
        </DrawerNav.Group>
  
        <DrawerNav.Group>
          <DrawerNav.Screen options={{
          headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Regular", fontSize:20, color:"gold"}}>
           <Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>B</Text> 
          ook<Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>
          F
          </Text>reak</Text>)
        }} name='BookEdit' component={EditBook}/>
          <DrawerNav.Screen options={{
          headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Regular", fontSize:20, color:"gold"}}>
           <Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>B</Text> 
          ook<Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>
          F
          </Text>reak</Text>)
        }} name='ClubEdit' component={EditClub}/>
          <DrawerNav.Screen options={{
          headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Regular", fontSize:20, color:"gold"}}>
           <Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>B</Text> 
          ook<Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>
          F
          </Text>reak</Text>)
        }} name='CompetitionEdit' component={EditCompetition}/>
          <DrawerNav.Screen options={{
          headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Regular", fontSize:20, color:"gold"}}>
           <Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>B</Text> 
          ook<Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>
          F
          </Text>reak</Text>)
        }} name='TestEdit' component={EditTest}/>
          <DrawerNav.Screen options={{
          headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Regular", fontSize:20, color:"gold"}}>
           <Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>B</Text> 
          ook<Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>
          F
          </Text>reak</Text>)
        }} name='ProfileEdit' component={EditProfile}/>
        </DrawerNav.Group>
  
        <DrawerNav.Screen options={{
          headerLeft:()=>(<Button type='clear' onPress={() => {
            navigation.navigate("HomeScreen");
          }} icon={{name:"arrow-left", type:"material-community", color:"white"}}></Button>), headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Regular", fontSize:24, color:"white"}}>
          <Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>B</Text> 
         ook<Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>
         F
           </Text>reak</Text>),
        }} name='BookReaderForm' component={ReaderStateScreen}/>
        <DrawerNav.Screen options={{ headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Regular", fontSize:24, color:"white"}}>
          <Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>B</Text> 
         ook<Text style={{color:primeColor, fontSize:24, fontFamily:"OpenSans-Bold"}}>
         F
           </Text>reak</Text>),
          headerLeft: () => (<Button onPress={() => {
            navigation.navigate("HomeScreen");
          }} type='clear' icon={{name:"arrow-left", type:"material-community", color:"white"}}></Button>)
        }}  name='BookReaderEdit' component={ReaderEditScreen}/>
  
      </DrawerNav.Navigator>
    );
  };
  



  
  const RootNavigation = () => {
    const StackNavigation = createStackNavigator();
    return (<>
      <StackNavigation.Navigator initialRouteName='Drawer' screenOptions={{
        headerShown: false,
      }}>
        <StackNavigation.Screen name='Drawer' component={DrawerNavigation} />
        <StackNavigation.Screen name='HomePage' component={BottomNavigation} />
        <StackNavigation.Screen name='CompetitionScreens' component={TopCompetitionNavigation}/>
        <StackNavigation.Screen name='ReadersClubScreens' component={TopReadersClubNavigation}/>
      </StackNavigation.Navigator>
    </>
    );
  };
  
  const UnloggedNavigation=()=>{
    const StackNavi= createStackNavigator();
    const dispatch=useDispatch();
  const [open, setOpen]=useState(false);

  const openBottom=()=>{
    setOpen(true);
  }

  const closeBottom=()=>{
    setOpen(false);
  }

  const selectLanguage=(val)=>{
    dispatch(languageActions.selectLanguage(val));
    closeBottom();
  }

    return (
      <StackNavi.Navigator initialRouteName='WelcomeScreen' screenOptions ={{
  headerStyle:{
    backgroundColor: accColor,
  },  headerTintColor:"white"
      }}>
        <StackNavi.Screen name='WelcomeScreen' component={WelcomeScreen} options={{headerShown:false}}/>
        <StackNavi.Screen options={{
          headerLeft:()=>(<Text style={{margin:4, fontFamily:"OpenSans-Bold", fontSize:24, color:"white"}}>BookFreak</Text>),
          headerTitle:"",
          headerRight:()=>(<LanguageSelect handleClose={closeBottom} handleOpen={openBottom} showLanguage={open} selectLangugage={selectLanguage}/>)
        }} name="Login" component={LoginScreen}/>
        <StackNavi.Screen options={{
          headerLeft:()=>(<Text style={{margin:4, fontFamily:"OpenSans-Bold", fontSize:24, color:"white"}}>BookFreak</Text>),
          headerTitle:"",
          headerRight:()=>(<LanguageSelect handleClose={closeBottom} handleOpen={openBottom} showLanguage={open} selectLangugage={selectLanguage}/>)
        }} name="SignUp" component={SignUpScreen}/>
        <StackNavi.Screen options={{
          headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Bold", fontSize:20, color:"white"}}>BookFreak</Text>)
        }} name="PhoneSignUp" component={SignUpWithPhoneScreen}/>
        <StackNavi.Screen options={{
          headerTitle:()=>(<Text style={{fontFamily:"OpenSans-Bold", fontSize:20, color:"white"}}>BookFreak</Text>)
        }} name="PhoneLogin" component={LoginWithPhoneScreen}/>
      </StackNavi.Navigator>
    )
  }

  
  const ScreenContainer = () => {
  initializeApp(firebaseConfig);
  const {user}=useAuthContext();
const {isOpen, message, alertType}=useSnackbarContext();

const [isFlightModeOn, setIsFlightModeOn]=useState(false);
const [isConnected, setIsConnected]=useState(true);


const flightModeCheck=async ()=>{
 const isEnabled= await Network.isAirplaneModeEnabledAsync();
 setIsFlightModeOn(isEnabled);
}

useEffect(()=>{
  const internetConnectionCheck = async ()=>{
    NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    
  
  }
  internetConnectionCheck();
  flightModeCheck();
},[])


    return (
<>

    {!isFlightModeOn && isConnected && user ? <RootNavigation/> : <UnloggedNavigation/>}

    {isFlightModeOn && <FlightModeScreen />}

    {!isConnected && !isFlightModeOn  && <NoInternetScreen/>}

    {isOpen && <SnackbarAlert visible={isOpen} snackbarText={message} snackbarType={alertType}/>}
</>
    
   )
}

export default ScreenContainer