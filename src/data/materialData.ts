/**
 * HSS twist-drill cutting-speed bands (Norseman drill feeds and speeds reference).
 * SFM endpoints are the stored source values; metric bands are conversions.
 */
const FT_PER_MIN_TO_M_PER_MIN = 0.3048;

export type MaterialId =
  | 'mildSteel'
  | 'stainless'
  | 'aluminum'
  | 'brassBronze'
  | 'softCastIron';

export type Material = {
  id: MaterialId;
  label: string;
  qualifier: string;
  sfmLow: number;
  sfmHigh: number;
  vcLow: number;
  vcHigh: number;
};

function make(
  id: MaterialId,
  label: string,
  qualifier: string,
  sfmLow: number,
  sfmHigh: number,
): Material {
  return {
    id,
    label,
    qualifier,
    sfmLow,
    sfmHigh,
    vcLow: sfmLow * FT_PER_MIN_TO_M_PER_MIN,
    vcHigh: sfmHigh * FT_PER_MIN_TO_M_PER_MIN,
  };
}

export const MATERIALS: Material[] = [
  make('mildSteel', 'Mild steel', '0.2-0.3% carbon', 80, 110),
  make('stainless', 'Stainless steel', 'general reference', 30, 50),
  make('aluminum', 'Aluminum', 'common alloys', 200, 300),
  make('brassBronze', 'Brass / bronze', 'ordinary grades', 150, 300),
  make('softCastIron', 'Soft cast iron', 'not chilled iron', 75, 125),
];

export function getMaterial(id: string): Material {
  for (let i = 0; i < MATERIALS.length; i++) {
    if (MATERIALS[i].id === id) {
      return MATERIALS[i];
    }
  }
  return MATERIALS[0];
}

export const isMaterialId = (id: string): boolean =>
  MATERIALS.some(m => m.id === id);
