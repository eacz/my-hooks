import { useEffect } from 'react';

const useMapboxSocketEvents = (addMarker, newMarker$, markerMovement$, updateMarkersPosition, socket) => {
  useEffect(() => {
    newMarker$.subscribe(marker => {
      socket.emit('new-marker', marker)
    })
  }, [newMarker$, socket])
  
  //when a marker is moved
  useEffect(() => {
    markerMovement$.subscribe(marker => {
      //emit marker position change socket event
      socket.emit('updated-marker', marker)
    })
  }, [markerMovement$, socket])

  //listen when a marker is moved
  useEffect(() => {
    socket.on('updated-marker', marker => {
      updateMarkersPosition(marker)
    })
  }, [socket, updateMarkersPosition])

  // listening on new-marker event
  useEffect(() => {
    socket.on('new-marker', marker => {
      addMarker(marker, marker.id)
    })
  }, [socket, addMarker])

  //listen active markers event
  useEffect(() => {
    socket.on('active-markers', markers => {
      for(const key of Object.keys(markers)){
        addMarker(markers[key], key)
      }
    })
  }, [socket, addMarker])
}

export default useMapboxSocketEvents
