import {REFERENCE_DATA_VERSION} from '../constants/config';
import {getMaterial, MaterialId} from '../data/materialData';
import {roundRpmDown} from '../utils/formatters';
import {nmToMm} from '../utils/units';

export type RpmResult = {
  materialId: MaterialId;
  diameterNm: number;
  /** Unrounded spindle speeds for the low and high cutting-speed bounds. */
  rawStart: number;
  rawEnd: number;
  /** Displayed values after the shared rounding rule. */
  startRpm: number;
  endRpm: number;
  vcLow: number;
  vcHigh: number;
  referenceDataVersion: number;
};

/**
 * n = 1000 * Vc / (pi * D), Vc in m/min and D in millimetres.
 * Pure function: no UI and no persistence dependency.
 */
export function calculateRpm(materialId: string, diameterNm: number): RpmResult | null {
  const diameterMm = nmToMm(diameterNm);
  if (!isFinite(diameterMm) || diameterMm <= 0) {
    return null;
  }
  const material = getMaterial(materialId);
  const denominator = Math.PI * diameterMm;
  const rawStart = (1000 * material.vcLow) / denominator;
  const rawEnd = (1000 * material.vcHigh) / denominator;
  return {
    materialId: material.id,
    diameterNm,
    rawStart,
    rawEnd,
    startRpm: roundRpmDown(rawStart),
    endRpm: roundRpmDown(rawEnd),
    vcLow: material.vcLow,
    vcHigh: material.vcHigh,
    referenceDataVersion: REFERENCE_DATA_VERSION,
  };
}

export const EXCEEDS_MACHINE_RANGE = 20000;
