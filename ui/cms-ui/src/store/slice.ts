import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ELang} from "@/enums/lang.enum";


export interface IAppSettingsState  {
    lang: ELang;
}
const initialState: IAppSettingsState = {
    lang: ELang.EN
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
