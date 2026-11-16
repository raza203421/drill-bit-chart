import {
  DEFAULT_DIAMETER_NM,
  DEFAULT_MATERIAL_ID,
  SCHEMA_VERSION,
} from '../constants/config';
import {Favorite, isValidFavorite} from '../game/favoriteIdentity';
import {Units} from '../utils/units';

export type StoredState = {
  schemaVersion: number;
  units: Units;
  haptics: boolean;
  reducedMotion: boolean;
  lastMaterialId: string;
  lastDiameterNm: number;
  favorites: Favorite[];
};

export type ReadResult = {
  state: StoredState;
  /** True when some individual records were dropped as malformed. */
  partial: boolean;
  error: string | null;
};

export function defaultState(): StoredState {
  return {
    schemaVersion: SCHEMA_VERSION,
    units: 'metric',
    haptics: true,
    reducedMotion: false,
    lastMaterialId: DEFAULT_MATERIAL_ID,
    lastDiameterNm: DEFAULT_DIAMETER_NM,
    favorites: [],
  };
}

/**
 * Process-local preference adapter.
 *
 * The factory forbids extra storage packages, so this module is the single seam
 * where an Android SharedPreferences native adapter would be plugged in. Every
 * caller already treats reads and writes as asynchronous and fallible, so
 * swapping the two functions below for a native bridge needs no UI change.
 */
let memory: StoredState = defaultState();

function sanitize(raw: any): {state: StoredState; partial: boolean} {
  const base = defaultState();
  if (!raw || typeof raw !== 'object') {
    return {state: base, partial: false};
  }
  const favorites: Favorite[] = [];
  let partial = false;
  const list = Array.isArray(raw.favorites) ? raw.favorites : [];
  for (let i = 0; i < list.length; i++) {
    if (isValidFavorite(list[i])) {
      favorites.push(list[i]);
    } else {
      partial = true;
    }
  }
  return {
    state: {
      schemaVersion: SCHEMA_VERSION,
      units: raw.units === 'imperial' ? 'imperial' : 'metric',
      haptics: raw.haptics !== false,
      reducedMotion: raw.reducedMotion === true,
      lastMaterialId:
        typeof raw.lastMaterialId === 'string' ? raw.lastMaterialId : base.lastMaterialId,
      lastDiameterNm:
        typeof raw.lastDiameterNm === 'number' && isFinite(raw.lastDiameterNm)
          ? raw.lastDiameterNm
          : base.lastDiameterNm,
      favorites,
    },
    partial,
  };
}

export async function readState(): Promise<ReadResult> {
  try {
    const result = sanitize(memory);
    return {state: result.state, partial: result.partial, error: null};
  } catch (e) {
    return {state: defaultState(), partial: false, error: 'Could not read saved data.'};
  }
}

/** Atomic replace: a failed write leaves the previous committed data untouched. */
export async function writeState(next: StoredState): Promise<boolean> {
  try {
    const result = sanitize(next);
    memory = result.state;
    return true;
  } catch (e) {
    return false;
  }
}

export async function clearFavorites(): Promise<boolean> {
  try {
    memory = {...memory, favorites: []};
    return true;
  } catch (e) {
    return false;
  }
}
