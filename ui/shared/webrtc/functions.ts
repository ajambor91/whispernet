import {WebRTCMessage} from "../models/webrtc-connection.model";
import {WebRTCMessageEnum} from "../enums/webrtc-message-enum";
import {ConnectionStateModel} from "../models/connection-state.model";


export function connectRTC(){
    const state: ConnectionStateModel = {
        peerConnection: null,
        dataChannel: null
    }

    const createPeerConnection = (iceServers: RTCIceServer[] = []): RTCPeerConnection => {
        return new RTCPeerConnection({iceServers})
    }



    const handleAnswer = async (message: WebRTCMessage) => {
        try {
            console.log("INIT HANDLE ANSWER")
            await state.peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
            state.dataChannel.onopen = () => {
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
        state.peerConnection = new RTCPeerConnection();

        state.dataChannel = state.peerConnection.createDataChannel("chat");

        const offer = await state.peerConnection.createOffer();

        await state.peerConnection.setLocalDescription(offer);
        const webRTCMessage: WebRTCMessage = {
            type: WebRTCMessageEnum.Offer,
            offer: state.peerConnection.localDescription,
            sessionId: message.sessionId
        }
        state.peerConnection.onconnectionstatechange = () => {
            console.log('Stan połączenia: ', state.peerConnection.connectionState);
            if (state.peerConnection.connectionState === 'failed') {
                console.error('Połączenie WebRTC nie udało się - sprawdź konfigurację ICE.');
            }
        };
        state.dataChannel.onopen = () => {
            console.log("Channel open")
            state.dataChannel.send("HELLO")
        }
        state.dataChannel.onmessage = (event) => {
            console.log('GET MESG')
        }

        socket.send(createJSONString(webRTCMessage))

    }

    const handleOffer = async (message: WebRTCMessage, socket: WebSocket) => {
        state.peerConnection = new RTCPeerConnection();

        await state.peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));

        const answer = await state.peerConnection.createAnswer();
        await state.peerConnection.setLocalDescription(answer);

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
                case WebRTCMessageEnum.Answer:
                    handleAnswer(message);
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
