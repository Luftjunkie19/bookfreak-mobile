import React from 'react';

import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
} from 'victory-native';

import { accColor } from '../../../assets/ColorsImport';

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
  
  <VictoryBar  cornerRadius={8} animate={{duration:1000, easing:'bounceIn', onLoad:{duration:1000}}} style={{ data: { fill: accColor } }} alignment="start" data={userReadingProgressData} labelComponent={<VictoryTooltip activateData  />} />
</VictoryChart>
  )
}

export default LineChart