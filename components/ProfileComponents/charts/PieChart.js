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
import useGetDocuments from '../../../hooks/useGetDocuments';

const PieChart = ({data}) => {
  const { documents: booksObjects } = useGetDocuments("books");

  const books = data.map((item) => booksObjects.find((book) => book.id === item?.bookReadingId)).filter(Boolean);

  const transformBooks = (books) => {
    const transformedBooks = {};

    books.forEach((book) => {
      const { category } = book;

      if (!transformedBooks[category]) {
        transformedBooks[category] = 1; 
      } else {
        transformedBooks[category] += 1; 
      }
    });

    // Convert the transformedBooks object into an array of objects
    const result = Object.entries(transformedBooks).map(
      ([category, count]) => ({
        x: category,
        y: count,
        label: category
      })
    );

    return result;
  };

  // Check if books array is not empty before transforming
  const transformedBooksArray = books.length > 0 ? transformBooks(books) : [];

  return (
   <VictoryPie
   labelPosition={({ index }) => 
   "startAngle"
 }

 labelPlacement={({ index }) => "vertical"}
 labelComponent={<VictoryTooltip  activateData activePoints={2}  flyoutStyle={{ stroke: accColor, strokeWidth: 2 }} flyoutComponent={<Flyout style={{backgroundColor:primeColor, padding:8}} />} />}  width={Dimensions.get('screen').width / 1.05} height={Dimensions.get('screen').height / 2} theme={VictoryTheme.material} animate={{
    duration:1000,
    easing:'circleIn'
   }} style={{
    data: {
      fillOpacity: 0.9, stroke: accColor, strokeWidth: 3
    },
    labels: {
      fontSize: 14, fontWeight:'500', fill: "#ffffff",
      fontFamily:"OpenSans-Regular"
    }
  }} data={transformedBooksArray}/>
  )
}

export default PieChart