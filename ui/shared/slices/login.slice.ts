import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IInitializedLoginResponse} from "../models/initialized-login-response.model";

export interface ILoginState {
    username: string | null;
    message: string | null;
    signedMessage: string | null;

}

const initialState: ILoginState = {
    username: null,
    message: null,
    signedMessage: null
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        },
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        setSignedMessage: (state, action: PayloadAction<string>) => {
            state.signedMessage = action.payload;
        },
        setInitialLoginData: (state, action: PayloadAction<IInitializedLoginResponse>) => {
            state.message = action.payload.message;
            state.username = action.payload.username;
        }
    }
});

export const {setMessage,setUsername, setInitialLoginData,setSignedMessage } = loginSlice.actions;
export default loginSlice.reducer;
