import axios from "axios"

export const getTrucks = async () => {
    try {
        const res = await axios.get('http://localhost:5555/api/schedule_trailer')
        console.log(res)
        return res.data
    } catch(error) {
        console.log(error)
    }
}