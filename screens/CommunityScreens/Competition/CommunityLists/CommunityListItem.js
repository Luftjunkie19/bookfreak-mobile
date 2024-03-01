import React from 'react';

import {
  Image,
  Text,
  View,
} from 'react-native';

import { Link } from '@gluestack-ui/themed';

import { accColor } from '../../../../assets/ColorsImport';

const CommunityListItem = ({item, index}) => {
  return (
    <View key={index} style={{flexDirection:"row", gap:6, padding:4, justifyContent:"space-around", alignItems:"center", borderRadius:6, backgroundColor:accColor}}>
   <Link style={{flexDirection:"row",gap:12, alignItems:"center"}}>
    <Image source={{uri:item.photoURL}} style={{width:60, height:60, borderRadius:100}}/>
   </Link>
  <View style={{alignItems:"center"}}>
    <Text style={{color:"white", fontFamily:"Inter-Black"}}>Read Books</Text>
    <Text style={{color:"white", fontFamily:"Inter-Black"}}>{item.readBooks}</Text>
  </View>
  <View style={{alignItems:"center"}}>
    <Text style={{color:"white", fontFamily:"Inter-Black"}}>Gained Points</Text>
    <Text style={{color:"white", fontFamily:"Inter-Black"}}>{item.gainedPoints}</Text>
  </View>
    </View>
  )
}

export default CommunityListItem