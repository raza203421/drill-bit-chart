import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {ArrowLeft, ChevronDown, Gauge} from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ContentSheet from '../components/ContentSheet';
import CustomSizeSheet from '../components/CustomSizeSheet';
import DiameterControl from '../components/DiameterControl';
import IconButton from '../components/IconButton';
import InlineNotice from '../components/InlineNotice';
import MaterialPicker from '../components/MaterialPicker';
import PrimaryButton from '../components/PrimaryButton';
import RpmPanel from '../components/RpmPanel';
import SecondaryButton from '../components/SecondaryButton';
import SizePicker from '../components/SizePicker';
import {TabId} from '../components/BottomTabs';
import {MODULE_W, theme} from '../constants/theme';
import {BitFamily, BitSizeRecord} from '../data/bitSizeData';
import {MATERIALS, MaterialId} from '../data/materialData';
import {CalculatorApi} from '../hooks/useCalculator';
import {formatVc} from '../utils/formatters';
import {Units} from '../utils/units';

export type GameScreenProps = {
  calculator: CalculatorApi;
  units: Units;
  reducedMotion: boolean;
  onBack: () => void;
  onToggleUnits: () => void;
  onCalculate: () => void;
  onSelectTab: (id: TabId) => void;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

const HOW_IT_WORKS =
  'Spindle speed n = 1000 x Vc / (pi x D), where Vc is the cutting speed in ' +
  'metres per minute and D is the drill diameter in millimetres. The starting ' +
  'speed uses the lower end of the material band; the reference range spans the ' +
  'full band. Values are rounded down for display: to a multiple of 10 at or ' +
  'above 100 RPM, and to a whole RPM below that. Figures assume general-purpose ' +
  'HSS twist drills and do not estimate feed rate, hole depth or alloy grade.';

export default function GameScreen({
  calculator,
  units,
  reducedMotion,
  onBack,
  onToggleUnits,
  onCalculate,
  onSelectTab,
}: GameScreenProps) {
  const [materialOpen, setMaterialOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);
  const [family, setFamily] = useState<BitFamily>('metric');

  const {
    materialId,
    materialLabel,
    materialQualifier,
    diameterNm,
    sizeLabel,
    valid,
    preview,
    inputError,
    canStepDown,
    canStepUp,
    setMaterial,
    stepDiameter,
    applyDiameter,
  } = calculator;

  const openMaterial = useCallback(() => setMaterialOpen(true), []);
  const closeMaterial = useCallback(() => setMaterialOpen(false), []);
  const openSize = useCallback(() => setSizeOpen(true), []);
  const closeSize = useCallback(() => setSizeOpen(false), []);
  const openCustom = useCallback(() => setCustomOpen(true), []);
  const closeCustom = useCallback(() => setCustomOpen(false), []);
  const openHow = useCallback(() => setHowOpen(true), []);
  const closeHow = useCallback(() => setHowOpen(false), []);

  const handleMaterial = useCallback(
    (id: MaterialId) => {
      setMaterial(id);
      setMaterialOpen(false);
    },
    [setMaterial],
  );

  const handleSize = useCallback(
    (record: BitSizeRecord) => {
      applyDiameter(record.diameterNm, record.label);
      setSizeOpen(false);
    },
    [applyDiameter],
  );

  const handleCustom = useCallback(
    (nm: number, label: string) => {
      applyDiameter(nm, label);
      setCustomOpen(false);
    },
    [applyDiameter],
  );

  const material = MATERIALS.filter(item => item.id === materialId)[0] || MATERIALS[0];

  return (
    <AppShell
      variant="calculator"
      title="Speed Calc"
      reducedMotion={reducedMotion}
      selectedTab="game"
      onSelectTab={onSelectTab}
      leftSlot={<IconButton Icon={ArrowLeft} label="Back to hub" onPress={onBack} />}
      rightSlot={
        <Pressable
          onPress={onToggleUnits}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel={'Units, currently ' + (units === 'metric' ? 'millimetres' : 'inches')}
          style={styles.unitsBadge}>
          <Text style={styles.unitsText}>{units === 'metric' ? 'mm' : 'in'}</Text>
        </Pressable>
      }
      footer={
        <View style={styles.controls}>
          <View style={styles.controlsInner}>
            <View style={styles.controlsLine}>
              <Text style={styles.controlsLabel} numberOfLines={1}>
                Cutting speed
              </Text>
              <Text style={styles.controlsValue} numberOfLines={1}>
                {formatVc(material.vcLow, units)}
              </Text>
            </View>
            <Text style={styles.controlsNote} numberOfLines={2}>
              {material.label}: {material.qualifier}
            </Text>
            <PrimaryButton
              label="CALCULATE RPM"
              Icon={Gauge}
              onPress={onCalculate}
              disabled={!valid}
              accessibilityLabel="Calculate RPM"
            />
          </View>
        </View>
      }>
      <ScrollView
        style={styles.region}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.module}>
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Material</Text>
            <Pressable
              onPress={openMaterial}
              hitSlop={HIT}
              accessibilityRole="button"
              accessibilityLabel={'Material, ' + materialLabel}
              style={styles.pickerRow}>
              <View style={styles.pickerText}>
                <Text style={styles.pickerValue} numberOfLines={1}>
                  {materialLabel}
                </Text>
                <Text style={styles.pickerQualifier} numberOfLines={1}>
                  {materialQualifier}
                </Text>
              </View>
              <ChevronDown size={24} color={theme.colors.text.tertiary} strokeWidth={2} />
            </Pressable>
          </View>

          <DiameterControl
            diameterNm={diameterNm}
            units={units}
            sourceLabel={sizeLabel}
            canStepDown={canStepDown}
            canStepUp={canStepUp}
            onStep={stepDiameter}
            onOpenPicker={openSize}
            onOpenCustom={openCustom}
          />

          {inputError ? <InlineNotice text={inputError} tone="error" /> : null}

          <RpmPanel
            result={valid ? preview : null}
            variant="preview"
            reducedMotion={reducedMotion}
            emptyMessage="Enter a valid diameter to see a starting speed."
          />

          <SecondaryButton label="HOW THIS WORKS" onPress={openHow} />
        </View>
      </ScrollView>

      <MaterialPicker
        open={materialOpen}
        materials={MATERIALS}
        selectedMaterialId={materialId}
        onSelect={handleMaterial}
        onClose={closeMaterial}
      />

      <SizePicker
        open={sizeOpen}
        family={family}
        units={units}
        selectedDiameterNm={diameterNm}
        onFamilyChange={setFamily}
        onSelect={handleSize}
        onClose={closeSize}
      />

      <CustomSizeSheet
        open={customOpen}
        units={units}
        initialDiameterNm={diameterNm}
        onApply={handleCustom}
        onClose={closeCustom}
      />

      <ContentSheet
        title="How this works"
        open={howOpen}
        onClose={closeHow}
        footer={<SecondaryButton label="CLOSE" onPress={closeHow} />}>
        <Text style={styles.sheetBody}>{HOW_IT_WORKS}</Text>
      </ContentSheet>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  region: {flex: 1},
  content: {alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16},
  module: {width: MODULE_W, gap: 12},
  unitsBadge: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.well,
    backgroundColor: theme.colors.ui.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.ui.accentBorder,
  },
  unitsText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  card: {
    width: '100%',
    borderRadius: theme.radius.card,
    padding: 16,
    gap: 10,
    backgroundColor: '#FFFFFFD9',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    shadowColor: theme.shadows.card.shadowColor,
    shadowOffset: theme.shadows.card.shadowOffset,
    shadowOpacity: theme.shadows.card.shadowOpacity,
    shadowRadius: theme.shadows.card.shadowRadius,
    elevation: theme.shadows.card.elevation,
  },
  cardHeading: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  pickerRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radius.well,
    backgroundColor: theme.colors.ui.fillStrong,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
  },
  pickerText: {flex: 1},
  pickerValue: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  pickerQualifier: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.tertiary,
  },
  controls: {
    borderTopLeftRadius: theme.radius.feature,
    borderTopRightRadius: theme.radius.feature,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.border,
    backgroundColor: '#F2EADFF2',
  },
  controlsInner: {paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14, gap: 8},
  controlsLine: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12},
  controlsLabel: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.tertiary,
  },
  controlsValue: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  controlsNote: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  sheetBody: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: theme.colors.text.secondary,
  },
});
