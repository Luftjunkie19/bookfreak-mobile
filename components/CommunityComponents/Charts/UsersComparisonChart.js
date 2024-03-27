import React from 'react';

import {
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryTheme,
} from 'victory-native';

import { accColor } from '../../../assets/ColorsImport';

const UsersComparisonChart = ({readersObjects, bookObjects}) => {
    const userComparisonData = readersObjects
    .map((reader, i) => {
      const book = bookObjects.find((b) => b.id === reader.bookReadingId);
      if (!book) {
        console.log(`No book found for reader: ${reader.displayName}`);
        return null;
      }
      return {
        x: reader.displayName,
        y: reader.pagesRead,
        label: reader.pagesRead
      };
    })
    .filter((data) => data !== null);


  return (

<VictoryChart theme={VictoryTheme.material}>
    <VictoryBar style={{labels: {
      fontSize: 14, fontWeight:'500', fill: "#ffffff",
      fontFamily:"OpenSans-Regular",
    }, data: { fill: accColor } }} labelComponent={<VictoryLabel verticalAnchor="middle" textAnchor="start" />} animate={{easing:'elasticIn', duration:1000, onLoad:{duration:1000}}}  cornerRadius={{ topLeft: () => 10, topRight:()=> 10 }}  barRatio={0.7}  alignment="start" data={userComparisonData} />
</VictoryChart>
  
  
  
  )
}

export default UsersComparisonChart