import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface WSessiontate  {
    wSession: string | null;
}

const initialState: WSessiontate = {
    wSession: null
}

export const wSessionSlice = createSlice({
    name: 'wSession',
    initialState,
    reducers: {
        setWSession: (state, action: PayloadAction<any>) => {
            state.wSession = action.payload;
        }
    }
});

export const {setWSession} = wSessionSlice.actions;
export default wSessionSlice.reducer;

