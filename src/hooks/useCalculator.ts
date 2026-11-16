import {useCallback, useMemo, useState} from 'react';
import {
  MAX_DIAMETER_NM,
  MIN_DIAMETER_NM,
  STEP_IMPERIAL_NM,
  STEP_METRIC_NM,
} from '../constants/config';
import {calculateRpm, RpmResult} from '../game/calculateRpm';
import {getMaterial, MaterialId} from '../data/materialData';
import {formatDiameter} from '../utils/formatters';
import {Units} from '../utils/units';
import {AppStore} from './useAppStore';

export type CalculatorApi = {
  materialId: MaterialId;
  materialLabel: string;
  materialQualifier: string;
  diameterNm: number;
  /** Native label of the chosen size, e.g. "1/4 in" or "#7", else the plain value. */
  sizeLabel: string;
  valid: boolean;
  preview: RpmResult | null;
  result: RpmResult | null;
  inputError: string | null;
  canStepDown: boolean;
  canStepUp: boolean;
  setMaterial: (id: MaterialId) => void;
  stepDiameter: (direction: 1 | -1) => void;
  applyDiameter: (nm: number, label?: string) => void;
  setInputError: (message: string | null) => void;
  commitResult: () => RpmResult | null;
  clearResult: () => void;
};

export function useCalculator(store: AppStore, units: Units): CalculatorApi {
  const {commit, state} = store;
  const [sizeLabel, setSizeLabel] = useState<string | null>(null);
  const [result, setResult] = useState<RpmResult | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);

  const materialId = getMaterial(state.lastMaterialId).id;
  const diameterNm = state.lastDiameterNm;
  const material = getMaterial(materialId);
  const valid = diameterNm >= MIN_DIAMETER_NM && diameterNm <= MAX_DIAMETER_NM;

  const preview = useMemo(
    () => (valid ? calculateRpm(materialId, diameterNm) : null),
    [materialId, diameterNm, valid],
  );

  const setMaterial = useCallback(
    (id: MaterialId) => {
      setInputError(null);
      void commit({lastMaterialId: id});
    },
    [commit],
  );

  const applyDiameter = useCallback(
    (nm: number, label?: string) => {
      setInputError(null);
      setSizeLabel(label || null);
      void commit({lastDiameterNm: nm});
    },
    [commit],
  );

  const stepDiameter = useCallback(
    (direction: 1 | -1) => {
      const step = units === 'metric' ? STEP_METRIC_NM : STEP_IMPERIAL_NM;
      const raw = diameterNm + direction * step;
      if (raw < MIN_DIAMETER_NM || raw > MAX_DIAMETER_NM) {
        return;
      }
      setInputError(null);
      setSizeLabel(null);
      void commit({lastDiameterNm: raw});
    },
    [commit, diameterNm, units],
  );

  const commitResult = useCallback(() => {
    if (!valid) {
      return null;
    }
    const snapshot = calculateRpm(materialId, diameterNm);
    setResult(snapshot);
    return snapshot;
  }, [diameterNm, materialId, valid]);

  const clearResult = useCallback(() => setResult(null), []);

  const step = units === 'metric' ? STEP_METRIC_NM : STEP_IMPERIAL_NM;

  return {
    materialId,
    materialLabel: material.label,
    materialQualifier: material.qualifier,
    diameterNm,
    sizeLabel: sizeLabel || formatDiameter(diameterNm, units),
    valid,
    preview,
    result,
    inputError,
    canStepDown: diameterNm - step >= MIN_DIAMETER_NM,
    canStepUp: diameterNm + step <= MAX_DIAMETER_NM,
    setMaterial,
    stepDiameter,
    applyDiameter,
    setInputError,
    commitResult,
    clearResult,
  };
}
