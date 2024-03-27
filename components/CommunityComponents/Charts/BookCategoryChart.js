import React from 'react';

import { Dimensions } from 'react-native';
import {
  Flyout,
  VictoryPie,
  VictoryTheme,
  VictoryTooltip,
} from 'victory-native';

import {
  accColor,
  primeColor,
} from '../../../assets/ColorsImport';

const BookCategoryChart = ({bookObjects, readersObjects}) => {
    const bookCategoryData = bookObjects.map((book) => {
        const totalPagesReadInCategory = readersObjects
          .filter((reader) => reader.bookReadingId === book.id)
          .reduce((total, reader) => total + reader.pagesRead, 0);
    
        return {
          x: book.category,
          y: totalPagesReadInCategory,
        };
      });

  return (
    <VictoryPie style={{labels: {
      fontSize: 14, fontWeight:'500', fill: "#ffffff",
      fontFamily:"OpenSans-Regular"
    }}} labelComponent={<VictoryTooltip   activateData activePoints={2}  flyoutStyle={{ stroke: accColor, strokeWidth: 2 }} flyoutComponent={<Flyout style={{backgroundColor:primeColor, padding:8}} />} />}  width={Dimensions.get('screen').width / 1.05} theme={VictoryTheme.material} height={Dimensions.get('screen').height / 2.5} data={bookCategoryData}/>
  )
}

export default BookCategoryChart