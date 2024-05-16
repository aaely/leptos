import { atom } from 'recoil'
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
    key: 'recoil-persist-session', // this key is using to store data in local storage
    storage: sessionStorage, // configurate which stroage will be used to store the data
  })

export const chat = atom<string>({
    key: 'chat',
    default: '',
    effects: [persistAtom]
})

export const door = atom<string>({
    key: 'door',
    default: '',
    effects: [persistAtom]
})


export const user = atom<string>({
    key: 'user',
    default: '',
    effects: [persistAtom]
})

export const messages = atom({
    key: 'messages',
    default: [],
    effects: [persistAtom]
})

export const scheduledDate = atom({
    key: 'scheduledDate',
    default: '',
    effects: [persistAtom]
})

export const scheduledTime = atom({
    key: 'scheduledTime',
    default: '',
    effects: [persistAtom]
})

export const lastFreeDate = atom({
    key: 'lastFreeDate',
    default: '',
    effects: [persistAtom]
})

export const scac = atom({
    key: 'scac',
    default: '',
    effects: [persistAtom]
})
