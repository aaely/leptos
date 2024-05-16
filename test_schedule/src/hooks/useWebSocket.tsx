import { useEffect } from 'react'
import { connectWithWebSocket } from '../socket'

const useWebSocket = () => {
    useEffect(() => {
        connectWithWebSocket()

        return () => {}
    }, [])
}

export default useWebSocket