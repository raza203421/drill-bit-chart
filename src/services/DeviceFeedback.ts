import {Platform, Vibration} from 'react-native';

/**
 * Guarded haptics. Gated by the Settings preference and never repeated on held
 * stepper ticks. Uses the VIBRATE permission already declared in the manifest.
 */
export function tap(enabled: boolean): void {
  if (!enabled || Platform.OS !== 'android') {
    return;
  }
  try {
    Vibration.vibrate(12);
  } catch (e) {
    // Device without a vibrator - feedback is optional by design.
  }
}
