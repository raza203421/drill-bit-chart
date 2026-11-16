import {MM_PER_INCH} from '../constants/config';
import {nmToIn, nmToMm, Units} from './units';

/** Display rule: >=100 round down to a multiple of 10, below 100 round down to a whole RPM. */
export function roundRpmDown(raw: number): number {
  if (!isFinite(raw) || raw <= 0) {
    return 0;
  }
  return raw >= 100 ? Math.floor(raw / 10) * 10 : Math.floor(raw);
}

/** Group whole numbers with commas without relying on a locale. */
export function groupNumber(value: number): string {
  const whole = Math.trunc(Math.abs(value)).toString();
  const sign = value < 0 ? '-' : '';
  return sign + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const formatRpm = (value: number): string => groupNumber(value);

/** Fixed decimals with trailing zeros trimmed (detail sheets). */
export function trimDecimals(value: number, decimals: number): string {
  const text = value.toFixed(decimals);
  if (text.indexOf('.') === -1) {
    return text;
  }
  return text.replace(/0+$/, '').replace(/\.$/, '');
}

export const formatMm = (nm: number, decimals = 2): string => nmToMm(nm).toFixed(decimals);
export const formatIn = (nm: number, decimals = 4): string => nmToIn(nm).toFixed(decimals);

/** Primary readout for the active unit system. */
export function formatDiameter(nm: number, units: Units): string {
  return units === 'metric' ? formatMm(nm, 2) + ' mm' : formatIn(nm, 4) + ' in';
}

/** Secondary readout: the other unit system. */
export function formatConverted(nm: number, units: Units): string {
  return units === 'metric' ? formatIn(nm, 4) + ' in' : formatMm(nm, 3) + ' mm';
}

export function formatVc(vc: number, units: Units): string {
  if (units === 'metric') {
    return vc.toFixed(1) + ' m/min';
  }
  return Math.round(vc / 0.3048) + ' ft/min';
}

/** True when the shown text is not the canonical value (then label it Approx.). */
export function isApproximate(nm: number, shown: string, units: Units): boolean {
  const exact = units === 'metric' ? nm / 1000000 : nm / 1000000 / MM_PER_INCH;
  return Math.abs(parseFloat(shown) - exact) > 1e-9;
}
