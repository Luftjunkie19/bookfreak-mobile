import React from 'react';

import { View } from 'react-native';

import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';

const Charts = ({readerObjects, bookObjects}) => {
  return (
    <View>
      {readerObjects.length > 0 && 
      <PieChart data={readerObjects}/>
      }
      {readerObjects.length > 0 && bookObjects.length > 0 && <LineChart data={readerObjects} secondData={bookObjects}/>}
   
    </View>
  )
}

export default Charts