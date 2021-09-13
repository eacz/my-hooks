import { useEffect, useMemo, useState } from "react"
import io from "socket.io-client";

const useSocket = (serverPath) => {
  const socket = useMemo(() => io(serverPath, { transports: [ 'websocket'] }), [serverPath])
  const [online, setOnline] = useState(false)

  useEffect(() => {
    setOnline(socket.connected)
  }, [socket])

  useEffect(() => {
    socket.on('connect', () => {
      setOnline(true)
     //return socket.disconnect()
    })
  }, [socket])

  useEffect(() => {
    socket.on('disconnect', () => {
      setOnline(false)
    })
  }, [socket])
  
  
  return {
    socket,
    online
  }
}

export default useSocket
