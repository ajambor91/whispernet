import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PeerRole} from "../enums/peer-role.enum";
import {ISession} from "../models/ws-message.model";

export interface IPeerState {
    session: ISession | null;
    peerRole: PeerRole | null;

}

const initialState: IPeerState = {
    session: null,
    peerRole: null
}

export const createPeerStateSlice = createSlice({
    name: 'createChat',
    initialState,
    reducers: {
        setCreatePeerState: (state, action: PayloadAction<IPeerState>) => {
            state.session = action.payload.session;
            state.peerRole = action.payload.peerRole;
        }
    }
});

export const {setCreatePeerState} = createPeerStateSlice.actions;
export default createPeerStateSlice.reducer;
