import { Snackbar } from 'react-native-paper';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import {
  darkRed,
  spotify,
} from '../../assets/ColorsImport';
import { useSnackbarContext } from '../../hooks/useSnackbarContext';

const SnackbarAlert = ({snackbarText, snackbarType, visible}) => {
const appropriateStyles=snackbarType==="error" ? {backgroundColor:darkRed, fontFamily:"Inter-Black"} : {backgroundColor:spotify,fontFamily:"Inter-Black"}
const {dispatch}=useSnackbarContext();
return (
<Snackbar 
action={{
  label:"Close",
  labelStyle:{color:"white", fontFamily:"Inter-Black"},
  onPress:()=>{
    dispatch({type:"CLOSE_SNACKBAR"});
  },
  icon: ()=>(<FontAwesome name='close' size={16} color="white"/>)
}} style={appropriateStyles} duration={1500} visible={visible} onDismiss={()=>(
  dispatch({type:"CLOSE_SNACKBAR"}))}>
  {snackbarText}
</Snackbar>
  )
}

export default SnackbarAlert