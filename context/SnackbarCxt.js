import {
  createContext,
  useReducer,
} from 'react';

export const SnackbarContext=createContext();

export const snackbarReducer=(state, action)=>{
    switch(action.type){
        case 'SHOW_SNACKBAR':{
            return {...state, isOpen: true , message : action.payload.message, alertType:action.payload.alertType};
        }
        case 'CLOSE_SNACKBAR':{
            return{...state , isOpen:false, message:'', alertType:''}
        }
        default:{
            return {isOpen:false, message:'', alertType:''}
        }
    }
}

export const SnackBarProvider=({children})=>{
    const [snackbarState, dispatch]=useReducer(snackbarReducer,{
        isOpen: false,
        message:'',
        alertType: ''
    });

    return(
        <SnackbarContext.Provider value={{...snackbarState, dispatch}}>
            {children}
        </SnackbarContext.Provider>
    )

}