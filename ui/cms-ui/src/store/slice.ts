import {createSlice, PayloadAction} from '@reduxjs/toolkit';


export interface IAppSettingsState  {
    lang: string;
}
const initialState: IAppSettingsState = {
    lang: 'en'
}
export const appSlice = createSlice({
    name: 'appSlice',
    initialState,
    reducers: {
        setLang: (state, action: PayloadAction<IAppSettingsState>) => {
            state.value = action.payload.lang;
        },
    },
});

export const { setLang } = appSlice.actions;

export default appSlice.reducer;
