import { useState } from 'react';

import {
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  CheckIcon,
  Input,
  InputField,
  ScrollView,
} from '@gluestack-ui/themed';
import { Button } from '@rneui/themed';
import { useTheme } from '@ui-kitten/components';

import { accColor } from '../../../assets/ColorsImport';
import formsTranslations
  from '../../../assets/translations/FormsTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';

const ReaderStateScreen = ({route, navigation}) => {
const {readerData, pagesAmount, bookId}=route.params;
const {user}=useAuthContext();
const theme=useTheme();
const {addToDataBase, removeFromDataBase}=useRealDatabase();
const {dispatch}=useSnackbarContext();
const addToShelf = (hasStarted, hasFinished, readPages) => {
    addToDataBase("bookReaders", `${bookId}/readers/${user.uid}`, {
      bookRate: 0,
      bookReadingId: bookId,
      displayName: user.displayName,
      email: user.email,
      hasFinished,
      id: user.uid,
      pagesRead: readPages,
      startedReading: hasStarted,
      dateOfFinish: hasFinished ? new Date().getTime() : null,
      recension: "",
      photoURL: user.photoURL,
    });
  };
  
  const selectedLanguage = useSelector(
        (state) => state.languageSelection.selectedLangugage
      );
      const [hasStarted, setHasStarted] = useState(
        readerData ? readerData.startedReading : false
      );
      const [hasFinished, setHasFinished] = useState(
        readerData ? readerData.hasFinished : false
      );
      const [readPages, setReadPages] = useState(
        readerData ? readerData.pagesRead : 0
      );
    
      const confirmForm = () => {
       if(+readPages > pagesAmount){
        dispatch({type:"SHOW_SNACKBAR", payload:{message:'Feel smart, huh?', alertType:"error"}});
    return;   
    }

    addToShelf(hasStarted, hasFinished, +readPages);
    navigation.goBack();
      };


  return (
    <ScrollView style={{backgroundColor:theme['color-basic-800']}}>
 <View style={{margin:6}}>
    <Checkbox justifyContent='space-around' onChange={(value)=>{
        setHasStarted(value);
    }} value={hasStarted} isChecked={hasStarted} aria-label={formsTranslations.hasStarted.query[selectedLanguage]} >
<CheckboxIndicator mr="$2">
    <CheckboxIcon as={CheckIcon} />
  </CheckboxIndicator>
  <CheckboxLabel color='white' maxWidth={280}>{formsTranslations.hasStarted.query[selectedLanguage]}</CheckboxLabel>
    </Checkbox>
 </View>

{hasStarted && <>
<View style={{margin:6}}>
    <Text style={{color:'white'}}>{formsTranslations.pagesAmountInput.label[selectedLanguage]}:</Text>
    <Input>
    <InputField color='white' value={`${readPages}`} onChangeText={setReadPages} type='number' keyboardType='numeric'/>
    </Input>
</View>

<View style={{margin:12}}>
<Checkbox value={hasFinished} isChecked={hasFinished} onChange={(value)=>{
     setHasFinished(value);
     console.log(value);
     if (value === true) {
       setReadPages(+pagesAmount);
     } else {
       setReadPages(0);
     }
}}>
    <CheckboxIndicator mr="$2">
    <CheckboxIcon as={CheckIcon} />
  </CheckboxIndicator>
  <CheckboxLabel color='white'>{formsTranslations.hasFinished.query[selectedLanguage]}</CheckboxLabel>
    </Checkbox>
</View>

</>}
<Button onPress={confirmForm} radius="xl" buttonStyle={{margin:8, backgroundColor:accColor}}>{formsTranslations.finishText[selectedLanguage]}</Button>
    </ScrollView>
  )
}

export default ReaderStateScreen