import { signOut } from 'firebase/auth';

import { auth } from '../firebaseConfig.js';
import { useAuthContext } from './useAuthContext';

export function useLogout() {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    try {
  

      await signOut(auth);


      dispatch({ type: "LOGOUT" });
    } catch (err) {
      console.log(err.message);
    }
  };

  return { logout };
}
