import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface SessionApiState {
    sessionToken: string | null;
    error: string | null;
    loading: boolean;
}

const initialState: SessionApiState = {
    sessionToken: null,
    error: null,
    loading: false
}

export const createSessionSlice = createSlice({
    name: 'createChat',
    initialState,
    reducers: {
        setCreateSession: (state, action: PayloadAction<SessionApiState>) => {
            state.sessionToken = action.payload.sessionToken;
            state.loading = action.payload.loading;
            state.error = action.payload.error;
        }
    }
});

export const {setCreateSession} = createSessionSlice.actions;
export default createSessionSlice.reducer;
