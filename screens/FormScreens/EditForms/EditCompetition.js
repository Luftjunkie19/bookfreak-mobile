import React, {
  useEffect,
  useState,
} from 'react';

import {
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import {
  Button,
  ButtonText,
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
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import {
  Datepicker,
  useTheme,
} from '@ui-kitten/components';

import {
  accColor,
  modalAccColor,
  primeColor,
} from '../../../assets/ColorsImport';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import formTranslations
  from '../../../assets/translations/FormsTranslations.json';
import Loader from '../../../components/Loader';
import { useFormRealData } from '../../../hooks/useFormRealData';
import { useRealDatabase } from '../../../hooks/useRealDatabase';
import { useSnackbarContext } from '../../../hooks/useSnackbarContext';

const EditCompetition = ({route, navigation}) => {
const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
  const competitionTypes = [
    { value: "First read, first served", label: formTranslations.competitionTypes.first[selectedLanguage] },
    {
      value: "Lift others, rise",
      label: formTranslations.competitionTypes.second[selectedLanguage],
    },
    { value: "Teach to fish", label: formTranslations.competitionTypes.third[selectedLanguage] },
  ];

  const {id}=route.params;
  const {document}=useFormRealData('competitions', id);
  const [error, setError] = useState(null);
const [isPending, setIsPending]=useState(false);
const [title, setTitle]=useState(null);
const [competitionsType, setCompetitionsType]=useState(null);
const [expirationTime, setExpirationTime]=useState(null);
const [description, setDescription]=useState(null);
const {dispatch}=useSnackbarContext();
const {updateDatabase}=useRealDatabase();
useEffect(()=>{
  if(document){
    if (document.createdBy.id === user.uid) {
      setTitle(document.competitionTitle);
      setCompetitionsType(document.competitionsName);
      setExpirationTime(new Date(document.expiresAt));
      setDescription(document.description);
    } else {
      navigation.navigate('HomeScreen');
    }
  }
},[document])

const editCompetition = async () => {
  setError(null);
  setIsPending(true);

  if (!expirationTime || expirationTime - new Date().getTime() <= 0) {
    dispatch({type:"SHOW_SNACKBAR", payload:{message:alertMessages.notifications.wrong.earlyDate[selectedLanguage], alertType:"error"}})
    return;
  }

  updateDatabase(
    {
      ...document,
      competitionTitle: title,
      competitionsName: competitionsType,
      description: description,
      expiresAt: new Date(expirationTime).getTime(),
    },
    "competitions",
    id
  );

  setError(null);
  setIsPending(false);
 dispatch({type:"SHOW_SNACKBAR", payload:{message:alertMessages.notifications.successfull.update[selectedLanguage], alertType:"success"}});
 navigation.navigate('HomeScreen');
};

const theme=useTheme();

  return (
    <>
    <View style={{backgroundColor:theme['color-basic-800'], flex:1}}>
     {document && <>
<View style={{margin:6, gap:6}}>
          <Text style={{ color: "white", fontFamily:"OpenSans-Bold" }}>{formTranslations.bookTitleInput.label[selectedLanguage]}:</Text>
  <Input variant='rounded'>
  <InputField fontFamily='OpenSans-Regular' color='white' onChangeText={setTitle} value={title}/>
  </Input>
</View>

<View style={{margin:6, gap:6}}>
  <Text style={{color:"white", fontFamily:"OpenSans-Bold"}}>{formTranslations.competitionCategory.label[selectedLanguage]}:</Text>
  <Select>
    <SelectTrigger>
      <SelectInput fontFamily='OpenSans-Bold' value={competitionsType} backgroundColor={modalAccColor} color='white'  />
    </SelectTrigger>
    <SelectPortal>
      <SelectBackdrop />
      <SelectContent>
        <SelectDragIndicatorWrapper>
          <SelectDragIndicator />
        </SelectDragIndicatorWrapper>
     {competitionTypes.map((itemData)=>(<SelectItem onPress={()=>setCompetitionsType(itemData.value)} label={itemData.label} value={itemData.value}/>))}
      </SelectContent>
    </SelectPortal>
  </Select>
</View>

<View style={{margin:6, gap:6}}>
<Text style={{color:"white", fontFamily:"OpenSans-Bold"}}>{formTranslations.expirationDateInput.label[selectedLanguage]}:</Text>
<Datepicker onSelect={(date)=>{
  setExpirationTime(new Date(date).getTime());
}} value={expirationTime} min={new Date()}/>
</View>

<View style={{margin:6, gap:6}}>
  <Text style={{color:"white", fontFamily:"OpenSans-Bold"}}>{formTranslations.descriptionTextarea.label[selectedLanguage]}:</Text>
  <Textarea>
  <TextareaInput color='white' fontFamily='OpenSans-Regular' onChangeText={setDescription} value={description}/>
  </Textarea>
</View>
     </>}

     <Button onPress={editCompetition} borderRadius={16} margin={16} backgroundColor={accColor} android_ripple={{
      color:primeColor
     }}>
        <ButtonText fontFamily="OpenSans-Bold">{formTranslations.submit[selectedLanguage]}</ButtonText>
     </Button>
    </View>
    {isPending && <Loader/>}
    </>
  )
}

export default EditCompetition