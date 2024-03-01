import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

import { storage } from '../firebaseConfig';

function useStorage() {
    const uploadConvertedUri = async (uri, path) => {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
  
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, blob);
  
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {},
            (error) => {
              console.log('Something failed', error);
              reject('Upload failed');
            },
            async () => {
              try {
                const img = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(img);
              } catch (error) {
                console.log('Error getting download URL', error);
                reject('Error getting download URL');
              }
            }
          );
        });
      } catch (err) {
        console.log(err);
        return Promise.reject('Error fetching image');
      }
    };
  
    return { uploadConvertedUri };
  }
  
  export default useStorage;