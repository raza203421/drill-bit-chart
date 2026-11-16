import {MM_PER_INCH, NM_PER_MM} from '../constants/config';

export type Units = 'metric' | 'imperial';

/** Canonical storage is an integer number of nanometres. */
export const mmToNm = (mm: number): number => Math.round(mm * NM_PER_MM);
export const nmToMm = (nm: number): number => nm / NM_PER_MM;
export const inToNm = (inches: number): number => Math.round(inches * MM_PER_INCH * NM_PER_MM);
export const nmToIn = (nm: number): number => nm / NM_PER_MM / MM_PER_INCH;

/** Exact fraction of an inch -> nanometres, without a rounded decimal detour. */
export const fractionToNm = (numerator: number, denominator: number): number =>
  Math.round((numerator * MM_PER_INCH * NM_PER_MM) / denominator);

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

/** 16/64 -> "1/4 in", 64/64 -> "1 in". */
export function fractionLabel(numerator: number, denominator: number): string {
  const d = gcd(numerator, denominator);
  const n = numerator / d;
  const den = denominator / d;
  if (den === 1) {
    return n + ' in';
  }
  return n + '/' + den + ' in';
}

export function stepFor(units: Units, metricStep: number, imperialStep: number): number {
  return units === 'metric' ? metricStep : imperialStep;
}
