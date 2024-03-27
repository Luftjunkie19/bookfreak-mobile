import 'react-native-get-random-values';

import React, { useState } from 'react';

import {
  Dimensions,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  AppOpenAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import {
  Divider,
  Input,
  InputField,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@gluestack-ui/themed';
import { Button } from '@rneui/themed';
import { useTheme } from '@ui-kitten/components';

import {
  accColor,
  modalAccColor,
  primeColor,
} from '../../../assets/ColorsImport';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import formTranslations
  from '../../../assets/translations/FormsTranslations.json';
import Loader from '../../../components/Loader';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';

const alphabet= require('alphabet');

const adUnitId = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-9822550861323688~6900348989';
const CreateTest = () => {
  const appOpenAd = AppOpenAd.createForAdRequest(adUnitId);
  const [isPending, setIsPending]=useState(false);
  const [error, setError]=useState(false);
  const { user } = useAuthContext();
  const [testName, setTestName] = useState('');
  const [refersToBook, setRefersToBook] = useState(null);
  const { addToDataBase } = useRealDatabase();
  const { documents: books } = useGetDocuments('books');
  const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState({
    question: '',
    correctAnswer: null,
    possibleAnswers: [
      { label: 1, answer: '', id: `question1${uuidv4()}` },
      { label: 2, answer: '', id: `question2${uuidv4()}` },
    ],
    queryId: `query${queries.length}${uuidv4()}`,
  });
  const [createNewQuery, setCreateNewQuery] = useState(false);
const {dispatch}=useSnackbarContext();
  const enableCreating = () => {
    setCreateNewQuery(!createNewQuery);
  };

  const handleQueryChange = (field, value) => {
    setNewQuery((prevQuery) => ({
      ...prevQuery,
      [field]: value,
    }));
  };

  const handleAnswerChange = (label, value) => {
    setNewQuery((prevQuery) => ({
      ...prevQuery,
      possibleAnswers: prevQuery.possibleAnswers.map((answer) =>
        answer.label === label ? { ...answer, answer: value } : answer
      ),
    }));
  };

  const handleAnswerClick = (label) => {
    setNewQuery((prevQuery) => ({
      ...prevQuery,
      correctAnswer: prevQuery.correctAnswer === label ? null : label,
    }));
  };

  const createNewTest = () => {
setIsPending(true);

    const testId = `Test${uuidv4()}`;

    addToDataBase('tests', testId, {
      testName: testName,
      refersToBook: refersToBook
        ? {
            id: refersToBook.id,
            title: refersToBook.title,
            author: refersToBook.author,
            photoURL: refersToBook.photoURL,
          }
        : 'No book selected',
      testId: testId,
      createdBy: {
        nickname: user.displayName,
        id: user.uid,
        photoURL: user.photoURL,
      },
      createdAt: new Date().getTime(),
    });

    queries.map((query) =>
      addToDataBase('tests', `${testId}/queries/${query.queryId}`, {
        ...query,
      })
    );

    queries.map((query, i) =>
      query.possibleAnswers.map((answer) =>
        addToDataBase(
          'tests',
          `${testId}/answers/${query.queryId}/${answer.label}`,
          {
            ...answer,
            queryId: query.queryId,
          }
        )
      )
    );

    appOpenAd.load();
    appOpenAd.show();
    setIsPending(false);
  };
  
  const theme=useTheme();
  
  return (
    <>
    <ScrollView style={{backgroundColor:theme['color-basic-800']}} >
      <View>
      <View style={{margin:6}}>
        <Text style={{fontFamily:"Inter-Black", color:"white"}}>{formTranslations.testFields.testName.label[selectedLanguage]}</Text>
        <Input variant='rounded'>
          <InputField color="$white" fontFamily='OpenSans-Regular' onChangeText={setTestName} backgroundColor={modalAccColor} placeholder={formTranslations.testFields.testName.placeholder[selectedLanguage]}/>
        </Input>
      </View>

<View style={{margin:8}}>
  <Text style={{fontFamily:"Inter-Black", color:"white"}}>{formTranslations.testFields.bookSelection[selectedLanguage]}</Text>
  <Select>
    <SelectTrigger>
      <SelectInput  value={refersToBook ? refersToBook.title : ''} backgroundColor={modalAccColor} color='white' fontFamily='OpenSans-Bold' />
    </SelectTrigger>
    <SelectPortal>
      <SelectBackdrop />
      <SelectContent>
        <SelectDragIndicatorWrapper>
          <SelectDragIndicator />
        </SelectDragIndicatorWrapper>
  {books && books.map((bookItem)=>(<SelectItem onPress={()=>{
    setRefersToBook(bookItem);
  }} value={bookItem.id} label={bookItem.title}/>))}
      </SelectContent>
    </SelectPortal>
  </Select>
</View>

<View style={{flexDirection:"row", gap:12}}>
<Button titleStyle={{fontFamily:'OpenSans-Bold'}} radius="lg" onPress={enableCreating} buttonStyle={{backgroundColor:accColor, margin:6}}>{formTranslations.testFields.buttonText.addNewQuery[selectedLanguage]}</Button>
{queries.length >= 2  && <Button titleStyle={{fontFamily:'OpenSans-Bold'}} radius="lg" onPress={createNewTest} buttonStyle={{backgroundColor:accColor, margin:6}}>{formTranslations.testFields.buttonText.createTestBtn[selectedLanguage]}</Button>}
</View>
      </View>
<Divider bgColor={primeColor} height={2}/>

{createNewQuery && <View>
  <View style={{margin:6}}>
    <Text style={{fontFamily:"Inter-Black", color:"white"}}>{formTranslations.testFields.questionLabel[selectedLanguage]}</Text>
    <Input variant="rounded">
    <InputField value={newQuery.question} backgroundColor={modalAccColor} color='white' fontFamily='OpenSans-Regular' onChangeText={(value)=>handleQueryChange("question", value)}/>
    </Input>
  </View>
<View>

<Text style={{fontFamily:"Inter-Black", color:"white"}}>{formTranslations.testFields.possibleAnswers[selectedLanguage]}</Text>
<View style={{margin:6, gap:12}}>
{newQuery.possibleAnswers.map((posAnswer)=>(
<Button onPress={() => handleAnswerClick(posAnswer.id)} type="clear" buttonStyle={{width:Dimensions.get('screen').width, backgroundColor:newQuery.correctAnswer === posAnswer.id ? 'rgb(34 197 94)' : "transparent", borderRadius:6}}>
<View key={posAnswer.id} style={{flexDirection:"row", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:24, margin:4}} >
  <Text style={{fontFamily:"Inter-Black", color:"white"}}>{alphabet.lower[posAnswer.label - 1]}</Text>
  <Input variant='rounded' minWidth={260} maxWidth={300}>
  <InputField backgroundColor={modalAccColor} color='white' fontFamily='OpenSans-Regular' value={posAnswer.answer} onChangeText={(value)=>handleAnswerChange(posAnswer.label, value)}/>
  </Input>
  <Button type="clear" icon={{
                name: 'trash',
                type: 'font-awesome',
                size: 24,
                color: 'red',
              }} 
              onPress={()=>{
    setNewQuery((query) => ({
      ...query,
      possibleAnswers: query.possibleAnswers.filter(
        (q) => q.label !== posAnswer.label
      ),
    }));
  }}></Button>
</View>
</Button>
))}
</View>

<Button radius='xl' titleStyle={{fontFamily:'OpenSans-Bold'}} buttonStyle={{backgroundColor:accColor, maxWidth:200, margin:4, gap:4}} icon={{name:"plus", type:'font-awesome', color:"white"}}   onPress={() => {
                    setNewQuery((query) => ({
                      ...query,
                      possibleAnswers: [
                        ...query.possibleAnswers,
                        {
                          label: query.possibleAnswers.length + 1,
                          answer: '',
                          id: `answer${query.possibleAnswers.length + 1}${uuidv4()}`,
                        },
                      ],
                    }));
}}>
  {formTranslations.testFields.buttonText.anotherQuestion[selectedLanguage]}
</Button>

<Button titleStyle={{fontFamily:'OpenSans-Bold'}}  radius='xl' onPress={() => {
  console.log(newQuery);
                if (
                  newQuery.possibleAnswers.some(
                    (answer) => answer.answer.trim() === ''
                  )
                ) {
                  dispatch({type:"SHOW_SNACKBAR", payload:{message:alertMessages.notifications.wrong.someFieldsEmpty[selectedLanguage], alertType:"error"}});
                  return;
                }

                if (!newQuery.correctAnswer) {
                  dispatch({type:"SHOW_SNACKBAR", payload:{message:alertMessages.notifications.wrong.noSelectedAnswer[selectedLanguage], alertType:"error"}});
                  return;
                }

                if (newQuery.question.trim() === '') {
                  dispatch({type:"SHOW_SNACKBAR", payload:{message:alertMessages.notifications.wrong.emptyQuestion[selectedLanguage], alertType:"error"}});
                  return;
                }

                setQueries((prevQueries) => {
                  const itemIndex= prevQueries.findIndex((value)=>value.queryId === newQuery.queryId);
                  let itemFound= prevQueries.find((value)=>value.queryId === newQuery.queryId);

                  if(itemFound){
                    prevQueries[itemIndex]={...newQuery};
                  return  [...prevQueries];
                  }else{
                    return [...prevQueries, {...newQuery}]
                  }

                });
                setCreateNewQuery(false);
                setNewQuery({
                  question: '',
                  correctAnswer: null,
                  possibleAnswers: [
                    { label: 1, answer: '', id: `answer1${uuidv4()}` },
                    { label: 2, answer: '', id: `answer2${uuidv4()}` },
                  ],
                  queryId: `query${queries.length}${uuidv4()}`,
                });
              }}  buttonStyle={{backgroundColor:accColor, margin:16, gap:6}} icon={{name:"plus", type:'font-awesome', color:"white"}}>
  {formTranslations.testFields.buttonText.createBtn[selectedLanguage]}
</Button>

</View>

  </View>}

<ScrollView style={{maxHeight:300}}>
{queries.length > 0 && queries.map((query)=>(<View style={{margin:6, gap:16, backgroundColor:primeColor, padding:4, paddingVertical:10, borderRadius:5}}>
<View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
<Text style={{color:"white", fontFamily:"Inter-Black"}}>{query.question}</Text>

<View style={{flexDirection:"row"}}>
<Button onPress={() => {
                    setNewQuery(query);
                    enableCreating();
                  }} type='clear' icon={{
                name: 'pencil',
                type: 'font-awesome',
                size: 20,
                color: 'lightblue',
              }}>
  
  </Button>  

<Button onPress={()=>{
    setQueries((quers) =>
    quers.filter((quer) => quer.queryId !== query.queryId)
  );
}} type='clear' icon={{
                name: 'trash',
                type: 'font-awesome',
                size: 20,
                color: 'red',
              }}></Button>
</View>
</View>


<View style={{flexDirection:"row", flexWrap:"wrap", gap:10, margin:5}}>
  {query.possibleAnswers.map((answer)=>(<View style={{flexDirection:"row", gap:16, backgroundColor:accColor, padding:6, borderRadius:5}}>
<Text style={{color:"white", fontFamily:"Inter-Black"}}>{alphabet.lower[answer.label - 1]}</Text>
<Text style={{color:"white", fontFamily:"Inter-Black"}}>{answer.answer}</Text>
  </View>))}
</View>
</View>))}

</ScrollView>
    </ScrollView>
    {isPending && <Loader/>}
    </>
  )
}

export default CreateTest