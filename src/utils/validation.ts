import {
  ERROR_IMPERIAL,
  ERROR_METRIC,
  MAX_DIAMETER_NM,
  MIN_DIAMETER_NM,
} from '../constants/config';
import {inToNm, mmToNm, Units} from './units';

export type ParseResult =
  | {ok: true; nm: number}
  | {ok: false; message: string};

const METRIC_PATTERN = /^\d{1,3}(?:[.,]\d{1,2})?$/;
const IMPERIAL_PATTERN = /^\d{1,3}(?:[.,]\d{1,6})?$/;

/**
 * Parse a user-entered custom diameter. Blank, zero, negative, multi-separator,
 * non-numeric and non-finite input is rejected - never clamped or substituted.
 */
export function parseDiameterInput(raw: string, units: Units): ParseResult {
  const message = units === 'metric' ? ERROR_METRIC : ERROR_IMPERIAL;
  const text = (raw || '').trim();
  if (!text) {
    return {ok: false, message};
  }
  const pattern = units === 'metric' ? METRIC_PATTERN : IMPERIAL_PATTERN;
  if (!pattern.test(text)) {
    return {ok: false, message};
  }
  const value = parseFloat(text.replace(',', '.'));
  if (!isFinite(value) || value <= 0) {
    return {ok: false, message};
  }
  const nm = units === 'metric' ? mmToNm(value) : inToNm(value);
  if (nm < MIN_DIAMETER_NM || nm > MAX_DIAMETER_NM) {
    return {ok: false, message};
  }
  return {ok: true, nm};
}

export const isInBounds = (nm: number): boolean =>
  nm >= MIN_DIAMETER_NM && nm <= MAX_DIAMETER_NM;

export const clampToBounds = (nm: number): number =>
  Math.min(MAX_DIAMETER_NM, Math.max(MIN_DIAMETER_NM, nm));

export const boundsMessage = (units: Units): string =>
  units === 'metric' ? ERROR_METRIC : ERROR_IMPERIAL;
