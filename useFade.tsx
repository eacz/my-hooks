import { useRef } from "react";
import { Animated } from "react-native";

interface Props {
  fadeInTiming?: number,
  fadeOutTiming?: number,
  initialOpacity?: number
}

const useFade = ({fadeInTiming = 300, fadeOutTiming = 300, initialOpacity = 0} : Props) => {
  const opacity = useRef(new Animated.Value(initialOpacity)).current;

  const fadeIn = (callback?: Function) => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: fadeInTiming,
      useNativeDriver: true
    }).start(() => callback ? callback() : null);
  }

  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: fadeOutTiming,
      useNativeDriver: true
    }).start()
  }

  return {
    opacity,
    fadeIn,
    fadeOut
  }
}

export default useFade
