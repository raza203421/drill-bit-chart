/** Factory-mandated splash duration. Must stay exactly 8000ms. */
export const LOADER_DURATION_MS = 8000;

/** Screen crossfade / content rise. */
export const TRANSITION_MS = 180;
export const VALUE_FADE_MS = 150;
export const SHEET_IN_MS = 200;
export const SHEET_OUT_MS = 150;
export const SNACKBAR_MS = 4000;
export const SEARCH_DEBOUNCE_MS = 150;

/** Stepper repeat behaviour. */
export const STEPPER_HOLD_DELAY_MS = 400;
export const STEPPER_REPEAT_MS = 120;

/** Physical diameter bounds, stored as integer nanometres. */
export const NM_PER_MM = 1000000;
export const MM_PER_INCH = 25.4;
export const MIN_DIAMETER_NM = 250000; // 0.25 mm
export const MAX_DIAMETER_NM = 25400000; // 25.40 mm

/** One metric stepper tap = 0.10 mm; one imperial tap = 1/64 in. */
export const STEP_METRIC_NM = 100000;
export const STEP_IMPERIAL_NM = Math.round((MM_PER_INCH / 64) * NM_PER_MM);

/** Defaults used on first launch and after malformed storage. */
export const DEFAULT_MATERIAL_ID = 'mildSteel';
export const DEFAULT_DIAMETER_NM = 6000000; // 6.00 mm
export const DEFAULT_UNITS: 'metric' | 'imperial' = 'metric';

export const SCHEMA_VERSION = 1;
export const REFERENCE_DATA_VERSION = 1;

export const APP_VERSION = '1.0.0';
export const APP_PACKAGE = 'com.drillbit.chart';
export const PRIVACY_VERSION = 'Policy version 1 · 13 November 2026';

export const ERROR_METRIC = 'Enter a diameter from 0.25 to 25.40 mm';
export const ERROR_IMPERIAL = 'Enter a diameter from 0.009843 to 1.000000 in';

export const BOTTOM_TABS_H = 72;
export const HEADER_TOP_PAD = 44;
export const HEADER_ROW_H = 72;
