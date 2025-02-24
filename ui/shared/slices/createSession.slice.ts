import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PeerRole} from "../enums/peer-role.enum";
import {EPGPAuthStatus} from "../enums/pgp-auth-status.enum";

export interface IPeerState {
    sessionToken: string | null;
    peerRole: PeerRole | null;
    secretKey: string | null;
    isSigned?: boolean;
    sessionAuthType?: EPGPAuthStatus;

}

const initialState: IPeerState = {
    sessionToken: null,
    peerRole: null,
    secretKey: null,
    isSigned: false,
    sessionAuthType: EPGPAuthStatus.UNSIGNED
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
            state.sessionAuthType = action.payload.sessionAuthType;
        }
    }
});

export const {setCreatePeerState} = createPeerStateSlice.actions;
export default createPeerStateSlice.reducer;
