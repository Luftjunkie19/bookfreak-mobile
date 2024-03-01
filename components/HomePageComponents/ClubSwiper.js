import React from 'react';

import {
  Dimensions,
  ScrollView,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import useGetDocuments from '../../hooks/useGetDocuments';
import ReaderClub from './ItemComponents/ReaderClub';

const ClubSwiper = () => {
    const transformX=useSharedValue(0);
const {documents}=useGetDocuments('readersClubs');

  return (

    <ScrollView
      onScroll={({ nativeEvent }) => {
        transformX.value = nativeEvent.contentOffset.x;
      }}
      snapToInterval={Dimensions.get('window').width / 1.4}
      horizontal
      pagingEnabled
      bounces={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ padding: 5 }}
      style={{maxWidth:300}} 
      >
{documents && documents.slice(0, 5).map((item, index)=><ReaderClub key={index} scrollX={transformX} index={index} data={item} itemWidth={280}/>)}
      </ScrollView>

  )
}

export default ClubSwiper