import {configureStore} from '@reduxjs/toolkit';
import peerState from "../slices/createSession.slice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import loginState from '../slices/login.slice'
import isLoginState from '../slices/is-login.slize'
import partnersState from '../slices/partners-keys.slice';

export const store = configureStore({
    reducer: {
        peerState: peerState,
        loginState: loginState,
        isLoginState: isLoginState,
        partnersState: partnersState
    }
})

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;