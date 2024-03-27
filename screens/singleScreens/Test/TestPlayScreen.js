import { useState } from 'react';

import {
  Text,
  View,
} from 'react-native';
import {
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

import { Button } from '@rneui/themed';
import { useTheme } from '@ui-kitten/components';

import { accColor } from '../../../assets/ColorsImport';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useGetDocument from '../../../hooks/useGetDocument';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-9822550861323688~6900348989';

const interstitial = InterstitialAd.createForAdRequest(adUnitId);

const TestPlayScreen = ({route, navigation}) => {


  const alphabet = require('alphabet');
  const {testId, startTime, attemptId}=route.params;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [accquiredPoints, setAccquiredPoints] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { addToDataBase } = useRealDatabase();
  const {document:test}=useGetDocument('tests', testId);
  const {dispatch} = useSnackbarContext();
const {user}=useAuthContext();
  const checkIfCorrect = (chosenId, correctId) => {
    if (chosenId === correctId) {
      setAccquiredPoints((points) => {
        return points + 1;
      });
      dispatch({type:"SHOW_SNACKBAR", payload:{message:"Success", alertType:"success"}});
    } else {
      dispatch({type:"SHOW_SNACKBAR", payload:{message:"Wrong", alertType:"error"}});
    }
  };

  const pushToNextQuestion = (queriesAmount) => {
    if (queriesAmount - 1 > currentQuestion) {
      setCurrentQuestion((curQuestion) => {
        return curQuestion + 1;
      });
      setSelectedAnswer(null);
    }
  };



  const finishTest = () => {
    addToDataBase("tests", `${testId}/attempts/${attemptId}`, {
      id: attemptId,
      testId,
      startTime: new Date(Number.parseFloat(startTime)).toGMTString(),
      endTime: new Date().toGMTString(),
      finalResult: (accquiredPoints / Object.values(test.queries).length) * 100,
      timeOfGame: new Date().getTime() - startTime,
      player: {
        nickname: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      },
    });
    setSelectedAnswer(null);
    setAccquiredPoints(0);
    setCurrentQuestion(0);
    interstitial.load();
    if(interstitial.loaded){
      interstitial.show();
    }
    navigation.goBack();
  };


const theme=useTheme();
  return (
    <View style={{backgroundColor:theme['color-basic-800'], flex:1}}>
      {test && (
        <>
        <View style={{flexDirection:"row", justifyContent:"space-between", padding:6}}>
            <Text style={{color:"white", fontFamily:"Inter-Black"}}>
              Question: {currentQuestion + 1}/
              {Object.values(test.queries).length}
            </Text>

            <Text style={{color:"white", fontFamily:"Inter-Black"}}>
              Correct answers:{" "}
              <Text>
              {accquiredPoints}/
              {Object.values(test.queries).length}

              </Text>
            </Text>

        </View>
      
<View style={{ gap:20, padding:8}}>
<Text style={{fontSize:18, textAlign:"center", color:"white", fontFamily:"Inter-Black"}}>
              {Object.values(test.queries)[currentQuestion].question}
            </Text>

<View style={{gap:24}}>
{Object.values(test.answers)
                .flat()
                .filter(
                  (answer) =>
                    answer.queryId ===
                    Object.values(test.queries)[currentQuestion].queryId
                )
                .map((answer) => (
                  <Button
                  radius='lg'
                  disabled={selectedAnswer !==null}
                  disabledTitleStyle={[selectedAnswer !== null && answer.id === Object.values(test.queries)[currentQuestion].correctAnswer
                    ? { color: 'black' }
                    : selectedAnswer !== null && selectedAnswer === answer.id
                      ? { color: 'white' }
                      : {color: 'white'}]}
                      
disabledStyle={[selectedAnswer !== null && answer.id === Object.values(test.queries)[currentQuestion].correctAnswer
  ? { backgroundColor: '#00FF00' }
  : selectedAnswer !== null && selectedAnswer === answer.id
    ? { backgroundColor: '#FF0000' }
    : {backgroundColor: accColor}]}
                    buttonStyle={
                      {backgroundColor: accColor}
                    }
                    titleStyle={{color:"white", fontFamily:"Inter-Black"}}
                    onPress={() => {
                      setTimeout(() => {
                        setSelectedAnswer(answer.id);
                        checkIfCorrect(
                          answer.id,
                          Object.values(test.queries)[currentQuestion]
                            .correctAnswer
                        );
                      }, 1000);
                    }}
                  >
        {alphabet.lower[answer.label - 1]}. {answer.answer}
                  </Button>
                ))}

</View>
              

</View>
         
    

            {selectedAnswer !== null &&
              currentQuestion !== Object.values(test.queries).length - 1 && (
                <Button
                containerStyle={{margin:16}}
                radius='lg'
          
                  onPress={() => {
                    pushToNextQuestion(Object.values(test.queries).length);
                  }}
  
                >
                  Next Query
                </Button>
              )}
            {currentQuestion === Object.values(test.queries).length - 1 &&
              selectedAnswer !== null && (
                <Button
                containerStyle={{margin:16}}
                radius='lg'
                onPress={finishTest}
                >
                  Finish
                </Button>
              )}
        </>
      )}
    </View>
  )
}

export default TestPlayScreen