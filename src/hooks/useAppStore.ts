import {useCallback, useEffect, useRef, useState} from 'react';
import {
  defaultState,
  readState,
  StoredState,
  writeState,
} from '../services/LocalStore';

export type AppStore = {
  state: StoredState;
  hydrated: boolean;
  notice: string | null;
  dismissNotice: () => void;
  setNotice: (text: string | null) => void;
  commit: (patch: Partial<StoredState>) => Promise<boolean>;
};

/**
 * Single owner of the persisted document. Every slice hook receives this store
 * instead of touching the adapter directly, so writes stay atomic.
 */
export function useAppStore(): AppStore {
  const [state, setState] = useState<StoredState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let alive = true;
    readState()
      .then(result => {
        if (!alive) {
          return;
        }
        setState(result.state);
        setHydrated(true);
        if (result.error) {
          setNotice(result.error);
        } else if (result.partial) {
          setNotice('Some saved items could not be loaded.');
        }
      })
      .catch(() => {
        if (alive) {
          setHydrated(true);
          setNotice('Could not read saved data. Using defaults.');
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const commit = useCallback(async (patch: Partial<StoredState>) => {
    const previous = stateRef.current;
    const next = {...previous, ...patch};
    setState(next);
    stateRef.current = next;
    const ok = await writeState(next);
    if (!ok) {
      setState(previous);
      stateRef.current = previous;
      setNotice('Could not save on this device. Try again.');
    }
    return ok;
  }, []);

  const dismissNotice = useCallback(() => setNotice(null), []);

  return {state, hydrated, notice, dismissNotice, setNotice, commit};
}
