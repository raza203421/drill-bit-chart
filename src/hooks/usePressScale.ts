import {useCallback, useRef} from 'react';
import {Animated} from 'react-native';
import {theme} from '../constants/theme';

/**
 * Shared press spring. The Pressable stays the PARENT and the Animated.View is
 * its child, which is the pattern that keeps onPress alive in Android release.
 */
export function usePressScale(enabled = true, pressedScale = 0.98) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    if (!enabled) {
      return;
    }
    Animated.spring(scale, {
      toValue: pressedScale,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [enabled, pressedScale, scale]);

  const onPressOut = useCallback(() => {
    if (!enabled) {
      return;
    }
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [enabled, scale]);

  return {scale, onPressIn, onPressOut};
}
