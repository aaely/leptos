import { atom, selector } from "recoil";

export const localStream: any = selector({
    key: 'localStream',
    get: async () => {
        try {
            const res = await window.navigator.mediaDevices.getUserMedia({video: true, audio: true})
            return res
        } catch (error) {
            console.log(error)
        }
    }
})

export const iceServers = atom({
    key: 'iceServers',
    default: {
        iceServers: [
            { urls: 'stun:stun.services.mozilla.com' },
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    }
})

export const remoteStreams = atom ({
    key: 'remoteStreams',
    default: []
})