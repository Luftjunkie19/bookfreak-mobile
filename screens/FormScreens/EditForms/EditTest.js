import React, {
  useEffect,
  useState,
} from 'react';

import { randomUUID } from 'expo-crypto';
import {
  Dimensions,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import {
  Input,
  InputField,
  ScrollView,
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
import translations
  from '../../../assets/translations/BookPageTranslations.json';
import formTranslations
  from '../../../assets/translations/FormsTranslations.json';
import Loader from '../../../components/Loader';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useFormRealData } from '../../../hooks/useFormRealData';
import useGetDocuments from '../../../hooks/useGetDocuments';
import { useRealDatabase } from '../../../hooks/useRealDatabase';

const EditTest = ({ route,navigation }) => {
  const { id } = route.params;
  const alphabet = require('alphabet');
  const {user}=useAuthContext();
  const [isPending, setIsPending]=useState(false);
  const { updateDatabase } = useRealDatabase();
  const { document } = useFormRealData("tests", id);
  const [data, setData] = useState(null);
  const [testName, setTestName] = useState(null);
  const [refersToBook, setRefersToBook] = useState(null);
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState({
    question: "",
    correctAnswer: null,
    possibleAnswers: [
      { label: 1, answer: "", id: `question1${randomUUID()}` },
      { label: 2, answer: "", id: `question2${randomUUID()}` },
    ],
    queryId: `query${randomUUID()}`,
  });
  const { documents: books } = useGetDocuments('books');
  const [createNewQuery, setCreateNewQuery] = useState(false);
  const isDarkMode = useSelector((state) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  useEffect(() => {
    if (document) {
      if(document.createdBy.id === user.uid){
        setData(document);
        setTestName(document.testName);
        setRefersToBook(document.refersToBook);
        setQueries(Object.values(document.queries));
      } else {
            navigation.navigate('HomeScreen');
      }
    }
  }, [document]);

  const setSelectedBook = (value) => {
    setRefersToBook(value);
  };

  const handleNewQuestionChange = (field, value) => {
    setNewQuery(prevQuery => ({
      ...prevQuery,
      [field]: value
    }));
  };

  const handleNewAnswerChange = (answerId, value) => {
    setNewQuery(prevQuery => ({
      ...prevQuery,
      possibleAnswers: prevQuery.possibleAnswers.map(answer => {
        if (answer.id === answerId) {
          return { ...answer, answer: value };
        }
        return answer;
      })
    }));
  };

  const removeNewAnswer = (answerId) => {
    setNewQuery(prevQuery => ({
      ...prevQuery,
      possibleAnswers: prevQuery.possibleAnswers.filter(answer => answer.id !== answerId)
    }));
  };

  const removeQuestion = (id) => {
    setQueries(queries => queries.filter(q => q.queryId !== id));
  };

  const enableCreating = () => {
    setCreateNewQuery(!createNewQuery);
  };

  const handleAnswerClick = (label) => {
    setNewQuery((prevQuery) => ({
      ...prevQuery,
      correctAnswer: prevQuery.correctAnswer === label ? null : label,
    }));
  };

  const updateTest = () => {
    setIsPending(true);
    updateDatabase({...data, testName, queries, refersToBook}, "tests", id);

    queries.map((query, i) =>
      query.possibleAnswers.map((answer) =>
        updateDatabase(
          {
            ...answer,
            queryId: query.queryId,
          },
          "tests",
          `${id}/answers/${query.queryId}/${answer.label}`
        )
      )
    );

    setIsPending(false);
    navigation.navigate('HomeScreen');
  };

  const theme = useTheme();

  return (
    <>
    <ScrollView style={{ backgroundColor: theme['color-basic-800'] }}>
      {data && (
        <View>
          <Text style={{color:"white", textAlign:"center",padding:12, fontSize:20, letterSpacing:1}}>
            {formTranslations.topText.tests[selectedLanguage]}
          </Text>

          <View style={{ gap: 24, margin: 8 }}>
            <View>
              <Text style={{color:"white"}}>
                {formTranslations.testFields.testName.label[selectedLanguage]}
              </Text>
              <Input variant='rounded'>
                <InputField  color='white' placeholder={
                  formTranslations.testFields.testName.placeholder[
                    selectedLanguage
                  ]
                } value={testName}
                  onChangeText={(val) => {
                    setTestName(val);
                  }} />
              </Input >
            </View>

            {books.length > 0 && (
              <Select>
                <SelectTrigger>
                  <SelectInput color='white' value={refersToBook.title ? refersToBook.title : refersToBook} placeholder={
                    formTranslations.testFields.bookSelection[
                      selectedLanguage
                    ]
                  } />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {books && books.map((bookItem) => (<SelectItem onPress={() => {
                      setSelectedBook(bookItem);
                    }} value={bookItem} label={bookItem.title} />))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8,margin:6 }}>
            <Button radius='md' onPress={enableCreating}>
              {
                formTranslations.testFields.buttonText.addNewQuery[
                selectedLanguage
                ]
              }
            </Button>
            {Object.values(data.queries).length > 1 && (
              <Button radius='md' onPress={updateTest}>
                {formTranslations.updateBtn[selectedLanguage]}
              </Button>
            )}
          </View>
        </View>
      )}

      {data && (
        <View>
          {createNewQuery && (
            <View>
              <View style={{margin:8, gap:6}}>
                <Text style={{color:'white'}}>
                  {formTranslations.testFields.questionLabel[selectedLanguage]}
                </Text>
                <Input>
                  <InputField color='white' value={newQuery.question} onChangeText={(value) => handleNewQuestionChange('question', value)} />
                </Input>
              </View>

              <View style={{margin:6}}>
                <Text style={{color:'white', fontFamily:"Inter-Black"}}>
                  {
                    formTranslations.testFields.possibleAnswers[
                    selectedLanguage
                    ]
                  }
                  
                </Text>
                <View>
                  {newQuery.possibleAnswers.map((posAnswer) => (
                    <Button type="clear" onPress={() => handleAnswerClick(posAnswer.id)} buttonStyle={{width:Dimensions.get('screen').width, backgroundColor:newQuery.correctAnswer === posAnswer.id ? 'rgb(34 197 94)' : "transparent", borderRadius:6}}>
                      <View key={posAnswer.id} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24, margin: 4 }} >
                        <Text style={{ fontFamily: "Inter-Black", color: "white" }}>{alphabet.lower[posAnswer.label - 1]}</Text>
                        <Input variant='rounded' minWidth={260} maxWidth={300}>
                          <InputField  backgroundColor={modalAccColor} color='white' fontFamily='Inter-Black' key={posAnswer.id}
                            value={posAnswer.answer}
                            onChangeText={(value) => handleNewAnswerChange(posAnswer.id, value)} />
                        </Input>
                        <Button  type="clear" icon={{
                          name: 'trash',
                          type: 'font-awesome',
                          size: 24,
                          color: 'red',
                        }}
                          onPress={() => {
                            removeNewAnswer(posAnswer.id);
                          }}></Button>
                      </View>
                    </Button>


                  ))}
                  <Button
                    radius='xl'
                     titleStyle={{fontFamily:"OpenSans-Bold"}}
                  buttonStyle={{ alignSelf:"center", minWidth:240, maxWidth:300, margin:6}}
                    onPress={() => {
                      setNewQuery((query) => {
                        const newPossibleAnswers = [
                          ...query.possibleAnswers,
                          {
                            label: query.possibleAnswers.length + 1,
                            answer: "",
                            id:
                              `answer${query.possibleAnswers.length + 1}${randomUUID()}`
                            ,
                          },
                        ];
                        return {
                          ...query,
                          possibleAnswers: newPossibleAnswers,
                        };
                      });
                    }}
                  >
                    {
                      formTranslations.testFields.buttonText.anotherQuestion[
                      selectedLanguage
                      ]
                    }
                  </Button>
                </View>
              </View>
              <Button
                radius='xl'
                titleStyle={{fontFamily:"OpenSans-Bold"}}
              buttonStyle={{margin:16, minWidth:300, maxWidth:350, alignSelf:"center"}}
                onPress={() => {
                  if (
                    newQuery.possibleAnswers.filter(
                      (answer) => answer.answer.trim() === ""
                    ).length > 0
                  ) {
                    return;
                  }

                  if (!newQuery.correctAnswer) {
                    return;
                  }

                  if (newQuery.question.trim() === "") {
                    return;
                  }
                  setData((data) => {
                    data.queries = [...Object.values(data.queries), newQuery];
                    return data;
                  });
                  if (
                    Object.values(data.queries).find(
                      (q) => q.queryId === newQuery.queryId
                    )
                  ) {
                    let queryExisted = Object.values(data.queries).find(
                      (q) => q.queryId === newQuery.queryId
                    );

                    queryExisted = newQuery;

                    setQueries((prevData)=>{
                      const newArr = prevData.filter(
                        (q) => q.queryId !== newQuery.queryId
                      );
                      prevData=[...newArr, queryExisted];
                      return prevData;
                    })

              
                    setCreateNewQuery(false);
                    setNewQuery({
                      question: "",
                      correctAnswer: null,
                      possibleAnswers: [
                        { label: 1, answer: "", id: `answer1${randomUUID()}` },
                        { label: 2, answer: "", id: `answer2${randomUUID()}` },
                      ],
                      queryId: `${`query${Object.values(data.queries).length}${randomUUID()}`}`
                    });
                  } else {
                    setCreateNewQuery(false);
                    setQueries((prevData)=>{
                      return [...prevData, newQuery];
                    });
                    setNewQuery({
                      question: "",
                      correctAnswer: null,
                      possibleAnswers: [
                        { label: 1, answer: "", id: `answer1${randomUUID()}` },
                        { label: 2, answer: "", id: `answer2${randomUUID()}` },
                      ],
                      queryId: `${randomUUID()}query${Object.values(data.queries).length}`,
                    });
                  }
                }}
              >
                {
                  formTranslations.testFields.buttonText.createBtn[
                  selectedLanguage
                  ]
                }
              </Button>
            </View>
          )}
        </View>
      )}

<Text style={{color:'white', fontFamily:"Inter-Black", fontSize:20, margin:6}}>{formTranslations.queries[selectedLanguage]}</Text>
      {data && queries.length > 0 && (
        <ScrollView scrollEnabled showsVerticalScrollIndicator={false} maxHeight={400} style={{paddingHorizontal:16}} contentContainerStyle={{gap:8}}>
          {queries.map((query) => (
            <View style={{backgroundColor:accColor, gap:8, padding:6, borderRadius:8}}>
              <View style={{ flexDirection: "row", alignSelf: "flex-end", gap: 8, margin: 2}}>
                <Button
                  type='clear'
                  titleStyle={{fontSize:14, color:"white"}}
                  iconRight
                  icon={{type:"material-community", name:"pencil", color:'lightblue', size:16}}
                  onPress={() => {
                    setNewQuery(query);
                    enableCreating();
                  }}
                >
                  {translations.buttonsTexts.edit[selectedLanguage]}{" "}
                </Button>
                <Button
                titleStyle={{fontSize:14,color:'red'}}
                iconRight
                icon={{type:"material-community", name:'close-circle', size:16, color:"red"}}
                  type='clear'
                  color="error"
                  onPress={() => {
                    removeQuestion(query.queryId);
                  }}
                >
                  {translations.buttonsTexts.delete[selectedLanguage]}{" "}
                </Button>
              </View>
              <Text style={{fontSize:14, fontFamily:"Inter-Black", color:'white'}}>{query.question}</Text>
              <View style={{flexDirection:"row", flexWrap:"wrap", gap:24, margin:4}}>
                {query.possibleAnswers.map((answer) => (
                  <View style={{backgroundColor:primeColor, padding:8, borderRadius:8}}>
                      <Text style={{color:"white", fontFamily:"Inter-Black", fontSize:12}}>{alphabet.lower[answer.label - 1]}. {answer.answer}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </ScrollView>
    {isPending && <Loader/>}
    </>
  )
}

export default EditTest;
