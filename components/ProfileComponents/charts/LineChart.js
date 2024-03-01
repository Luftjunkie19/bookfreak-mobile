import React from 'react';

import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
} from 'victory-native';

const LineChart = ({data, secondData}) => {
  const userReadingProgressData = data
  .map((reader, i) => {
    const book = secondData.find((b) => b.id === reader.bookReadingId);
    if (!book) {
      return null;
    }
    // Assuming proportion is calculated as pagesRead / totalPages
    const proportion = Math.round(
      (reader.pagesRead / book.pagesNumber) * 100
    );



    return {
      x: i + 1,
      y: proportion,
      label:book.pagesNumber,
      bookPages:book.title
    };
  })
  .filter((data) => data !== null);

const xLabels = userReadingProgressData.map((data) => data.x);
const userReadingProgress = userReadingProgressData.map((data) => data.y);
const bookPages=userReadingProgressData.map((data) => data.bookPages);

  return (
<VictoryChart theme={VictoryTheme.material}>
<VictoryAxis
          tickValues={xLabels}
          tickFormat={bookPages}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(x) => (`${x}%`)}
        />
  
  <VictoryBar alignment='start' data={userReadingProgressData} labelComponent={<VictoryTooltip />}/>
</VictoryChart>
  )
}

export default LineChart