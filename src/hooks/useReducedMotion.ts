import {useEffect, useState} from 'react';
import {AccessibilityInfo} from 'react-native';

/** Merge the in-app preference with the Android accessibility setting. */
export function useReducedMotion(preference: boolean): boolean {
  const [system, setSystem] = useState(false);

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(value => {
        if (alive) {
          setSystem(!!value);
        }
      })
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', value =>
      setSystem(!!value),
    );
    return () => {
      alive = false;
      if (sub && typeof sub.remove === 'function') {
        sub.remove();
      }
    };
  }, []);

  return preference || system;
}
