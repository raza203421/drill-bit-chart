import {inToNm, mmToNm} from '../utils/units';

/**
 * Curated cutting-tap hole sizes (Guhring tap drill and decimal reference).
 * Exactly 31 records. Forming taps and unlisted pitches get no inferred result.
 */
export type ThreadFamily = 'metric' | 'unc' | 'unf';
export type ThreadSeries = 'coarse' | 'fine' | 'none';

export type TapDrillRecord = {
  id: string;
  family: ThreadFamily;
  series: ThreadSeries;
  designation: string;
  /** Metric pitch in millimetres, or null for inch threads. */
  pitchMm: number | null;
  /** Threads per inch for UNC/UNF, or null for metric. */
  tpi: number | null;
  drillLabel: string;
  drillNm: number;
};

function metric(
  nominal: number,
  pitchMm: number,
  series: ThreadSeries,
  drillMm: number,
): TapDrillRecord {
  return {
    id: 'metric-M' + nominal + '-' + pitchMm,
    family: 'metric',
    series,
    designation: 'M' + nominal + ' x ' + pitchMm.toFixed(pitchMm % 1 === 0 ? 1 : 2),
    pitchMm,
    tpi: null,
    drillLabel: drillMm.toFixed(2) + ' mm',
    drillNm: mmToNm(drillMm),
  };
}

function inch(
  family: 'unc' | 'unf',
  designation: string,
  tpi: number,
  drillLabel: string,
  drillInches: number,
): TapDrillRecord {
  return {
    id: family + '-' + designation.replace(/[^0-9A-Za-z]/g, '') + '-' + tpi,
    family,
    series: 'none',
    designation,
    pitchMm: null,
    tpi,
    drillLabel,
    drillNm: inToNm(drillInches),
  };
}

export const TAP_DRILLS: TapDrillRecord[] = [
  // Metric coarse - 11 records
  metric(3, 0.5, 'coarse', 2.5),
  metric(4, 0.7, 'coarse', 3.3),
  metric(5, 0.8, 'coarse', 4.2),
  metric(6, 1.0, 'coarse', 5.0),
  metric(8, 1.25, 'coarse', 6.8),
  metric(10, 1.5, 'coarse', 8.5),
  metric(12, 1.75, 'coarse', 10.2),
  metric(14, 2.0, 'coarse', 12.0),
  metric(16, 2.0, 'coarse', 14.0),
  metric(18, 2.5, 'coarse', 15.5),
  metric(20, 2.5, 'coarse', 17.5),
  // Metric fine - 4 records
  metric(6, 0.75, 'fine', 5.25),
  metric(8, 1.0, 'fine', 7.0),
  metric(10, 1.0, 'fine', 9.0),
  metric(12, 1.5, 'fine', 10.5),
  // UNC - 8 records
  inch('unc', '#4-40', 40, '#43', 0.089),
  inch('unc', '#6-32', 32, '#36', 0.1065),
  inch('unc', '#8-32', 32, '#29', 0.136),
  inch('unc', '#10-24', 24, '#25', 0.1495),
  inch('unc', '1/4-20', 20, '#7', 0.201),
  inch('unc', '5/16-18', 18, 'F', 0.257),
  inch('unc', '3/8-16', 16, '5/16 in', 0.3125),
  inch('unc', '1/2-13', 13, '27/64 in', 0.421875),
  // UNF - 8 records
  inch('unf', '#4-48', 48, '#42', 0.0935),
  inch('unf', '#6-40', 40, '#33', 0.113),
  inch('unf', '#8-36', 36, '#29', 0.136),
  inch('unf', '#10-32', 32, '#21', 0.159),
  inch('unf', '1/4-28', 28, '#3', 0.213),
  inch('unf', '5/16-24', 24, 'I', 0.272),
  inch('unf', '3/8-24', 24, 'Q', 0.332),
  inch('unf', '1/2-20', 20, '29/64 in', 0.453125),
];

export function threadSecondaryLine(record: TapDrillRecord): string {
  if (record.pitchMm !== null) {
    return 'Pitch ' + record.pitchMm.toFixed(2) + ' mm';
  }
  return record.tpi + ' TPI';
}

export function findThread(id: string): TapDrillRecord | null {
  for (let i = 0; i < TAP_DRILLS.length; i++) {
    if (TAP_DRILLS[i].id === id) {
      return TAP_DRILLS[i];
    }
  }
  return null;
}
