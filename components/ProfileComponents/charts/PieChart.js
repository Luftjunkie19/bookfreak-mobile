import React from 'react';

import {
  VictoryLabel,
  VictoryPie,
  VictoryTheme,
} from 'victory-native';

import { accColor } from '../../../assets/ColorsImport';
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
   <VictoryPie   labelPosition={({ index }) => index
   ? "centroid"
   : "startAngle"
 }
 labelPlacement={({ index }) => index
   ? "parallel"
   : "vertical"
 } labelComponent={<VictoryLabel/>}  labelIndicator  height={300} theme={VictoryTheme.material} animate={{
    duration:500,
   }} style={{
    data: {
      fillOpacity: 0.9, stroke: accColor, strokeWidth: 3
    },
    labels: {
      fontSize: 14, fontWeight:'500', fill: "#ffffff"
    }
  }} data={transformedBooksArray}/>
  )
}

export default PieChart