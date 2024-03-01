import 'react-native-gesture-handler';
import 'expo-dev-client';

import { useCallback } from 'react';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import * as eva from '@eva-design/eva';
import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { ApplicationProvider } from '@ui-kitten/components';

import { name as appName } from './app.json';
import AuthContextProvider from './context/AuthContext';
import { SnackBarProvider } from './context/SnackbarCxt';
import stored from './context/Stored';
import ScreenContainer from './ScreenContainer';

SplashScreen.preventAutoHideAsync();
export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.ttf'),
    'Inter-Light':require('./assets/fonts/Inter-Light.ttf'),
    'Inter-Thin':require('./assets/fonts/Inter-Thin.ttf'),
    'Inter-Regular':require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-SemiBold':require('./assets/fonts/Inter-SemiBold.ttf'),
    'Inter-ExtraBold':require('./assets/fonts/Inter-ExtraBold.ttf'),
    'Inter-Bold':require('./assets/fonts/Inter-Bold.ttf'),
    'Lato-Light':require('./assets/fonts/Lato-Light.ttf'),
    'Lato-Black':require('./assets/fonts/Lato-Black.ttf'),
    'Lato-BlackItalic':require('./assets/fonts/Lato-BlackItalic.ttf'),
    'Lato-Regular':require('./assets/fonts/Lato-Regular.ttf'),
    'Lato-Thin':require('./assets/fonts/Lato-Thin.ttf'),
    'Lato-ThinItalic':require('./assets/fonts/Lato-ThinItalic.ttf'),
    'OpenSans-Regular':require('./assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-Light':require('./assets/fonts/OpenSans-Light.ttf'),
    'OpenSans-Medium':require('./assets/fonts/OpenSans-Medium.ttf'),
    'OpenSans-SemiBold':require('./assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-SemiBoldItalic':require('./assets/fonts/OpenSans-SemiBoldItalic.ttf'),
    'OpenSans-Bold':require('./assets/fonts/OpenSans-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider>
      <GluestackUIProvider config={config} >
    <SafeAreaView style={{ flex: 1 }} onLayout={onLayoutRootView}>
  <SnackBarProvider>
      <AuthContextProvider>
<Provider store={stored}>
<ApplicationProvider {...eva} theme={eva.dark}>
  <StripeProvider publishableKey='pk_live_51OH7bEL8z1e5mvb6cRUtXozdxKDTnavff5HC7uvFomF9efgUTxDmLo8eX0l0tBtN2g9UIFsIpYoZaPWBwk5jGP5N00rMHJUYpR'
        urlScheme="com.bookfreak.org" 
        merchantIdentifier="merchant.com.BookFreak"
        >
    <NavigationContainer>
       <ScreenContainer/>
    </NavigationContainer>
    </StripeProvider>
</ApplicationProvider>
</Provider>
      </AuthContextProvider>
</SnackBarProvider>
    </SafeAreaView>
    </GluestackUIProvider>
    </PaperProvider>
  );
}
AppRegistry.registerComponent(appName, () => App);