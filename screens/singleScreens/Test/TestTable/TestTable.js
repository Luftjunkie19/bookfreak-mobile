import React from 'react';

import LottieView from 'lottie-react-native';
import { View } from 'react-native';

import {
  Divider,
  List,
} from '@ui-kitten/components';

import TestTableItem from './TestTableItem';

const TestTable = ({dataItems}) => {
  return (<>
  {dataItems.length !== 0 ? <List ItemSeparatorComponent={Divider} style={{maxHeight:170, marginTop:8}} data={dataItems} renderItem={({item})=>(<TestTableItem itemData={item}/>)}/> : <View>
    <LottieView autoPlay source={require('../../../../assets/lottieAnimations/Animation - 1700320134586.json')} style={{width:300, height:400}}/>
    </View>}
  
  </>
  )
}

export default TestTable