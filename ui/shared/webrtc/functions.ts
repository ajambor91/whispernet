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

export const establishWebRTCConnection = (message: any) => {

}

export const createMessage = (m)