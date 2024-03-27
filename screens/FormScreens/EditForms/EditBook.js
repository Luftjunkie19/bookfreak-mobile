import {
  useEffect,
  useState,
} from 'react';

import { randomUUID } from 'expo-crypto';
import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import {
  Icon,
  Input,
  InputField,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import { Button } from '@rneui/themed';
import {
  Datepicker,
  useTheme,
} from '@ui-kitten/components';

import {
  accColor,
  primeColor,
} from '../../../assets/ColorsImport';
import { bookCategories } from '../../../assets/CreateVariables';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/FormsTranslations.json';
import Loader from '../../../components/Loader';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useFormRealData } from '../../../hooks/useFormRealData';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useSelectPhoto } from '../../../hooks/useSelectPhoto';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';
import useStorage from '../../../hooks/useStorage';

const EditBook = ({route, navigation}) => {
  const {id}=route.params;
  const {user}=useAuthContext();
  const {document}=useFormRealData('books', id);
  const {photoURL, selectSinglePhoto}=useSelectPhoto();
  const { updateDatabase } = useRealDatabase();
  const [error, setError]=useState(null);
  const [isPending, setIsPending] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription]=useState('');
  const [pagesNumber, setPagesNumber] = useState(1);
  const [category, setCategory]=useState(null);
  const [dateOfPublishing, setDateOfPublishing]=useState(new Date().getFullYear());
  const [publishingHouse, setPublishingHouse]=useState(null);
  const {dispatch}=useSnackbarContext();
  const {uploadConvertedUri}=useStorage();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  useEffect(() => {
    if (document) {
      if(document.createdBy.id === user.uid){
        setTitle(document.title);
        setAuthor(document.author);
        setPagesNumber(document.pagesNumber);
        setDescription(document.description);
        setCategory(document.category);
        setDateOfPublishing(document.dateOfPublishing);
        setPublishingHouse(document.publishingHouse);
      } else {
          navigation.navigate('BookScreen', {
        id:id,
      });
      }
    }
  }, [document]);

  const handleUpdate = async () => {
    setError(null);
    setIsPending(true);
    try {
      setError(null);
      setIsPending(false);
      dispatch({type:"SHOW_SNACKBAR", payload:{message:`${alertMessages.notifications.successfull.update[selectedLanguage]}`, alertType:"success"}})
      
      if(photoURL){
        const newImage= await uploadConvertedUri(photoURL,`book-covers/${user.uid}/${document.title ? document.title : `book${randomUUID()}`}.jpg`);
        updateDatabase(
          {
            ...document,
            title: title,
            author: author,
            pagesNumber: pagesNumber,
            photoURL: newImage,
            category: category,
            dateOfPublishing:  dateOfPublishing,
            publishingHouse: publishingHouse,
            description: description,
            bookCover:newImage,
          },
          "books",
          id
        );
      }else{
        updateDatabase(
          {
            ...document,
            title: title,
            author: author,
            pagesNumber: pagesNumber,
            category: category,
            dateOfPublishing:  dateOfPublishing,
            publishingHouse: publishingHouse,
            description: description,
          },
          "books",
          id
        );
      }

      navigation.navigate('BookScreen', {
        id:id,
      });

    } catch (error) {
      setError(error.message);
    }
  };


const theme=useTheme();
  return (
    <>
    <ScrollView style={{backgroundColor:theme['color-basic-800']}}>
{document && <>
<View style={{margin:8, gap:6}}>
<Image source={{uri: photoURL ? photoURL : document.photoURL}} style={{width:180, height:180, borderRadius:100, alignSelf:"center"}}/>
<Button titleStyle={{fontFamily:'OpenSans-Bold'}} onPress={selectSinglePhoto} icon={{name:"image", type:"material-community", color:"white"}} radius='xl' buttonStyle={{margin:8, minWidth:250, maxWidth:320, alignSelf:"center", backgroundColor:accColor}}>
  {translations.selectImgBtn.text[selectedLanguage]}
</Button>
</View>


<View style={{margin:8, gap:6}}>
  <Text style={{color:"white", fontFamily:'OpenSans-Regular'}}>{translations.bookAuthorInput.label[selectedLanguage]}:</Text>
<Input borderRadius="$full">
<InputField fontFamily='OpenSans-Regular' color='white' value={author} onChangeText={setAuthor}/>
</Input>
</View>

<View style={{margin:8, gap:6}}>
  <Text style={{color:"white", fontFamily:'OpenSans-Regular'}}>{translations.bookTitleInput.label[selectedLanguage]}:</Text>
<Input borderRadius="$full">
<InputField fontFamily='OpenSans-Regular' color='white' value={title} onChangeText={setTitle}/>
</Input>
</View>

<View style={{margin:8, gap:6}}>
  <Text style={{color:"white", fontFamily:'OpenSans-Regular'}}>{translations.bookCategoryInput.label[selectedLanguage]}:</Text>
  <Select>
    <SelectTrigger backgroundColor={accColor} android_ripple={{
      color:primeColor,
    }}>
      <SelectInput color='white' value={category} fontSize={16} padding={4} fontFamily='OpenSans-Regular' />
      <SelectIcon>
        <Icon />
      </SelectIcon>
    </SelectTrigger>
    <SelectPortal>
      <SelectBackdrop />
      <SelectContent>
        <SelectDragIndicatorWrapper>
          <SelectDragIndicator />
        </SelectDragIndicatorWrapper>
  {bookCategories.map((item)=>(<SelectItem onPress={()=>{
    setCategory(item);
  }} value={item} label={item} />))}
      </SelectContent>
    </SelectPortal>
  </Select>
</View>

<View style={{margin:8, gap:6}}>
  <Text style={{color:"white", fontFamily:'OpenSans-Regular'}}>{translations.yearOfRelease[selectedLanguage]}:</Text>
<Datepicker onSelect={(date)=>{
  setDateOfPublishing(new Date(date).getFullYear());
}} min={new Date('0000-01-01')} max={new Date()} date={dateOfPublishing ? new Date(`${dateOfPublishing}-01-01`) : new Date()}/>
</View>

<View style={{margin:8, gap:6}}>
  <Text style={{color:"white", fontFamily:'OpenSans-Regular'}}>{translations.publisher[selectedLanguage]}:</Text>
<Input borderRadius="$full">
<InputField fontFamily='OpenSans-Regular' color='white' onChangeText={setPublishingHouse} value={publishingHouse}/>
</Input>
</View>

<View style={{margin:8, gap:6}}>
  <Text style={{color:"white", fontFamily:'OpenSans-Regular'}}>{translations.pagesAmountInput.label[selectedLanguage]}:</Text>
<Input borderRadius="$full">
<InputField fontFamily='OpenSans-Regular' color='white' onChangeText={(val)=>setPagesNumber(+val)} keyboardType='numeric' value={`${pagesNumber}`}/>
</Input>
</View>

<View style={{margin:8, gap:6}}>
  <Text style={{color:"white", fontFamily:'OpenSans-Regular'}}>{translations.descriptionTextarea.label[selectedLanguage]}:</Text>
<Textarea borderRadius="$sm">
<TextareaInput fontFamily='OpenSans-Regular' color='white' onChangeText={setDescription} value={description}/>
</Textarea>
</View>

<Button titleStyle={{fontFamily:"OpenSans-Bold"}} onPress={handleUpdate} buttonStyle={{backgroundColor:accColor, margin:24}} radius="lg">
  {translations.updateBtn[selectedLanguage]}
</Button>

</>}
    </ScrollView>
    {isPending && <Loader/>}
    </>
  )
}

export default EditBook