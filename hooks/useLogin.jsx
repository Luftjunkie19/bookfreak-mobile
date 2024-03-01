import {
  useEffect,
  useState,
} from 'react';

import * as WebBrowser from 'expo-web-browser';
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import {
  AccessToken,
  LoginManager,
} from 'react-native-fbsdk-next';

import {
  auth,
  functions,
} from '../firebaseConfig';
import { useAuthContext } from './useAuthContext';
import { useRealDatabase } from './useRealDatabase';
import useRealtimeDocument from './useRealtimeDocument';
import useStorage from './useStorage';

export function useLogin() {
  const {uploadConvertedUri}=useStorage();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { getDocument } = useRealtimeDocument();
  const { addToDataBase } = useRealDatabase();
  const createStripeAccount= httpsCallable(functions, "createAccount");
  const createStripeAccountLink=httpsCallable(functions, "createAccountLink");
  const context = useAuthContext();

  const { dispatch } = context;
 
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);


  const signInWithFacebook = async () => {
    setError(null);
    setIsPending(true);

    try {

      await LoginManager.logInWithPermissions(['public_profile', 'email']);
      const logManagerData= await AccessToken.getCurrentAccessToken();

      if(!logManagerData){
        return;
      }

      const facebookCredentials = FacebookAuthProvider.credential(logManagerData.accessToken);

      const res = await signInWithCredential(auth, facebookCredentials);

      const documentExistence = await getDocument("users", res.user.uid);

    
      console.log(documentExistence);

       if (!documentExistence) {
        const uploadPath = `profileImg/uid${res.user.uid}/${res.user.photoURL}`;

        const storage = getStorage();

        const image = ref(storage, uploadPath);

        const snapshot = await uploadBytes(image, res.user.photoURL);
        await getDownloadURL(image);

        const fetchedObject= await createStripeAccount({
          accountData: {
            id: res.user.uid,
            nickname: res.user.displayName,
            email: res.user.email,
           }});
           console.log(fetchedObject);
        
                const stripeAccountData =  fetchedObject.data;
           
                const accountLinkResponse=await createStripeAccountLink({accountId: stripeAccountData.id});
        
          
             const accountLinkObject = accountLinkResponse.data;
  
        console.log(accountLinkObject);

        
        console.log(stripeAccountData);

        addToDataBase("users", res.user.uid, {
          nickname: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
          description: "",
          id: res.user.uid,
          stripeAccountData,
          accountLinkObject:{...accountLinkObject.accountLinkObject},
           creditsAvailable:{ valueInMoney:0, currency:stripeAccountData.default_currency },
        });
      }

      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      
    } catch (error) {
      setIsPending(false);

      setError(error.message);
    }
  };

  const signInNormally = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {

      const res = await signInWithEmailAndPassword(auth, email, password);

      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      
    } catch (error) {
      setIsPending(false);

      setError(error.message);
    }
  };

  const signUpUser = async (email, password, displayName, profileImg) => {
    setError(null);
    setIsPending(true);
    try {


      const res = await createUserWithEmailAndPassword(auth, email, password);

      const photoURL = await uploadConvertedUri(profileImg,  `profileImg/uid${res.user.uid}/${res.user.displayName}.jpg`);


      await updateProfile(res.user, { displayName, photoURL });

      const fetchedObject= await createStripeAccount({
        accountData: {
          id: res.user.uid,
          nickname: res.user.displayName,
          email: res.user.email,
         }});
      
              const stripeAccountData =  fetchedObject.data;
         
              const accountLinkResponse=await createStripeAccountLink({accountId: stripeAccountData.id});
      
        
           const accountLinkObject = accountLinkResponse.data;
        
        console.log(stripeAccountData);
      
      addToDataBase("users", res.user.uid, {
        nickname: res.user.displayName,
        email: res.user.email,
        photoURL: res.user.photoURL,
        description: "",
         creditsAvailable:{ valueInMoney:0, currency:stripeAccountData.default_currency},
        id: res.user.uid,
        accountLinkObject: { ...accountLinkObject.accountLinkObject },
        stripeAccountData,
        
      });

      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);

      
    } catch (error) {
      setIsPending(false);

      setError(error.message);
    }
  };

  return {
    signInWithFacebook,
    signInNormally,
    signUpUser,
    error,
    isPending,
  };
}
