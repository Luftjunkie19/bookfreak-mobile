import {
  Text,
  View,
} from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { useSelector } from 'react-redux';

import {
  Input,
  InputField,
} from '@gluestack-ui/themed';
import { Button } from '@ui-kitten/components';

import translations from '../../assets/translations/FormsTranslations.json';

const CountryPhoneInput = ({selectCountry, validation, setSelectCountry,country, setCountry,textNumber,setTextNumber }) => {
 const selectedLanguage=useSelector((state)=>state.languageSelection.selectedLangugage);
 
  return (
    <View style={{margin:4}}>
      <Text style={{color:"white", fontFamily:"Inter-Black"}}>
       {translations.signingOptions.phone[selectedLanguage]}
      </Text>
  <View style={{flexDirection:"row", justifyContent:"space-around", margin:10, alignItems:"center"}}>
    <Button style={{borderWidth:2, borderRadius:6, borderColor:"white"}} onPress={()=>{
      setSelectCountry(true);
    }}>
    <View style={{padding:10}}>
      <Text style={{fontWeight:"800", fontSize:20, color:"white"}}>{country ? country.dial_code : "+?"}</Text>
    </View>
    </Button>
    <Input width={270}>
    <InputField color='white' fontFamily='OpenSans-Regular' placeholder={translations.signingOptions.phone[selectedLanguage]} keyboardType='phone-pad' autoComplete='tel' onChangeText={(value)=>{
      setTextNumber(value);
      validation();
    }}/>
    </Input>
  </View>

  <CountryPicker popularCountries={["PL"]} enableModalAvoiding  show={selectCountry}  pickerButtonOnPress={(value)=>{
    console.log(value);
    setCountry(value);
    setSelectCountry(false);
  }}/>
  </View>
  )
}

export default CountryPhoneInput