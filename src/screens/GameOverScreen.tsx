import React, {useCallback, useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {ArrowLeft, Check, Hash, Home, Star} from 'lucide-react-native';
import {assets} from '../assets';
import AppShell from '../components/AppShell';
import ContentSheet from '../components/ContentSheet';
import IconButton from '../components/IconButton';
import PrimaryButton from '../components/PrimaryButton';
import RpmPanel from '../components/RpmPanel';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import {MODULE_W, theme} from '../constants/theme';
import {RpmResult} from '../game/calculateRpm';
import {getMaterial} from '../data/materialData';
import {
  formatConverted,
  formatDiameter,
  formatRpm,
  formatVc,
} from '../utils/formatters';
import {Units} from '../utils/units';

export type GameOverScreenProps = {
  result: RpmResult;
  sizeLabel: string;
  units: Units;
  saved: boolean;
  saving: boolean;
  reducedMotion: boolean;
  onSave: () => void;
  onBack: () => void;
  onHome: () => void;
  onOpenTapDrill: () => void;
  onCalculateAgain: () => void;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

const ASSUMPTIONS =
  'Cutting speeds are HSS twist-drill reference bands. The starting value uses ' +
  'the lower end of the band for the selected material, and the reference range ' +
  'spans the whole band. Spindle speed n = 1000 x Vc / (pi x D). The reference ' +
  'range is advisory, not a confidence interval, and no machine speed limit is ' +
  'applied to the calculation.';

/** Result route: a committed, immutable snapshot on a visibly darker screen. */
export default function GameOverScreen({
  result,
  sizeLabel,
  units,
  saved,
  saving,
  reducedMotion,
  onSave,
  onBack,
  onHome,
  onOpenTapDrill,
  onCalculateAgain,
}: GameOverScreenProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const openDetails = useCallback(() => setDetailsOpen(true), []);
  const closeDetails = useCallback(() => setDetailsOpen(false), []);

  const material = getMaterial(result.materialId);

  const lines = [
    {label: 'Material', value: material.label},
    {label: 'Selected size', value: sizeLabel},
    {label: 'Diameter', value: formatDiameter(result.diameterNm, units)},
    {label: 'Converted', value: formatConverted(result.diameterNm, units)},
    {label: 'Starting speed', value: formatRpm(result.startRpm) + ' RPM'},
    {
      label: 'Reference range',
      value: formatRpm(result.startRpm) + '-' + formatRpm(result.endRpm) + ' RPM',
    },
  ];

  return (
    <AppShell
      variant="result"
      title="Suggested RPM"
      tone="dark"
      reducedMotion={reducedMotion}
      leftSlot={
        <IconButton Icon={ArrowLeft} label="Back to speed calc" tone="dark" onPress={onBack} />
      }
      rightSlot={<IconButton Icon={Home} label="Home" tone="dark" onPress={onHome} />}
      footer={
        <View style={styles.controls}>
          <View style={styles.controlsInner}>
            <Text style={styles.controlsNote} numberOfLines={3}>
              Suggested starting speed for HSS twist drills. Match your tool and
              machine specifications.
            </Text>
            <PrimaryButton
              label="OPEN TAP DRILL"
              Icon={Hash}
              onPress={onOpenTapDrill}
              accessibilityLabel="Open tap drill reference"
            />
            <SecondaryButton
              label="CALCULATE AGAIN"
              onPress={onCalculateAgain}
              accessibilityLabel="Calculate again with the same inputs"
            />
          </View>
        </View>
      }>
      <ScrollView
        style={styles.region}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.module}>
          <RpmPanel result={result} variant="result" reducedMotion={reducedMotion} />

          <View style={styles.statsRow}>
            <View style={styles.statSlot}>
              <StatCard
                value={formatVc(result.vcLow, units).split(' ')[0]}
                label={units === 'metric' ? 'vc m/min' : 'vc ft/min'}
                valueColor={theme.colors.accent}
                tone="dark"
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                value={formatRpm(result.endRpm)}
                label="range top"
                valueColor={theme.colors.primary}
                tone="dark"
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                value={formatDiameter(result.diameterNm, units).split(' ')[0]}
                label={units === 'metric' ? 'diameter mm' : 'diameter in'}
                valueColor="#C9B892"
                tone="dark"
              />
            </View>
          </View>

          <View style={styles.infoCard}>
            {lines.map(line => (
              <View key={line.label} style={styles.line}>
                <Text style={styles.lineLabel} numberOfLines={2}>
                  {line.label}
                </Text>
                <Text style={styles.lineValue} numberOfLines={2}>
                  {line.value}
                </Text>
              </View>
            ))}

            <Pressable
              onPress={onSave}
              hitSlop={HIT}
              disabled={saving}
              accessibilityRole="button"
              accessibilityLabel={saved ? 'Setup saved' : 'Save setup'}
              accessibilityState={{checked: saved, disabled: saving}}
              style={styles.saveRow}>
              <View style={styles.saveIcon}>
                {saved ? (
                  <Check size={24} color={theme.colors.accent} strokeWidth={2.4} />
                ) : (
                  <Star size={24} color={theme.colors.text.dim} strokeWidth={2} />
                )}
              </View>
              <Text style={[styles.saveLabel, saved ? styles.saveLabelOn : null]}>
                {saved ? 'Saved' : 'Save setup'}
              </Text>
            </Pressable>

            <SecondaryButton label="DETAILS" tone="dark" onPress={openDetails} />
          </View>

          <View style={styles.nextCard}>
            <Image
              source={assets.sprite5}
              style={styles.nextSprite}
              resizeMode="contain"
              accessible={false}
            />
            <View style={styles.nextText}>
              <Text style={styles.nextTitle} numberOfLines={2}>
                Need a tapped hole?
              </Text>
              <Text style={styles.nextBody} numberOfLines={3}>
                Tap Drill keeps this material and opens the full thread table. A
                diameter alone does not identify a thread.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <ContentSheet
        title="Reference assumptions"
        open={detailsOpen}
        onClose={closeDetails}
        tone="dark"
        footer={<SecondaryButton label="CLOSE" tone="dark" onPress={closeDetails} />}>
        <Text style={styles.sheetBody}>{ASSUMPTIONS}</Text>
      </ContentSheet>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  region: {flex: 1},
  content: {alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16},
  module: {width: MODULE_W, gap: 12},
  statsRow: {flexDirection: 'row', gap: 12},
  statSlot: {flex: 1},
  infoCard: {
    width: '100%',
    borderRadius: theme.radius.card,
    padding: 16,
    gap: 2,
    backgroundColor: '#18181CE6',
    borderWidth: 1,
    borderColor: theme.colors.ui.darkBorder,
  },
  line: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD2B01F',
  },
  lineLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.colors.text.dim,
  },
  lineValue: {
    flexShrink: 1,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.onDark,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  saveRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  saveIcon: {width: 48, height: 48, alignItems: 'center', justifyContent: 'center'},
  saveLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.dim,
  },
  saveLabelOn: {color: theme.colors.accent},
  nextCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: theme.radius.card,
    padding: 14,
    backgroundColor: '#1F1F24E6',
    borderWidth: 1,
    borderColor: theme.colors.ui.darkBorder,
  },
  nextSprite: {width: 56, height: 56},
  nextText: {flex: 1, gap: 2},
  nextTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: theme.colors.text.onDark,
  },
  nextBody: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.dim,
  },
  controls: {
    borderTopLeftRadius: theme.radius.feature,
    borderTopRightRadius: theme.radius.feature,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.border,
    backgroundColor: '#F2EADFF2',
  },
  controlsInner: {paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, gap: 12},
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
    color: theme.colors.text.dim,
  },
});
