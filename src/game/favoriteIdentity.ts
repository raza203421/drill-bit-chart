import {REFERENCE_DATA_VERSION} from '../constants/config';

export type FavoriteKind = 'speed' | 'thread' | 'bit';

export type Favorite = {
  id: string;
  kind: FavoriteKind;
  createdAt: number;
  diameterNm: number;
  sizeLabel: string;
  referenceDataVersion: number;
  materialId?: string;
  materialLabel?: string;
  startRpm?: number;
  endRpm?: number;
  threadId?: string;
  threadLabel?: string;
  drillLabel?: string;
};

/**
 * Canonical identity: a speed is material + diameter, a thread is its thread id,
 * a bit is its physical diameter. Saving 1/4 in and 6.35 mm yields one bit entry.
 */
export function canonicalId(
  kind: FavoriteKind,
  parts: {diameterNm?: number; materialId?: string; threadId?: string},
): string {
  if (kind === 'speed') {
    return 'speed:' + parts.materialId + ':' + parts.diameterNm;
  }
  if (kind === 'thread') {
    return 'thread:' + parts.threadId;
  }
  return 'bit:' + parts.diameterNm;
}

export function isValidFavorite(value: any): value is Favorite {
  if (!value || typeof value !== 'object') {
    return false;
  }
  if (typeof value.id !== 'string' || typeof value.createdAt !== 'number') {
    return false;
  }
  if (value.kind !== 'speed' && value.kind !== 'thread' && value.kind !== 'bit') {
    return false;
  }
  return typeof value.diameterNm === 'number' && isFinite(value.diameterNm);
}

export const newReferenceVersion = (): number => REFERENCE_DATA_VERSION;
