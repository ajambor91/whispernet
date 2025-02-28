import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface IPartner {
    username: string;
    publicKey: string;
}

export interface IPartners {
    partners: IPartner[]

}

const initialState: IPartners = {
    partners: []
}

export const partnersSlice = createSlice({
    name: 'partnersState',
    initialState,
    reducers: {
        addPartners: (state, action: PayloadAction<IPartner[]>) => {
            state.partners = action.payload;
        },
        nullPartners: (state) => {
            state.partners = [];
        }
    }
});

export const {addPartners, nullPartners} = partnersSlice.actions;
export default partnersSlice.reducer;
