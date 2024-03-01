import React from 'react';

import { View } from 'react-native';

import { List } from '@ui-kitten/components';

import useGetDocuments from '../../../../hooks/useGetDocuments';
import { useRanking } from '../../../../hooks/useRanking';
import CommunityListItem from './CommunityListItem';

const CommunityList = ({communityMembers, readerObjects, communityObject,
    expirationTimeNumber,}) => {
        const {documents:books}=useGetDocuments('books');
        const getReadBooks = (id) => {
            return !communityObject?.expiresAt
              ? readerObjects.filter(
                  (reader, i) => reader.id === id && reader.hasFinished
                ).length
              : readerObjects.filter(
                  (reader, i) =>
                    reader.id === id &&
                    reader.hasFinished &&
                    reader.dateOfFinish >= communityObject.createdBy.createdAt &&
                    reader.dateOfFinish <= communityObject.expiresAt
                ).length;
          };
        
          const getlastBookRead = (id) => {
            const BookTitles = !communityObject?.expiresAt
              ? readerObjects.filter(
                  (reader, i) => reader.id === id && reader.hasFinished
                )
              : readerObjects.filter(
                  (reader, i) =>
                    reader.id === id &&
                    reader.hasFinished &&
                    reader.dateOfFinish >= communityObject.createdBy.createdAt &&
                    reader.dateOfFinish <= communityObject.expiresAt
                );
        
            const lastBookTitle = books.filter(
              (book, index) => book.id === BookTitles[index]?.bookReadingId
            )[
              books.filter(
                (book, index) => book.id === BookTitles[index]?.bookReadingId
              ).length - 1
            ]?.title;
        
            return lastBookTitle ? lastBookTitle : "No book yet";
          };

    const {orderedMembers}=useRanking({readerObjects,communityMembers, getReadBooks, getlastBookRead, communityObject, expirationTimeNumber});
  return (
    <View>
    <List contentContainerStyle={{gap:8, padding:6}} data={orderedMembers} renderItem={CommunityListItem}/>

 
    </View>
  )
}

export default CommunityList