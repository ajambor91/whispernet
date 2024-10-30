// import {WebRTCIceCandidate, WebRTCSessionDescription} from "../models/webrtc.interface";
// import {ConnectionStage, ConnectionState} from "../models/webrtc-state.model";
//
//
// export type ConnectionSessionManager = {
//     getOffer: () => WebRTCSessionDescription | null,
//     setOffer: (offer: WebRTCSessionDescription) => void,
//     getAnswer: () => WebRTCSessionDescription | null,
//     setAnswer: (answer: WebRTCSessionDescription) => void,
//     setIceCandidates: (iceCandidates: WebRTCIceCandidate[]) => void,
//     getIceCandidates: () => WebRTCIceCandidate[],
//     addIceCandidate: (iceCandidate: WebRTCIceCandidate) => void,
//     getStage: () => 'answer' | 'offer' | 'ice' | null
// }
// export const connectionSessionMap: Map<string, ConnectionSessionManager> = new Map();
//
// export const createConnectionSessionManager = (): ConnectionSessionManager => {
//     let connectionState: ConnectionState  = {
//         offer: null,
//         answer: null,
//         iceCandidates: [],
//         stage: ConnectionStage.WaitingForPeer
//     };
//
//     return {
//         addIceCandidate: (iceCandidate: WebRTCIceCandidate): void => {
//             if (!iceCandidate.sdpMid || !iceCandidate.usernameFragment || !iceCandidate.sdpMLineIndex) {
//                 throw new Error('Ice candidate data is undefined')
//             }
//             iceCandidate.unique = iceCandidate.usernameFragment + iceCandidate.sdpMid + iceCandidate.sdpMLineIndex;
//             const isExists: boolean = connectionState.iceCandidates.some(existingCandidate => existingCandidate.unique = iceCandidate.unique);
//             if (isExists) {
//                 connectionState.iceCandidates.push(iceCandidate);
//             }
//         },
//         setIceCandidates: (iceCandidates: WebRTCIceCandidate[]): void => {
//
//             const uniqueCandidates = new Set<string>();
//
//             const candidatesToSet = iceCandidates.filter(curr => {
//                 if (!curr.sdpMid || !curr.usernameFragment || !curr.sdpMLineIndex) {
//                     throw new Error('Ice candidate data is undefined')
//                 }
//                 const unique = curr.usernameFragment + curr.sdpMid + curr.sdpMLineIndex;
//                 if (!uniqueCandidates.has(unique)) {
//                     uniqueCandidates.add(unique);
//                     return true;
//                 }
//                 return false;
//             });
//             connectionState.iceCandidates.push(...candidatesToSet);
//         },
//         getIceCandidates: () => connectionState.iceCandidates,
//         setAnswer: (answer: WebRTCSessionDescription) => {
//             connectionState.answer = answer;
//             connectionState.stage = 'answer';
//         },
//         getAnswer: () => connectionState.answer,
//         setOffer: (offer: WebRTCSessionDescription) => {
//             connectionState.offer = offer;
//             connectionState.stage = 'offer';
//         },
//         getOffer: () => connectionState.offer,
//         getStage: () => connectionState.stage
//     };
// };
//
// export const getConnectionSessionManager = (session: string): ConnectionSessionManager => {
//     let manager: ConnectionSessionManager | undefined = connectionSessionMap.get(session);
//     if (!manager) {
//         manager = createConnectionSessionManager();
//         connectionSessionMap.set(session, manager)
//     }
//     return manager;
// }