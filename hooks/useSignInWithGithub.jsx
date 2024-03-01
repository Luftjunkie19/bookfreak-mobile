import {
  useEffect,
  useState,
} from 'react';

import {
  makeRedirectUri,
  useAuthRequest,
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  GithubAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import {
  getDownloadURL,
  getStorage,
  uploadBytes,
} from 'firebase/storage';

import {
  auth,
  functions,
} from '../firebaseConfig';
import { createTokenWithCode } from './createTokenWithCode';
import { useAuthContext } from './useAuthContext';

WebBrowser.maybeCompleteAuthSession();
function useSignInWithGithub() {
    const [isPending, setIsPending]=useState(false);
    const [error, setError]=useState(null);
    const discovery={
        authorizationEndpoint:"https://github.com/login/oauth/authorize",
        tokenEndpoint:"https://github.com/login/oauth/access_token",
        revocationEndpoint:`https://github.com/settings/connections/applications/b1f0ff0f7467411c74e1`,
      }
      
  const {dispatch}=useAuthContext();
    const [req, res, promiseAsync]=useAuthRequest({
        clientId:"b1f0ff0f7467411c74e1",
        scopes: ["identity", "user:email", "user:follow"],
        redirectUri: makeRedirectUri(),
      }, {...discovery});
      const createStripeAccount=httpsCallable(functions, 'createStripeAccount');
      const createStripeAccountLink= httpsCallable(functions, 'createStripeAccountLink');

      const signInWithGithub = async () => {
        setError(null);
        setIsPending(true);
        
        try {  
            if(res?.type === 'success'){
                const {code}=res.params;
                const {
                  access_token, scope, token_type
                }= await createTokenWithCode(code);
          console.log(code);
                if(access_token){
                  const githubCredentials = GithubAuthProvider.credential(access_token);
          
                  const res = await signInWithCredential(auth, githubCredentials);

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
                    
                      const stripeAccountData =  fetchedObject.data;
                       
                      const accountLinkResponse=await createStripeAccountLink({accountId: stripeAccountData.id});
                    
                      
                    const {accountLinkObject} = accountLinkResponse.data;
              
                    console.log(accountLinkObject,accountLinkResponse);
            
                    
                    console.log(stripeAccountData, fetchedObject);
            
                    addToDataBase("users", res.user.uid, {
                      nickname: res.user.displayName,
                      email: res.user.email,
                      photoURL: res.user.photoURL,
                      description: "",
                       creditsAvailable:{ valueInMoney:0, currency:stripeAccountData.default_currency },
                      id: res.user.uid,
                      stripeAccountData,
                       accountLinkObject:{...accountLinkObject.accountLinkObject},
                    });
                  }
            
                  dispatch({ type: "LOGIN", payload: res.user });
            
                  setError(null);
                  setIsPending(false);
            
                }
        
            }
    
          
        } catch (error) {
          setIsPending(false);
    
          setError(error.message);
        }
      };

useEffect(()=>{
    signInWithGithub();
},[res]);

  return {promiseAsync, isPending}
}

export default useSignInWithGithub