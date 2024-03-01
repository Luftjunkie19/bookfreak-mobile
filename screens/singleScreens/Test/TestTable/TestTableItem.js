import React from 'react';

import {
  Image,
  Text,
} from 'react-native';

import { ListItem } from '@ui-kitten/components';

import { accColor } from '../../../../assets/ColorsImport';

const TestTableItem = ({itemData}) => {
  return (
    <ListItem style={{backgroundColor:accColor}} description={`${Math.floor(itemData.timeOfGame/1000)} seconds`} title={itemData.player.nickname} accessoryRight={()=>(<Text style={{color:"white", fontWeight:"700"}}>{itemData.finalResult} %</Text>)} accessoryLeft={()=>(<Image source={{uri:itemData.player.photoURL}} style={{width:40, height:40, borderRadius:100}}/>)}/>
  )
}

export default TestTableItem