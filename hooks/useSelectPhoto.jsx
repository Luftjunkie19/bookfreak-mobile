import { useState } from 'react';

import * as ImagePicker from 'expo-image-picker';

export const useSelectPhoto = () => {
const [photoURL, setPhotoURL]=useState(null);
const [messagePhotos, setMessagePhotos]=useState([]);

const clearPhotosArray=()=>{
  setMessagePhotos([]);
}

const selectSinglePhoto= async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
    setPhotoURL(result.assets[0].uri);
    }
  };

  const selectMultiplePhotos= async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      selectionLimit:5,
      allowsMultipleSelection:true,
    });

    const improvedArray=result.assets.map((item)=>{
      return {uri:item.uri, message:""};
    });
    console.log(improvedArray);

    if (!result.canceled) {
        setMessagePhotos(improvedArray);
    }
  };

  return {
    photoURL,
    messagePhotos,
    selectMultiplePhotos,
    selectSinglePhoto,
    clearPhotosArray
  }

}

