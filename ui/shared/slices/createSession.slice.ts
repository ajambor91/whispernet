import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PeerRole} from "../enums/peer-role.enum";
import {ISession} from "../models/ws-message.model";
import {b} from "vite/dist/node/types.d-aGj9QkWt";

export interface IPeerState {
    sessionToken: string | null;
    peerRole: PeerRole | null;
    secretKey: string | null;
    isSigned?: boolean;

}

const initialState: IPeerState = {
    sessionToken: null,
    peerRole: null,
    secretKey: null,
    isSigned: false
}

export const createPeerStateSlice = createSlice({
    name: 'createChat',
    initialState,
    reducers: {
        setCreatePeerState: (state, action: PayloadAction<IPeerState>) => {
            state.sessionToken = action.payload.sessionToken;
            state.peerRole = action.payload.peerRole;
            state.secretKey = action.payload.secretKey;
            state.isSigned = action.payload.isSigned;
        }
    }
});

export const {setCreatePeerState} = createPeerStateSlice.actions;
export default createPeerStateSlice.reducer;
