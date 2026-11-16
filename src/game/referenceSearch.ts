import {BitSizeRecord} from '../data/bitSizeData';
import {TapDrillRecord} from '../data/tapDrillData';

/** Trim, lowercase, normalise multiplication signs and keep the # prefix meaningful. */
export function normalizeQuery(raw: string): string {
  return (raw || '')
    .trim()
    .toLowerCase()
    .replace(/[×✕✖]/g, 'x')
    .replace(/\s+/g, ' ');
}

function haystack(text: string): string {
  return normalizeQuery(text).replace(/\s+/g, '');
}

export function filterThreads(
  rows: TapDrillRecord[],
  family: string,
  series: string,
  query: string,
): TapDrillRecord[] {
  const q = haystack(query);
  const scoped = rows.filter(row => {
    if (row.family !== family) {
      return false;
    }
    if (family === 'metric' && series !== 'all' && row.series !== series) {
      return false;
    }
    return true;
  });
  if (!q) {
    return scoped;
  }
  return scoped.filter(
    row => haystack(row.designation).indexOf(q) !== -1 || haystack(row.drillLabel).indexOf(q) !== -1,
  );
}

export function filterBits(rows: BitSizeRecord[], query: string): BitSizeRecord[] {
  const q = haystack(query);
  if (!q) {
    return rows;
  }
  return rows.filter(row => {
    if (haystack(row.label).indexOf(q) !== -1) {
      return true;
    }
    return row.fraction ? haystack(row.fraction).indexOf(q) !== -1 : false;
  });
}
