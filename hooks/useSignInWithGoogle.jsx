import {
  useEffect,
  useState,
} from 'react';

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

import {
  auth,
  functions,
} from '../firebaseConfig';
import { useAuthContext } from './useAuthContext';
import { useRealDatabase } from './useRealDatabase';
import useRealtimeDocument from './useRealtimeDocument';

WebBrowser.maybeCompleteAuthSession();

const useSignInWithGoogle = () => {
    const [isPending, setIsPending]=useState(false);
    const [error, setError]=useState(null);
const {getDocument}=useRealtimeDocument();    
const createStripeAccount=httpsCallable(functions, 'createStripeAccount');
const createStripeAccountLink=httpsCallable(functions, 'createStripeAccountLink');
const {dispatch}=useAuthContext();
const {addToDataBase}=useRealDatabase();
    const [request, response, promiseAsync]=Google.useAuthRequest({
        iosClientId:"389109624627-oll9e8pnn3ocakfovf7em9es3ptdm141.apps.googleusercontent.com",
        androidClientId:"389109624627-vmla5g4htkbj88qo2lab9v19rqb6udlg.apps.googleusercontent.com"
      });
      const signInWithGoogle = async () => {
        setError(null);
        setIsPending(true);
        try {
 
      
      const {id_token}=response.params;
    
    
          if(id_token){
            const googleCredentials = GoogleAuthProvider.credential(id_token);
    
            const res = await signInWithCredential(auth, googleCredentials);
      
            const documentExistence = await getDocument("users", res.user.uid);
      
            if (!documentExistence) {
              const uploadPath = `profileImg/uid${res.user.uid}/${res.user.photoURL}`;
      
              const storage = getStorage();
      
              const image = ref(storage, uploadPath);
      
              const snapshot = await uploadBytes(image, res.user.photoURL);
              await getDownloadURL(image);
      
              const accountData={
                accountData: {
                  id: res.user.uid,
                  nickname: res.user.displayName,
                  email: res.user.email,
                 }};
      
                 console.log(accountData);
      
      const fetchedObject= await createStripeAccount(accountData);
      
              const stripeAccountData =  fetchedObject.data;
         
              const accountLinkResponse=await createStripeAccountLink({accountId: stripeAccountData.id});
              console.log(accountLinkResponse);
        
           const accountLinkObject = accountLinkResponse.data;
        
              console.log(accountLinkObject);
      
              
              console.log(stripeAccountData);
      
              addToDataBase("users", res.user.uid, {
                nickname: res.user.displayName,
                email: res.user.email,
                photoURL: res.user.photoURL,
                description: "",
                id: res.user.uid,
                creditsAvailable:{ valueInMoney:0, currency:stripeAccountData.default_currency },
                stripeAccountData,
                accountLinkObject:{...accountLinkObject.accountLinkObject}
              });
            }
      
            dispatch({ type: "LOGIN", payload: res.user });
      
            
      
            setError(null);
            setIsPending(false);
          }
        
    }
         catch (error) {
          setIsPending(false);
    console.log(error);
          setError(error.message);
        }
      };
    

      useEffect(()=>{
        if(response?.type==="success"){
            signInWithGoogle();
        }
      },[response]);

return {promiseAsync, isPending};
}

export default useSignInWithGoogle