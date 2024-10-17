import {WebRTCMessage} from "../models/webrtc-connection.model";
import {WebRTCMessageEnum} from "../enums/webrtc-message-enum";

export const createPeerConnection = (iceServers: RTCIceServer[] = []): RTCPeerConnection => {
    return new RTCPeerConnection({iceServers})
}

export const handleOffer = async (peerConnection: RTCPeerConnection, offer: RTCSessionDescriptionInit) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const anwser = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(anwser);
}

export const handleAnswer = async (peerConnection: RTCPeerConnection,offer: RTCSessionDescriptionInit) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
}

export const createJSONString = (object: WebRTCMessage): string => {
    if (!object) {
        throw new Error('Empty json')
    }
    return JSON.stringify(object);
}

export const establishWebRTCConnection = (message: WebRTCMessage) => {

}

const sendOffer = async (message: WebRTCMessage, socket: WebSocket) => {
    const peerConnection = new RTCPeerConnection();

    const dataChannel = peerConnection.createDataChannel("chat");

    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);
    const webRTCMessage: WebRTCMessage = {
        type: WebRTCMessageEnum.Offer,
        offer: peerConnection.localDescription,
        sessionId: message.sessionId
    }
    socket.send(createJSONString(webRTCMessage))

}
export const sendWaitingStatus = (message: WebRTCMessage, socket: WebSocket) => {
    const webRTCMessage: WebRTCMessage = {
        type: WebRTCMessageEnum.Waiting,
        sessionId: message.sessionId,
    }
    socket.send(createJSONString(webRTCMessage));
}

export const sendInitStatus = (message: WebRTCMessage, socket: WebSocket): void => {
    const webRTCMessage: WebRTCMessage = {
        type: WebRTCMessageEnum.Init,
        sessionId: message.sessionId
    }
    socket.send(createJSONString(message))
}

const waitForConnection =  (message: WebRTCMessage, socket: WebSocket): Promise<boolean> => {
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

export const actionForMessage = async (message: WebRTCMessage, socket: WebSocket): Promise<void> => {
    if (!message) {
        throw new Error('No message found');
    }
    if (!socket) {
        throw new Error('No socket found');

    }
    try {
        switch (message.type) {
            case WebRTCMessageEnum.Found:
                console.log("SWITCH, OFFER")
                sendOffer(message, socket)
                break;
            case WebRTCMessageEnum.Waiting:
                console.log("SWITCH, WAITNG")

                sendWaitingStatus(message, socket);
                break;
            case WebRTCMessageEnum.Init:
                await waitForConnection(message,socket)
                console.log("SWITCH, INIT")

                break;
        }
    }
    catch (e) {
      console.error('Cannot connect to WS')
    }


}

