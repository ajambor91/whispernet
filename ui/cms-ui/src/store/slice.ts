import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ELang} from "@/enums/lang.enum";


export interface IAppSettingsState  {
    lang: ELang;
}
const initialState: IAppSettingsState = {
    lang: ELang.EN
}
export const settings = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setLang: (state, action: PayloadAction<IAppSettingsState>) => {
            state.lang = action.payload.lang;
        },
    },
});

export const { setLang } = settings.actions;

export default settings.reducer;
