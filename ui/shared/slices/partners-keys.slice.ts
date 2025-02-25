import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface IPartner {
    username: string;
    publicKey: string;
}

export interface IPartners {
    partners: IPartners[]

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
    }
});

export const {addPartners} = partnersSlice.actions;
export default partnersSlice.reducer;
