import { httpsCallable } from 'firebase/functions';

import auth from '@react-native-firebase/auth';

import { functions } from '../firebaseConfig';
import { useAuthContext } from './useAuthContext';
import { useRealDatabase } from './useRealDatabase';
import useRealtimeDocument from './useRealtimeDocument';
import useStorage from './useStorage';

function usePhoneAuthentication() {
const {getDocument}=useRealtimeDocument();
const {uploadConvertedUri}=useStorage();
const {addToDataBase}=useRealDatabase();
const createStripeAccount=httpsCallable(functions, 'createAccount');
const createAccountLink=httpsCallable(functions, "createAccountLink");
const {dispatch}=useAuthContext();
 const sendVerificationCode= async (phoneNumber, countryNumber, recaptchaVerifier, sendVerificationId, setVerificationError)=>{
    try {
   const verificationId= await auth().signInWithPhoneNumber(`${countryNumber}${phoneNumber}`,true);

   sendVerificationId(verificationId);
} catch (error) {
  console.log(error);
    setVerificationError(error.message);
}
 }

const confirmCode= async (verificationId,verificationCode, setError, userData)=>{
    try{
const response = await verificationId.confirm(verificationCode);
    console.log(response.user);
    const userDocument= await getDocument('users', response.user.uid);
    console.log(userDocument);
    
    if(!userDocument) {
    const photoURL= await uploadConvertedUri(userData.photoURL, `profileImg/uid${response.user.uid}/${userData.photoURL}`);
    console.log(photoURL);
        await updateProfile(response.user, {
            displayName: userData.nickname,
             photoURL
          });

          const fetchedObject = await createStripeAccount({
            accountData: {
              id: response.user.uid,
              nickname: response.user.displayName,
              email: response.user.email,
            },
          });
      
          
  
      const stripeAccountData = fetchedObject.data;
      console.log(stripeAccountData);
  
          const accountLinkResponse = await createAccountLink({ accountId: stripeAccountData.id });
  
          const accountLinkObject = accountLinkResponse.data;
  console.log(accountLinkObject);
          addToDataBase("users", response.user.uid, {
            nickname: response.user.displayName,
            email: response.user.email,
            description: "",
            id: response.user.uid,
            photoURL: photoURL,
            creditsAvailable: {
              valueInMoney: 0,
              currency: stripeAccountData.default_currency,
            },
            stripeAccountData,
            accountLinkObject: { ...accountLinkObject.accountLinkObject },
          });
console.log("New User");
    }
    dispatch({ type: "LOGIN", payload: response.user });

}catch(err){
    setError(err);
}

}


return {sendVerificationCode, confirmCode}

}

export default usePhoneAuthentication