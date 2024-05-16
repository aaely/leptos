import axios from 'axios';
import { selector } from 'recoil'


export const trailers = selector({
    key: 'trailers',
    get: async () => {
        try {
            const res = await axios.get('http://localhost:5555/api/schedule_trailer')
            console.log('Response:', res.data)
            return res.data
        } catch (error) {
            console.log(error)
        }
    }
})