import {fractionLabel, fractionToNm, inToNm, mmToNm} from '../utils/units';

export type BitFamily = 'metric' | 'fractional' | 'tapCodes';

export type BitSizeRecord = {
  id: string;
  family: BitFamily;
  /** Native label in the family's own notation. */
  label: string;
  /** Exact canonical diameter in nanometres. */
  diameterNm: number;
  /** Set for fractional entries so detail sheets can show the exact fraction. */
  fraction?: string;
};

/** 0.5 mm to 25.4 mm inclusive in 0.1 mm steps - labels built from integer tenths. */
function buildMetric(): BitSizeRecord[] {
  const out: BitSizeRecord[] = [];
  for (let tenths = 5; tenths <= 254; tenths++) {
    const mm = tenths / 10;
    out.push({
      id: 'metric-' + tenths,
      family: 'metric',
      label: mm.toFixed(2) + ' mm',
      diameterNm: mmToNm(mm),
    });
  }
  return out;
}

/** 1/64 in to 64/64 in inclusive, labels reduced by GCD, 64/64 shown as 1 in. */
function buildFractional(): BitSizeRecord[] {
  const out: BitSizeRecord[] = [];
  for (let n = 1; n <= 64; n++) {
    out.push({
      id: 'fraction-' + n,
      family: 'fractional',
      label: fractionLabel(n, 64),
      diameterNm: fractionToNm(n, 64),
      fraction: n + '/64',
    });
  }
  return out;
}

/** Curated numbered and letter drills covering every code used by this tap table. */
const TAP_CODE_SOURCE: Array<[string, number]> = [
  ['#43', 0.089],
  ['#42', 0.0935],
  ['#36', 0.1065],
  ['#33', 0.113],
  ['#29', 0.136],
  ['#25', 0.1495],
  ['#21', 0.159],
  ['#7', 0.201],
  ['#3', 0.213],
  ['F', 0.257],
  ['I', 0.272],
  ['Q', 0.332],
];

function buildTapCodes(): BitSizeRecord[] {
  return TAP_CODE_SOURCE.map(entry => ({
    id: 'code-' + entry[0].replace('#', 'n'),
    family: 'tapCodes' as BitFamily,
    label: entry[0],
    diameterNm: inToNm(entry[1]),
  })).sort((a, b) => a.diameterNm - b.diameterNm);
}

export const METRIC_BITS = buildMetric();
export const FRACTIONAL_BITS = buildFractional();
export const TAP_CODE_BITS = buildTapCodes();

export const BIT_FAMILIES: Array<{id: BitFamily; label: string}> = [
  {id: 'metric', label: 'Metric'},
  {id: 'fractional', label: 'Fractional'},
  {id: 'tapCodes', label: 'Tap codes'},
];

export function bitsForFamily(family: BitFamily): BitSizeRecord[] {
  if (family === 'fractional') {
    return FRACTIONAL_BITS;
  }
  if (family === 'tapCodes') {
    return TAP_CODE_BITS;
  }
  return METRIC_BITS;
}
