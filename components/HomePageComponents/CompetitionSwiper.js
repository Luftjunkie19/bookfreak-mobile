import React from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedRef,
  useScrollViewOffset,
  useSharedValue,
} from 'react-native-reanimated';

import useGetDocuments from '../../hooks/useGetDocuments';
import Competition from './ItemComponents/Competition';

const YourComponent = () => {
  const animatedRef = useAnimatedRef();
  const scrollOffset = useScrollViewOffset(animatedRef);
  const transformX=useSharedValue(0);
  const transformY=useSharedValue(0);
  const {documents}=useGetDocuments("competitions");



  return (
    <GestureHandlerRootView>
    <Animated.FlatList
    data={documents.slice(0, 5)}
    bounces={false}
    snapToInterval={300}
    renderItem={({item, index})=><Competition index={index} scrollX={transformX} data={item}/>}
    onScroll={({nativeEvent})=>{
      transformX.value= nativeEvent.contentOffset.x;
    }}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ padding:5, gap:16, margin:4}}
      style={{maxWidth:300}}/>
      
  
    </GestureHandlerRootView>
  );
};

export default YourComponent;