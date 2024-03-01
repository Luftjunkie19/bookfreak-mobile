import React from 'react';

import {
  Image,
  Pressable,
  Text,
} from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@gluestack-ui/themed';
import { useTheme } from '@ui-kitten/components';

import { accColor } from '../../assets/ColorsImport';

const LikersModal = ({likers, isOpened, closeModal}) => {
    const theme=useTheme();
  return (
    <Modal isOpen={isOpened}>
    <ModalBackdrop onPress={closeModal}/>
    <ModalContent style={{backgroundColor:theme["color-basic-800"]}}>
      <ModalHeader alignSelf="flex-end">
        <ModalCloseButton onPress={closeModal} flexDirection='row' gap={10} alignItems='center'>
            <Text style={{color:"white", fontFamily:"Inter-Black"}}>Close</Text>
            <FontAwesome name='close' size={20} color='red'/>
        </ModalCloseButton>
      </ModalHeader>
      <ModalBody contentContainerStyle={{gap:16}}>
        {likers.map((liker)=>(<Pressable android_ripple={{color:accColor, radius:155, }} style={{flexDirection:"row", gap:16, alignItems:"center", padding:8, borderRadius:8}}>
<Image source={{uri:liker.photoURL}} style={{width:60, height:60, borderRadius:100}}/>
<Text style={{fontFamily:"Inter-Black", color:"white"}}>{liker.displayName}</Text>
        </Pressable>))}
      </ModalBody>

    </ModalContent>
  </Modal>
  )
}

export default LikersModal