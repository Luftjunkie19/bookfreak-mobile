import React, { useState } from 'react';

import { styled } from 'nativewind/dist';
import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import IonIcons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button } from '@rneui/themed';
import {
  Divider,
  useTheme,
} from '@ui-kitten/components';

import {
  accColor,
  primeColor,
} from '../../assets/ColorsImport';
import profileTranslations
  from '../../assets/translations/ProfileTranslations.json';
import Charts from '../../components/ProfileComponents/Charts';
import FavouriteBooks from '../../components/ProfileComponents/FavouriteBooks';
import Links from '../../components/ProfileComponents/Links';
import ReadBooks from '../../components/ProfileComponents/ReadBooks';
import { useAuthContext } from '../../hooks/useAuthContext';
import useGetDocument from '../../hooks/useGetDocument';
import useGetDocuments from '../../hooks/useGetDocuments';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';

const UsersProfile = ({route, navigation}) => {
    const {id}=route.params;
    const {document}=useGetDocument('users', id);
    const {documents:books}=useGetDocuments('books');
      const {documents: links}= useGetDocuments("links");
      const { documents: favBooks } = useGetDocuments("lovedBooks");
    const {documents: readers}=useGetDocuments("bookReaders");
    const {getDocument}=useRealtimeDocument();
    const readerObjects=readers.map((bookReader) => {
      return bookReader.readers;
    }).map((obj) => {
      const nestedObject = Object.values(obj);
      return nestedObject;
    }).flat();
    const {user}=useAuthContext();
    const readersFiltered = readerObjects.filter((reader) => reader.id === document.id);
    
    const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
    const NativeText=styled(Text);
    const NativeScrollView=styled(ScrollView);
    const theme=useTheme();
    const [openedSection, setOpenedSection]=useState('');
    
    
const yourFinishedBooks=readersFiltered.map((reader)=>{
  return books.filter((bookItem)=>bookItem.id === reader?.bookReadingId && reader.pagesRead === bookItem?.pagesNumber);
}).flat();
    
    const lovedBooks=books.map((book,i)=>{
      return books.filter((bookItem)=>bookItem.id === favBooks.filter((fav)=>fav.lovedBy === document.id)[i]?.lovedBookId);
    }).flat();
  return (
    <ScrollView style={{backgroundColor:theme["color-basic-800"]}}>
  {document && <>
    <View style={{width:220, height:220, alignSelf:"center", margin:16}}>
      <Image source={{uri: document.photoURL}} style={{height:"100%", width:"100%", borderRadius:160}}/>
    </View>


<View style={{margin:8, flexDirection:"row", justifyContent:"space-between"}}>
<NativeText className='text-lg font-interBlack text-white'>{document.nickname}</NativeText>

<Button onPress={async ()=>{
const providedId=`${user.uid}-${document.id}`;

const providedIdPartOne=providedId.split("-")[0];
const providedIdPartTwo=providedId.split("-")[1];

    const optionOne = await getDocument("usersChats",providedId);
    const secondOption= await getDocument("usersChats", `${providedIdPartTwo}-${providedIdPartOne}`);

    if(optionOne){
      navigation.navigate('UsersChatScreen', {
        id:providedId,
      });
    }
    if(secondOption){
      navigation.navigate('UsersChatScreen', {
        id:`${providedIdPartTwo}-${providedIdPartOne}`,
      });
    }else{
      navigation.navigate('UsersChatScreen', {
        id: providedId,
      });;
    }

}} buttonStyle={{gap:16, backgroundColor:accColor}} radius='md' titleStyle={{fontFamily:"Inter-Black"}} iconRight icon={{type:"material-community", name:"comment-processing", color:"white"}}>{profileTranslations.messageBtn[selectedLanguage]}</Button>
    </View>
   <Divider/>
<View style={{gap:16, padding:10}}>
  <View style={{padding:10, borderRadius:10, flexDirection:"row", justifyContent:"space-around", gap:16, backgroundColor:accColor}}>
    <IonIcons name='book' size={36} color={primeColor}  style={{alignSelf:"center"}}/>
    <View style={{gap:4, alignItems:"center"}}>
    <Text style={{color:"white", fontSize:16, fontFamily:"Inter-Black"}}>{profileTranslations.stats.addedBooks[selectedLanguage]}</Text>
<Text style={{fontFamily:"Inter-Black", color:"gold", fontSize:16}}>{books.filter((book)=>book.createdBy.id === id).length}</Text>
    </View>
  </View>

  <View style={{padding:10, borderRadius:10, flexDirection:"row", justifyContent:"space-around", gap:16, backgroundColor:accColor}}>
    <MaterialIcons style={{alignSelf:"center"}} name='my-library-books' size={36}/>
    <View style={{gap:4, alignItems:"center"}}>
    <Text style={{color:"white", fontSize:16, fontFamily:"Inter-Black"}}>{profileTranslations.stats.booksRead[selectedLanguage]}</Text>
    <Text style={{fontFamily:"Inter-Black", color:"gold", fontSize:16}}>{readerObjects.filter((reader)=>reader.id === id).length}</Text>
    </View>
  </View>

  <View style={{padding:10, borderRadius:10, flexDirection:"row", justifyContent:"space-around", gap:16, backgroundColor:accColor}}>
    <MaterialIcons style={{alignSelf:"center"}} name='thumb-up' size={36}/>
    
    <View style={{gap:4, alignItems:"center"}}>
    <Text style={{color:"white", fontSize:16, fontFamily:"Inter-Black"}}>{profileTranslations.stats.likedBooks[selectedLanguage]}</Text>
<Text style={{fontFamily:"Inter-Black", color:"gold", fontSize:16}}>{lovedBooks.length}</Text>
    </View>
  </View>
</View>


      {
  links.filter((link)=>link.belongsTo === id).length > 0 &&
<View style={{margin:6}}>
<NativeText className='text-xl font-medium font-interBlack text-white'>Links:</NativeText>

<Links links={links.filter((link)=>link.belongsTo === id)}/>
</View>


}

<View>
<NativeText className='text-2xl font-interBlack font-bold text-white'>{profileTranslations.description.title[selectedLanguage]}:</NativeText>

<View>
  <NativeScrollView nestedScrollEnabled className=' bg-imgCover overflow-x-hidden overflow-y-visible max-h-40'>

  <NativeText style={{fontFamily:"OpenSans-Regular"}} className='p-2 text-white text-base'>
  {document.description.trim().length === 0 ? `${profileTranslations.description.vacancy[selectedLanguage]}` : document.description}
    </NativeText>
  </NativeScrollView>
</View>


</View>

<ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{padding:6, gap:10}}>
<Button  iconPosition='right' radius="lg" icon={{
  type:"font-awesome",
  name:"book",
  size:20,
  color:"white"
}} titleStyle={{fontFamily:"Inter-Black"}} buttonStyle={{backgroundColor:accColor, gap:8}} onPress={()=>{
  setOpenedSection('books');
}}>
 {profileTranslations.featuresButtons.booksButton[selectedLanguage]}

  </Button>
<Button iconPosition='right' radius="lg" icon={{
  type:"font-awesome",
  name:"bookmark",
  size:20,
  color:"ye"
}} titleStyle={{fontFamily:"Inter-Black"}} buttonStyle={{backgroundColor:accColor, gap:8}} onPress={()=>{
  setOpenedSection('readbooks');
}}>
{profileTranslations.featuresButtons.readBooksBtn[selectedLanguage]}
</Button>
<Button  iconPosition='right' radius="lg" icon={{
  type:"font-awesome",
  name:"heart",
  size:20,
  color:"red"
}} titleStyle={{fontFamily:"Inter-Black"}} buttonStyle={{backgroundColor:accColor, gap:8}} onPress={()=>{
  setOpenedSection('belovedbooks');
}}>
{profileTranslations.featuresButtons.favouritesButton[selectedLanguage]}
</Button>
<Button iconPosition='right' radius="lg" icon={{
  type:"font-awesome",
  name:"pie-chart",
  size:20,
  color:"white"
}} titleStyle={{fontFamily:"Inter-Black"}} onPress={()=>{
  setOpenedSection('stats');
}} buttonStyle={{backgroundColor:accColor, gap:8}}>
 {profileTranslations.featuresButtons.statsBtn[selectedLanguage]}
</Button>
</ScrollView>
    </>}
 


    {openedSection.trim().length > 0 && openedSection === 'stats' &&
  <Charts bookObjects={books} readerObjects={readersFiltered} />
}




{openedSection === "books" &&
  <FavouriteBooks favBooks={books.filter((ownedBook) => ownedBook.createdBy.id === id)} />
}

{openedSection === "readbooks" &&
  <ReadBooks
    readBooks={yourFinishedBooks}
    readPages={yourFinishedBooks}
  />
}

{openedSection === "belovedbooks" && <FavouriteBooks favBooks={lovedBooks}/>}


{openedSection !== "stats" && openedSection !== "belovedbooks" && openedSection !== "books" && openedSection !== "readbooks" &&
  <></>
}

    </ScrollView>
  )
}

export default UsersProfile