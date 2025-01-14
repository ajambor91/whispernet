import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IInitializedLoginResponse} from "../models/initialized-login-response.model";

export interface IISLoginState {
    username: string | null;
    message: string | null;
    isLogin: boolean;

}

const initialState: IISLoginState = {
    username: null,
    message: null,
    isLogin: false
}

export const isLoginSlice = createSlice({
    name: 'isLogin',
    initialState,
    reducers: {
        setLoginData: (state, action: PayloadAction<IISLoginState>) => {
            state.message = action.payload.message;
            state.username = action.payload.username;
            state.isLogin = action.payload.isLogin;
        }
    }
});

export const {setLoginData } = isLoginSlice.actions;
export default isLoginSlice.reducer;
