import React from 'react';

import {
  VictoryPie,
  VictoryTheme,
} from 'victory-native';

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
    <VictoryPie theme={VictoryTheme.material} height={300} data={bookCategoryData}/>
  )
}

export default BookCategoryChart