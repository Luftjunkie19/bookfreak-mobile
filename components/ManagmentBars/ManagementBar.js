import React from 'react';

import { View } from 'react-native';

import { Divider } from '@gluestack-ui/themed';

import FilterTile from './ManagmentTiles/FilterTile';
import SortTile from './ManagmentTiles/SortTile';

const ManagementBar = ({selectedFilters, selectedSorting, sortings, filters, selectFilter, removeFilter, selectSorting}) => {
  return (
    <>
    <View style={{flexDirection:"row", padding:8, justifyContent:"space-between"}}>
      <FilterTile selectFilter={selectFilter} removeFilter={removeFilter} filters={filters} selectedFilters={selectedFilters} />
      <SortTile setSorting={selectSorting} sortings={sortings} selectedSorting={selectedSorting} />
    </View>
    <Divider/>
    </>
  )
}

export default ManagementBar