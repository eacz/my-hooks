import { useCallback, useEffect, useRef, useState } from 'react';
import {v4 as uuid} from 'uuid'
import { Subject } from 'rxjs'
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

const useMapbox = (initalPosition) => {
  //map reference and a function to set it
  //MapRef is a reference to DOM element where the map should render
  const mapRef = useRef();
  const setRef = useCallback(node => {
    mapRef.current = node
  }, [])
  //map is an instance of mapboxgl 
  const map = useRef()
  const [coords, setCoords] = useState(initalPosition)
  //markers reference
  const markers = useRef({})

  //Rxjs observables
  const markerMovement = useRef(new Subject())
  const newMarker = useRef(new Subject())

  const addMarker = useCallback((e, id) => {
    const { lng, lat } = e.lngLat || e
    const marker = new mapboxgl.Marker()
    marker.id = id ?? uuid() 
    marker
      .setLngLat([lng,lat])
      .addTo(map.current)
      .setDraggable(true);
    markers.current[marker.id] = marker;
    
    //emit event of new marker
    if(!id){
      newMarker.current.next({id: marker.id, lng, lat});
    }

    marker.on('drag', ({target}) => {
      const {id} = target
      const {lng, lat} = target.getLngLat()
      //emit marker position change
      markerMovement.current.next({id, lng, lat})
    })
  }, [])

  //create the map instance on first load of the hook
  useEffect(() => {
    const mapGl = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [initalPosition.lng, initalPosition.lat],
      zoom: initalPosition.zoom
    });
    map.current = mapGl
  }, [initalPosition])

  //when the map moves, update the coords
  useEffect(() => {
    map.current?.on('move', () => {
      const { lng,lat } = map.current.getCenter()
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.current.getZoom().toFixed(2)
      })
    })
    return map.current?.off('move')
  }, [])

  //add markers on click
  useEffect(() => {
    map.current?.on('click',addMarker)
  }, [addMarker])

  const updateMarkersPosition = useCallback(({id, lng, lat}) => {
    markers.current[id]?.setLngLat([lng,lat]) 
  }, [])

  return {
    coords,
    setRef,
    markers,
    addMarker,
    updateMarkersPosition,
    newMarker$: newMarker.current,
    markerMovement$: markerMovement.current
  }
}

export default useMapbox