import {
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import {
  Input,
  InputField,
} from '@gluestack-ui/themed';

import translations from '../../assets/translations/FormsTranslations.json';
import CountryPhoneSelection from '../CountryList/CountryPhoneSelection';

const CountryPhoneInput = ({selectCountry, validation, setSelectCountry,country, select,textNumber,setTextNumber }) => {
 const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
 
  return (
    <View style={{margin:4}}>
      <Text style={{color:"white", fontFamily:"Inter-Black"}}>
       {translations.signingOptions.phone[selectedLanguage]}
      </Text>
  <View style={{flexDirection:"row", justifyContent:"space-around", margin:10, alignItems:"center"}}>
  <CountryPhoneSelection setSelected={(ctry)=>{
    select(ctry);
  }} setOpen={()=>{
    setSelectCountry(true);
  }} setClose={()=>{
      setSelectCountry(false);
    }} open={selectCountry} countryNumber={country}  />
    <Input width={270}>
    <InputField color='white' fontFamily='OpenSans-Regular' placeholder={translations.signingOptions.phone[selectedLanguage]} keyboardType='phone-pad' autoComplete='tel' onChangeText={(value)=>{
      setTextNumber(value);
      validation();
    }}/>
    </Input>
  </View>



  </View>
  )
}

export default CountryPhoneInput