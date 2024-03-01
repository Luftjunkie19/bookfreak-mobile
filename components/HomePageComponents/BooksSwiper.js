import React from 'react';

import { FlatList } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import useGetDocuments from '../../hooks/useGetDocuments';
import Book from './ItemComponents/Book';

const BooksSwiper = () => {
    const transformX=useSharedValue(0);


    const {documents}=useGetDocuments('books');
  return (
    <FlatList
    data={documents.slice(0, 5)}
    onScroll={({nativeEvent})=>{
      transformX.value= nativeEvent.contentOffset.x;
    }}
    renderItem={({item, index})=>(<Book data={item} scrollX={transformX} index={index} />)}
    horizontal
    pagingEnabled
    bounces={false}
    showsHorizontalScrollIndicator={false}
    style={{ maxHeight:250, minHeight:150, maxWidth:300}} 
      snapToInterval={320}
      />
  )
}

export default BooksSwiper