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
        role: null,
        userId: null,
        stage: null
    }
    const iceServers: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302' }]

    const handleAnswer = async (message: WSMessage, socket: WebSocket) => {
        if (state.role === PeerRole.Initiator) {
            try {
                await (state.peerConnection as RTCPeerConnection).setRemoteDescription(new RTCSessionDescription((message.answer as RTCSessionDescriptionInit)));
                (state.dataChannel as RTCDataChannel).onopen = () => {
                    setConnectionState(state);
                    const openedMsg: WSMessage = {
                        type: WsMessageEnum.PeerReady,
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


    const processOffer = async (message: WSMessage, socket: WebSocket) => {
        state.peerConnection = new RTCPeerConnection({iceServers});
        await (state.peerConnection as RTCPeerConnection).setRemoteDescription(new RTCSessionDescription(message.offer as RTCSessionDescriptionInit));
        const answer = await (state.peerConnection as RTCPeerConnection).createAnswer();
        await (state.peerConnection as RTCPeerConnection).setLocalDescription(answer);
        (state.peerConnection as RTCPeerConnection).onicecandidate = (event) => {
            if (event.candidate) {
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
        (state.peerConnection as RTCPeerConnection).ondatachannel = (event) => {
            state.dataChannel = event.channel;
            state.dataChannel.onopen = () => {
                const openedMsg: WSMessage = {
                    type: WsMessageEnum.PeerReady,
                    session: message.session,
                    remotePeerStatus: message.peerStatus,
                    peerStatus: ClientStatus.Prepare
                }
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
    const iceCandidatesQueue: RTCIceCandidate[] = [];

    const handleIceResponse = (message: WSMessage, socket: WebSocket) => {

        const WSMessage: WSMessage = {
            type: WsMessageEnum.ICEAccepted,
            session: message.session,
            peerStatus: ClientStatus.Prepare,
            remotePeerStatus: message.remotePeerStatus,

        }
        // iceServers.push(...message.metadata);
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
                state.peerConnection = new RTCPeerConnection({iceServers});
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
                state.dataChannel = (state.peerConnection as RTCPeerConnection).createDataChannel("chat");
                const offer = await (state.peerConnection as RTCPeerConnection).createOffer();

                await (state.peerConnection as RTCPeerConnection).setLocalDescription(offer);

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
        if(state.role === PeerRole.Joiner) {

            await processOffer(message, socket)
        }
    }

    const addICECandidateFromQueue = () => {
        while (iceCandidatesQueue.length > 0) {
            const candidate = iceCandidatesQueue.shift();
            state.peerConnection.addIceCandidate(candidate);
        }
    }
    const handleCandidate = async (message: WSMessage) => {
        const candidate = new RTCIceCandidate(message.candidate);

        if(state.peerConnection.remoteDescription && state.role !== PeerRole.Joiner) {

                try {
                    await (state.peerConnection as RTCPeerConnection).addIceCandidate(new RTCIceCandidate(message.candidate));
                } catch (error) {
                    console.error('Błąd podczas dodawania kandydata ICE:', error);
                }
            } else  {
                iceCandidatesQueue.push(candidate);
        }
    };



    const handleConnected = (message: WSMessage, socket: WebSocket) => {
        state.userId = message.metadata.userId;

        const WSMessage: WSMessage = {
            type: WsMessageEnum.Start,
            session: message.session,
            peerStatus: ClientStatus.Prepare,
            remotePeerStatus: message.remotePeerStatus,

        }
        socket.send(createJSONString(WSMessage));
    }
    const handlePeerReady = (message: WSMessage, socket: WebSocket) => {
            const wsMessage: WSMessage = {
                type: WsMessageEnum.Listen,
                session: message.session,
                peerStatus: ClientStatus.Unknown,
                remotePeerStatus: ClientStatus.Prepare
            }
        state.dataChannel.onmessage = (msg) => {
            const wsMessage: WSMessage = {
                type: WsMessageEnum.MsgReceived,
                session: message.session,
                peerStatus: ClientStatus.Unknown,
                remotePeerStatus: ClientStatus.Prepare
            }
            socket.send(createJSONString(wsMessage))

        }
        socket.send(createJSONString(wsMessage))

    }

    const handleListen = (message: WSMessage, socket: WebSocket) => {
        state.dataChannel.send('ssss')
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
                case WsMessageEnum.Listen:
                    handleListen(message, socket);
                    break
                case WsMessageEnum.PeerReady:
                    handlePeerReady(message, socket);
                    break
                case WsMessageEnum.Connected:
                    handleConnected(message, socket);
                    break
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
                    await handleOffer(message, socket)
                    break;
                case WsMessageEnum.Answer:
                    await handleAnswer(message,socket);
                    break
                case WsMessageEnum.Candidate:
                    await handleCandidate(message);
                    break;
                case WsMessageEnum.Connect:
                    await waitForConnection(message, socket)
                    break;
            }
        } catch (e) {
            console.error('Cannot connect to WS')
        }
    }
    return  actionForMessage
}
