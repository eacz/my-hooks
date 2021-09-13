import Geolocation from "@react-native-community/geolocation";
import { useState, useEffect, useRef} from "react";
import { Location } from '../interfaces/location';

const useLocation = () => {
  
  const [hasLocation, setHasLocation] = useState(false)
  const [routeLines, setRouteLines] = useState<Location[]>([])
  const [initialPosition, setInitialPosition] = useState<Location>({longitude: 0, latitude: 0})
  const [userLocation, setUserLocation] = useState<Location>({longitude: 0, latitude: 0})
  const watchIdRef = useRef<number>()
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false;
    }
  }, [])

  useEffect(() => {
    if(!isMounted) return;
    getCurrentLocation().then(location => {
      setInitialPosition(location)
      setUserLocation(location)
      setRouteLines(routes => [...routes, location])
      setHasLocation(true)
    })
   
  }, [])

  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
     Geolocation.getCurrentPosition(
        ({ coords }) => {
        if(!isMounted) return;
          resolve({
            latitude: coords.latitude, longitude: coords.longitude 
          })
        },
        err => reject(err),
        { enableHighAccuracy: true }
      );
    })
  }

  const followUserLocation = () => {
     watchIdRef.current = Geolocation.watchPosition(
      ({coords}) => {
      if(!isMounted) return;
        const location: Location = {
          latitude: coords.latitude, 
          longitude: coords.longitude
        }
        setUserLocation(location)
        setRouteLines(routes => [...routes, location])
      },
      (err) => console.log(err), {enableHighAccuracy: true, distanceFilter: 10}
    )
  }

  const stopFollowUserLocation = () => {
    if(watchIdRef.current){
      Geolocation.clearWatch(watchIdRef.current)
    }
  }

  return {
    hasLocation, 
    initialPosition,
    userLocation,
    routeLines,
    getCurrentLocation,
    followUserLocation,
    stopFollowUserLocation
  }
}

export default useLocation