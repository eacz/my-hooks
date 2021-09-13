import { useRef } from "react"
import { Animated, Easing } from "react-native"

interface startMovingPositionProps {
  initPosition?: number,
  toPosition?: number,
  duration?: number,
  bounce?: boolean,
}

const useAnimation = () => {
  const opacity = useRef(new Animated.Value(0)).current
  const position = useRef(new Animated.Value(0)).current

  const fadeIn = (duration: number = 300) => {
    Animated.timing(
      opacity,
      {
        toValue: 1,
        duration,
        useNativeDriver: true
      }
    ).start()

  }

  const fadeOut = (duration: number = 300) => {
    Animated.timing(
      opacity,
      {
        toValue: 0,
        duration,
        useNativeDriver: true
      }
    ).start()
  }

  const startMovingPosition = ({
    initPosition= -100, 
    toPosition = 0, 
    duration = 300, 
    bounce = false
  }:startMovingPositionProps) => {
    
    position.setValue(initPosition);
    Animated.timing(
      position,
      {
        toValue: toPosition,
        duration,
        useNativeDriver: true,
        easing: bounce ? Easing.bounce : undefined
      }
    ).start()
  }

  return {
    opacity,
    position,
    fadeIn,
    fadeOut,
    startMovingPosition
  }
}

export default useAnimation
