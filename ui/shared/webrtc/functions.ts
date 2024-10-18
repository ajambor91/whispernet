import {WebRTCMessage} from "../models/webrtc-connection.model";
import {WebRTCMessageEnum} from "../enums/webrtc-message-enum";
import {ConnectionStateModel} from "../models/connection-state.model";


export function connectRTC(){
    const state: ConnectionStateModel = {
        peerConnection: null,
        dataChannel: null
    }

    const iceServers: RTCIceServer[] = [
        { urls: 'stun:coturn:3478' },
        {
            urls: 'turn:coturn:3478',
            username: 'exampleuser',
            credential: 'examplepass'
        }
    ];
    const createPeerConnection = (iceServers: RTCIceServer[] = []): RTCPeerConnection => {
        return new RTCPeerConnection({iceServers})
    }



    const handleAnswer = async (message: WebRTCMessage, socket: WebSocket) => {
        try {
            console.log("INIT HANDLE ANSWER")
            await state.peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
            state.dataChannel.onopen = () => {
                const openedMsg: WebRTCMessage = {
                    type: WebRTCMessageEnum.Opened,
                    sessionId: message.sessionId
                };
                console.log("Channel open")
                state.dataChannel.send("HELLO")
            }
            state.peerConnection.onconnectionstatechange = () => {
                console.log('Stan połączenia: ', state.peerConnection.connectionState);
                if (state.peerConnection.connectionState === 'failed') {
                    console.error('Połączenie WebRTC nie udało się - sprawdź konfigurację ICE.');
                }
            };
            state.dataChannel.onmessage = (event) => {
                console.log('GET MESG')
            }

        } catch (error) {
            console.error('Error setting remote description: ', error);
        }
    }

    const createJSONString = (object: WebRTCMessage): string => {
        if (!object) {
            throw new Error('Empty json')
        }
        return JSON.stringify(object);
    }

    const establishWebRTCConnection = (message: WebRTCMessage) => {

    }

    const sendOffer = async (message: WebRTCMessage, socket: WebSocket) => {
        state.peerConnection = new RTCPeerConnection({iceServers});

        state.dataChannel = state.peerConnection.createDataChannel("chat");

        const offer = await state.peerConnection.createOffer();
        state.peerConnection.onicecandidate = (event) => {
            if (!!event.candidate) {
                const iceCandidateMsg: WebRTCMessage = {
                    type: WebRTCMessageEnum.Candidate,
                    sessionId: message.sessionId,
                    candidate: event.candidate
                }
                socket.send(createJSONString(iceCandidateMsg));
            }

        }
        await state.peerConnection.setLocalDescription(offer);
        const webRTCMessage: WebRTCMessage = {
            type: WebRTCMessageEnum.Offer,
            offer: state.peerConnection.localDescription,
            sessionId: message.sessionId
        }

        socket.send(createJSONString(webRTCMessage))

    }

    const handleOffer = async (message: WebRTCMessage, socket: WebSocket) => {
        state.peerConnection = new RTCPeerConnection({iceServers});

        await state.peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));

        const answer = await state.peerConnection.createAnswer();
        await state.peerConnection.setLocalDescription(answer);
        state.peerConnection.onicecandidate = (event) => {
            if (!!event.candidate) {
                const iceCandidateMsg: WebRTCMessage = {
                    candidate: event.candidate,
                    type: WebRTCMessageEnum.Candidate,
                    sessionId: message.sessionId
                }
                socket.send(createJSONString(iceCandidateMsg))
            }

        }
        state.peerConnection.ondatachannel = (event) => {
            console.log("Otrzymano kanał danych od Peer A");
            state.dataChannel = event.channel;

            state.dataChannel.onopen = () => {
                console.log("Kanał danych otwarty na Peer B - można wysyłać wiadomości.");
                state.dataChannel.send("Cześć, Peer A! Otrzymałem twoją wiadomość.");
            };

            state.dataChannel.onmessage = (event) => {
                console.log("Otrzymano wiadomość od Peer A: ", event.data);
            };
        };
        const webRTCMessage: WebRTCMessage = {
            type: WebRTCMessageEnum.Answer,
            sessionId: message.sessionId,
            answer: state.peerConnection.localDescription,
        };
        socket.send(createJSONString(webRTCMessage))


    }
    const sendWaitingStatus = (message: WebRTCMessage, socket: WebSocket) => {
        const webRTCMessage: WebRTCMessage = {
            type: WebRTCMessageEnum.Waiting,
            sessionId: message.sessionId,
        }
        socket.send(createJSONString(webRTCMessage));
    }

    const sendInitStatus = (message: WebRTCMessage, socket: WebSocket): void => {
        const webRTCMessage: WebRTCMessage = {
            type: WebRTCMessageEnum.Init,
            sessionId: message.sessionId
        }
        socket.send(createJSONString(message))
    }


    const handleIceCandidate = async (message: WebRTCMessage) => {
        if (message.candidate) {
            try {
                await state.peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
                console.log('Dodano kandydata ICE:', message.candidate);
            } catch (error) {
                console.error('Błąd podczas dodawania kandydata ICE:', error);
            }
        }
    };

    const waitForConnection = (message: WebRTCMessage, socket: WebSocket): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            let interval: NodeJS.Timeout;
            const webRTCMessage: WebRTCMessage = {sessionId: message.sessionId, type: WebRTCMessageEnum.Init};
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



     const actionForMessage = async (message: WebRTCMessage, socket: WebSocket): Promise<void> => {
        if (!message) {
            throw new Error('No message found');
        }
        if (!socket) {
            throw new Error('No socket found');

        }
        try {
            switch (message.type) {
                case WebRTCMessageEnum.Candidate:
                    await handleIceCandidate(message);
                    break;
                case WebRTCMessageEnum.Answer:
                    handleAnswer(message, socket);
                    break;
                case WebRTCMessageEnum.IncommingOffer:
                    handleOffer(message, socket)
                    break;
                case WebRTCMessageEnum.Found:
                    console.log("SWITCH, OFFER")
                    sendOffer(message, socket)
                    break;
                case WebRTCMessageEnum.Waiting:
                    console.log("SWITCH, WAITNG")

                    sendWaitingStatus(message, socket);
                    break;
                case WebRTCMessageEnum.Init:
                    await waitForConnection(message, socket)
                    console.log("SWITCH, INIT")

                    break;
            }
        } catch (e) {
            console.error('Cannot connect to WS')
        }


    }
    return  actionForMessage
}
