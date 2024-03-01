import React from 'react';

import { ScrollView } from 'react-native';

import { useTheme } from '@ui-kitten/components';

import BookCategoryChart
  from '../../../components/CommunityComponents/Charts/BookCategoryChart';
import UsersComparisonChart
  from '../../../components/CommunityComponents/Charts/UsersComparisonChart';
import useGetDocuments from '../../../hooks/useGetDocuments';

const StatisticsScreen = ({route, navigation}) => {
  const theme = useTheme();
  const {id}=route.params.params;
  const {documents:books}=useGetDocuments('books');
  const {documents:readersObjects}=useGetDocuments('bookReaders');
  const {documents:members}=useGetDocuments(`communityMembers/${id}/users`);
  const readers=readersObjects.map((bookReader) => {
    return bookReader.readers;
  }).map((obj) => {
    const nestedObject = Object.values(obj);
    return nestedObject;
  }).flat();




  const filteredReaders=()=>{
    let array=[];
    readers.map((reader)=>{
          const isMember= members.find((member)=>member.value.id === reader.id);
      
          if(isMember){
            array.push(readers.find((reader)=>reader.id === isMember.value.id));
          }else{
            return;
          }
          
        });
        return array;
      }
      
      const filteredBooks = () => {
        const filteredReadersArray = filteredReaders(); // Get the filtered readers first
        let array = [];
      
        books.forEach((book) => {
          const isBook = filteredReadersArray.find((reader) => reader.bookReadingId === book.id);
      
          if (isBook) {
            array.push(book);
          }
        });
      
        return array;
      };

  return (
    <ScrollView style={{ backgroundColor: theme['color-basic-800'], width: "100%", height: "100%" }}>
      {filteredReaders().length > 0 && filteredBooks().length > 0 &&
        <>
<UsersComparisonChart readersObjects={filteredReaders()} bookObjects={filteredBooks()}/>
<BookCategoryChart readersObjects={filteredReaders()} bookObjects={filteredBooks()}/>
      </>
      }
    </ScrollView>
  )
}

export default StatisticsScreen