import {useCallback} from 'react';
import {AppStore} from './useAppStore';
import {Units} from '../utils/units';

export type SettingsApi = {
  units: Units;
  haptics: boolean;
  reducedMotionPreference: boolean;
  setUnits: (units: Units) => void;
  setHaptics: (value: boolean) => void;
  setReducedMotion: (value: boolean) => void;
};

/** Unit, feedback and motion preferences. Changing units never touches data. */
export function useSettings(store: AppStore): SettingsApi {
  const {commit, state} = store;

  const setUnits = useCallback((units: Units) => void commit({units}), [commit]);
  const setHaptics = useCallback((haptics: boolean) => void commit({haptics}), [commit]);
  const setReducedMotion = useCallback(
    (reducedMotion: boolean) => void commit({reducedMotion}),
    [commit],
  );

  return {
    units: state.units,
    haptics: state.haptics,
    reducedMotionPreference: state.reducedMotion,
    setUnits,
    setHaptics,
    setReducedMotion,
  };
}
