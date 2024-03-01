import React from 'react';

import {
  FlatList,
  View,
} from 'react-native';

import LinkItem from './ItemComponents/Link';

const Links = ({links}) => {
  return (
    <View>
     <FlatList horizontal style={{margin:4, flexDirection:"row", gap:4, flexWrap:"wrap"}} data={links} renderItem={(item)=>(<LinkItem linkData={item.item}/>)}/>
    </View>
  )
}

export default Links