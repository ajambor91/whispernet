import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PeerRole} from "../enums/peer-role.enum";
import {ISession} from "../models/ws-message.model";

export interface IPeerState {
    sessionToken: string | null;
    peerRole: PeerRole | null;
    secretKey: string | null;

}

const initialState: IPeerState = {
    sessionToken: null,
    peerRole: null,
    secretKey: null
}

export const createPeerStateSlice = createSlice({
    name: 'createChat',
    initialState,
    reducers: {
        setCreatePeerState: (state, action: PayloadAction<IPeerState>) => {
            state.sessionToken = action.payload.sessionToken;
            state.peerRole = action.payload.peerRole;
            state.secretKey = action.payload.secretKey;
        }
    }
});

export const {setCreatePeerState} = createPeerStateSlice.actions;
export default createPeerStateSlice.reducer;
