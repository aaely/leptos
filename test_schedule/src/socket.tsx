import socketio from 'socket.io-client';
import { setRecoil } from 'recoil-nexus';
import { messages } from './Recoil/forms';


const URL = 'http://localhost:3030';

let socket: any

export const connectWithWebSocket = () => {
    socket = socketio(URL)
    socket.on('connection', () => {
        console.log("connected!")
    })
    socket.on('broadcast', (data: any) => {
        console.log(data.activeusers)
        setRecoil(messages, data.activeusers)
    })
}

export const registerNewUser = (username: any) => {
    socket.emit('register-new-user', {
        username,
        socketId: socket.id
    })
}

export const removeUser = (username: any) => {
    socket.emit('remove-user', username)
}

export const sendMessage = (username: any, message: any) => {
    socket.emit('register-new-user', {
        username,
        socketId: socket.id,
        message
    })
}

/*const handleBroadcastEvents = event => {
    switch event {
        case 'ACTIVE_USERS'
    }
}*/