import { useContext } from 'react';

import { SnackbarContext } from '../context/SnackbarCxt';

export const useSnackbarContext = () => {
    const snackbarContext=useContext(SnackbarContext);

    if(!snackbarContext){
        throw new Error('Upsi, you have forgotten to add the context to the App');
    }

    return snackbarContext;
}

