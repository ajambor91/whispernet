import {WSMessage} from "../models/ws-message.model";
import {ConnectionStateModel} from "../models/connection-state.model";
import {WsMessageEnum} from '../enums/ws-message.enum'
import {ClientStatus} from "../enums/client-status.model";
import {PeerRole} from "../enums/peer-role.enum";
import {setConnectionState} from "../singleton/webrtc.singleton";

export function connectRTC(){
    const state: ConnectionStateModel = {
        peerConnection: null,
        dataChannel: null,
        role: null
    }
    const iceServers: RTCIceServer[] = []

    console.log("process.env.TURN_1",process.env.TURN_1)
    const handleAnswer = async (message: WSMessage, socket: WebSocket) => {
        if (state.role === PeerRole.Initiator) {
            try {
                await (state.peerConnection as RTCPeerConnection).setRemoteDescription(new RTCSessionDescription((message.answer as RTCSessionDescriptionInit)));
                (state.dataChannel as RTCDataChannel).onopen = () => {
                    setConnectionState(state);
                    const openedMsg: WSMessage = {
                        type: WsMessageEnum.Join,
                        session: message.session,
                        peerStatus: ClientStatus.Prepare,
                        remotePeerStatus: ClientStatus.Unknown
                    }
                    socket.send(createJSONString(openedMsg))
                }
                (state.peerConnection as RTCPeerConnection).onconnectionstatechange = () => {
                    if ((state.peerConnection as RTCPeerConnection).connectionState === 'failed') {
                        console.error('Połączenie WebRTC nie udało się - sprawdź konfigurację ICE.');
                    }
                };
            } catch (error) {
                console.error('Error setting remote description: ', error);
            }
        }
    }

    const createJSONString = (object: WSMessage): string => {
        if (!object) {
            throw new Error('Empty json')
        }
        return JSON.stringify(object);
    }

    // const sendOffer = async (message: WSMessage, socket: WebSocket) => {
    //     state.peerConnection = new RTCPeerConnection({iceServers});
    //     console.log(message)
    //     state.dataChannel = (state.peerConnection as RTCPeerConnection).createDataChannel("chat");
    //     const offer = await (state.peerConnection as RTCPeerConnection).createOffer();
    //     (state.peerConnection as RTCPeerConnection).onicecandidate = (event) => {
    //         if (!!event.candidate) {
    //             const iceCandidateMsg: WSMessage = {
    //                 type: WSMessageEnum.Candidate,
    //                 sessionId: message.sessionId,
    //                 candidate: event.candidate
    //             }
    //             socket.send(createJSONString(iceCandidateMsg));
    //         }
    //
    //     }
    //     await (state.peerConnection as RTCPeerConnection).setLocalDescription(offer);
    //     const WSMessage: WSMessage = {
    //         type: WSMessageEnum.Offer,
    //         offer: state.peerConnection.localDescription as RTCSessionDescriptionInit,
    //         sessionId: message.sessionId
    //     }

        // socket.send(createJSONString(WSMessage))

    // }
    //
    // const handleOffer = async (message: WSMessage, socket: WebSocket) => {
    //     state.peerConnection = new RTCPeerConnection({iceServers});
    //     await (state.peerConnection as RTCPeerConnection).setRemoteDescription(new RTCSessionDescription(message.offer as RTCSessionDescriptionInit));
    //     const answer = await (state.peerConnection as RTCPeerConnection).createAnswer();
    //     await (state.peerConnection as RTCPeerConnection).setLocalDescription(answer);
    //     (state.peerConnection as RTCPeerConnection).onicecandidate = (event) => {
    //         if (!!event.candidate) {
    //             const iceCandidateMsg: WSMessage = {
    //                 candidate: event.candidate,
    //                 type: WSMessageEnum.Candidate,
    //                 sessionId: message.sessionId
    //             }
    //             socket.send(createJSONString(iceCandidateMsg))
    //         }
    //
    //     }
    //     (state.peerConnection as RTCPeerConnection).ondatachannel = (event) => {
    //         state.dataChannel = event.channel;
    //         state.dataChannel.onopen = () => {
    //             const openedMsg: WSMessage = {
    //                 type: WSMessageEnum.Join,
    //                 sessionId: message.sessionId
    //             }
    //             setConnectionState(state)
    //             socket.send(createJSONString(openedMsg))
    //         };
    //     };
    //     const WSMessage: WSMessage = {
    //         type: WSMessageEnum.Answer,
    //         sessionId: message.sessionId,
    //         answer: (state.peerConnection as RTCPeerConnection).localDescription as RTCSessionDescriptionInit,
    //     };
    //     socket.send(createJSONString(WSMessage))
    // }
    // const sendWaitingStatus = (message: WSMessage, socket: WebSocket) => {
    //     const WSMessage: WSMessage = {
    //         type: WSMessageEnum.Waiting,
    //         sessionId: message.sessionId,
    //     }
    //     socket.send(createJSONString(WSMessage));
    // }
    //
    // const handleIceCandidate = async (message: WSMessage) => {
    //     if (message.candidate) {
    //         try {
    //             await (state.peerConnection as RTCPeerConnection).addIceCandidate(new RTCIceCandidate(message.candidate));
    //         } catch (error) {
    //             console.error('Błąd podczas dodawania kandydata ICE:', error);
    //         }
    //     }
    // };
    //
    // const getIce = (message: WSMessage, socket: WebSocket) => {
    //     const WSMessage: WSMessage = {
    //         type: WSMessageEnum.ICERequest,
    //         sessionId: message.sessionId,
    //     }
    //     socket.send(createJSONString(WSMessage));    }
    const processOffer = async (message: WSMessage, socket: WebSocket) => {
        console.log('*********************************************************', message.offer)
        console.log('*******************ICEICE********', iceServers)

        state.peerConnection = new RTCPeerConnection({iceServers});
        console.log("####################################")

        await (state.peerConnection as RTCPeerConnection).setRemoteDescription(new RTCSessionDescription(message.offer as RTCSessionDescriptionInit));
        console.log("####################################")

        const answer = await (state.peerConnection as RTCPeerConnection).createAnswer();
        await (state.peerConnection as RTCPeerConnection).setLocalDescription(answer);
        console.log("####################################")
        (state.peerConnection as RTCPeerConnection).onicecandidate = (event) => {
            if (!!event.candidate) {
                const iceCandidateMsg: WSMessage = {
                    candidate: event.candidate,
                    type: WsMessageEnum.Candidate,
                    session: message.session,
                    peerStatus: message.remotePeerStatus,
                    remotePeerStatus: message.remotePeerStatus
                }
                socket.send(createJSONString(iceCandidateMsg))
            }

        }
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

        (state.peerConnection as RTCPeerConnection).ondatachannel = (event) => {
            state.dataChannel = event.channel;
            state.dataChannel.onopen = () => {
                const openedMsg: WSMessage = {
                    type: WsMessageEnum.Answer,
                    session: message.session,
                    remotePeerStatus: message.peerStatus,
                    peerStatus: ClientStatus.Prepare
                }
                console.log(')))))))))))))))))))))))))))))))(((((((((((((((((((((((((((((((((')
                setConnectionState(state)
                socket.send(createJSONString(openedMsg))
            };
        };
        const WSMessage: WSMessage = {
            type: WsMessageEnum.Answer,
            session: message.session,
            remotePeerStatus: message.peerStatus,
            peerStatus: ClientStatus.Prepare,
            answer: (state.peerConnection as RTCPeerConnection).localDescription as RTCSessionDescriptionInit,
        };
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
        socket.send(createJSONString(WSMessage))
    }
    const handleInit = (message: WSMessage, socket: WebSocket) => {
        const WSMessage: WSMessage = {
            type: WsMessageEnum.InitAccepted,
            session: message.session,
            peerStatus: ClientStatus.Init,
            remotePeerStatus: message.remotePeerStatus,
        }
        socket.send(createJSONString(WSMessage));
    }

    const handleInitAccepted = (message: WSMessage, socket: WebSocket) => {

        const WSMessage: WSMessage = {
            type: WsMessageEnum.ICERequest,
            session: message.session,
            peerStatus: ClientStatus.Prepare,
            remotePeerStatus: message.peerStatus,
        }
        socket.send(createJSONString(WSMessage));
    }
    const handleIceResponse = (message: WSMessage, socket: WebSocket) => {

        const WSMessage: WSMessage = {
            type: WsMessageEnum.ICEAccepted,
            session: message.session,
            peerStatus: ClientStatus.Prepare,
            remotePeerStatus: message.remotePeerStatus,

        }
        console.log("message ice", message)
        iceServers.push(...message.metadata);
        socket.send(createJSONString(WSMessage));
    }

    const handleIceAccepted = (message: WSMessage, socket: WebSocket) => {

        const WSMessage: WSMessage = {
            type: WsMessageEnum.RoleRequest,
            session: message.session,
            peerStatus: ClientStatus.Prepare,
            remotePeerStatus: message.remotePeerStatus,

        }
        socket.send(createJSONString(WSMessage));
    }

    const handleRoleResponse = (message: WSMessage, socket: WebSocket) => {
        state.role = message.metadata.role;
        const WSMessage: WSMessage = {
            type: WsMessageEnum.RoleAccepted,
            session: message.session,
            peerStatus: ClientStatus.Prepare,
            remotePeerStatus: message.remotePeerStatus,

        }
        socket.send(createJSONString(WSMessage));
    }

    const handlePrepareRTCResponse = async (message: WSMessage, socket: WebSocket) => {
        if (state.role === PeerRole.Initiator) {
            console.log('ININININITIATIOR')
                state.peerConnection = new RTCPeerConnection({iceServers});
                console.log(message)
                state.dataChannel = (state.peerConnection as RTCPeerConnection).createDataChannel("chat");
                const offer = await (state.peerConnection as RTCPeerConnection).createOffer();
                (state.peerConnection as RTCPeerConnection).onicecandidate = (event) => {
                    if (!!event.candidate) {
                        const iceCandidateMsg: WSMessage = {
                            type: WsMessageEnum.Candidate,
                            session: message.session,
                            candidate: event.candidate,
                            peerStatus: ClientStatus.Prepare,
                            remotePeerStatus: message.peerStatus
                        }
                        socket.send(createJSONString(iceCandidateMsg));
                    }

                }
                await (state.peerConnection as RTCPeerConnection).setLocalDescription(offer);
            console.log('ININININITIATIOR                     type: WsMessageEnum.Offer,\n')

            const WSMessage: WSMessage = {
                    type: WsMessageEnum.Offer,
                    offer: state.peerConnection.localDescription as RTCSessionDescriptionInit,
                    session: message.session,
                    remotePeerStatus: message.peerStatus,
                    peerStatus: ClientStatus.Prepare
                }
            socket.send(createJSONString(WSMessage))
        }

    }
    const waitForConnection = (message: WSMessage, socket: WebSocket): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            let interval: NodeJS.Timeout;
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(createJSONString(message))
                resolve(true)
            } else {
                interval = setInterval(() => {
                    if (socket && socket.readyState === WebSocket.OPEN) {
                        socket.send(createJSONString(message))
                        clearInterval(interval);
                        resolve(true)
                    }
                }, 100);
            }
            socket.onerror = (err) => {
                clearInterval(interval);
                reject(false);
            };

            socket.onclose = () => {
                clearInterval(interval);
                reject(false);
            };
        })

    }
    const handleOffer = async (message: WSMessage, socket: WebSocket) => {
        console.log("state reole", state.role)
        if(state.role === PeerRole.Joiner) {
            console.log("state reole 2", state.role)

            await processOffer(message, socket)
        }
    }


        const actionForMessage = async (message: WSMessage, socket: WebSocket): Promise<void> => {
        if (!message) {
            throw new Error('No message found');
        }
        if (!socket) {
            throw new Error('No socket found');

        }
        try {
            switch (message.type) {
                case WsMessageEnum.Init:
                    handleInit(message, socket);
                    break
                case WsMessageEnum.InitAccepted:
                    handleInitAccepted(message,socket)
                    break;
                case WsMessageEnum.ICEResponse:
                    handleIceResponse(message,socket)
                    break
                case WsMessageEnum.ICEAccepted:
                    handleIceAccepted(message,socket);
                    break;
                case WsMessageEnum.RoleResponse:
                    handleRoleResponse(message,socket);
                    break;
                case WsMessageEnum.PrepareRTC:
                    handlePrepareRTCResponse(message,socket);
                    break;
                case WsMessageEnum.IncommingOffer:
                    console.log('INFOMMING OFFER')
                    await handleOffer(message, socket)
                    break;
                case WsMessageEnum.Answer:
                    console.log('ANSWER')

                    await handleAnswer(message,socket);
                    break
                // case WSMessageE
                //     await handleIceCandidate(message);
                //     break;
                // case WSMessageEnum.Answer:
                //     handleAnswer(message, socket);
                //     break;
                // case WSMessageEnum.IncommingOffer:
                //     handleOffer(message, socket)
                //     break;
                // case WSMessageEnum.ICEResponse:
                //     // sendOffer(message, socket)
                //     break;
                // case WSMessageEnum.Waiting:
                //     sendWaitingStatus(message, socket);
                //     break;
                case WsMessageEnum.Start:
                    await waitForConnection(message, socket)
                    break;
            }
        } catch (e) {
            console.error('Cannot connect to WS')
        }
    }
    return  actionForMessage
}
