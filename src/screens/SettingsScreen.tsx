import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ArrowLeft, Home} from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ContentSheet from '../components/ContentSheet';
import IconButton from '../components/IconButton';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import SettingsRow from '../components/SettingsRow';
import {MODULE_W, theme} from '../constants/theme';
import {Units} from '../utils/units';

export type SettingsScreenProps = {
  units: Units;
  haptics: boolean;
  reducedMotionPreference: boolean;
  reducedMotion: boolean;
  savedCount: number;
  onBack: () => void;
  onHome: () => void;
  onSetUnits: (units: Units) => void;
  onSetHaptics: (value: boolean) => void;
  onSetReducedMotion: (value: boolean) => void;
  onClearFavorites: () => void;
  onAbout: () => void;
};

export default function SettingsScreen({
  units,
  haptics,
  reducedMotionPreference,
  reducedMotion,
  savedCount,
  onBack,
  onHome,
  onSetUnits,
  onSetHaptics,
  onSetReducedMotion,
  onClearFavorites,
  onAbout,
}: SettingsScreenProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const selectMetric = useCallback(() => onSetUnits('metric'), [onSetUnits]);
  const selectImperial = useCallback(() => onSetUnits('imperial'), [onSetUnits]);
  const toggleHaptics = useCallback(() => onSetHaptics(!haptics), [haptics, onSetHaptics]);
  const toggleMotion = useCallback(
    () => onSetReducedMotion(!reducedMotionPreference),
    [onSetReducedMotion, reducedMotionPreference],
  );
  const openConfirm = useCallback(() => setConfirmOpen(true), []);
  const closeConfirm = useCallback(() => setConfirmOpen(false), []);
  const confirmClear = useCallback(() => {
    onClearFavorites();
    setConfirmOpen(false);
  }, [onClearFavorites]);

  return (
    <AppShell
      variant="settings"
      title="Settings"
      reducedMotion={reducedMotion}
      leftSlot={<IconButton Icon={ArrowLeft} label="Back" onPress={onBack} />}
      rightSlot={<IconButton Icon={Home} label="Home" onPress={onHome} />}>
      <ScrollView
        style={styles.region}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.module}>
          <View style={styles.stripe} />

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Preferred units</Text>
            <SettingsRow
              title="Metric"
              detail="mm and m/min"
              control="radio"
              value={units === 'metric'}
              onChange={selectMetric}
            />
            <View style={styles.divider} />
            <SettingsRow
              title="Imperial"
              detail="in and ft/min"
              control="radio"
              value={units === 'imperial'}
              onChange={selectImperial}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Feedback</Text>
            <SettingsRow
              title="Haptic feedback"
              detail="A short tap after a value is saved."
              control="switch"
              value={haptics}
              onChange={toggleHaptics}
            />
            <View style={styles.divider} />
            <SettingsRow
              title="Reduce motion"
              detail="Removes slide and scale animations."
              control="switch"
              value={reducedMotionPreference}
              onChange={toggleMotion}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>On-device data</Text>
            <Text style={styles.cardBody}>
              Favorites and preferences stay on this device.
            </Text>
            <View style={styles.divider} />
            <SettingsRow
              title="Clear favorites"
              detail={
                savedCount > 0 ? savedCount + ' saved values' : 'Nothing saved yet'
              }
              control="action"
              disabled={savedCount === 0}
              onChange={openConfirm}
            />
          </View>

          <View style={styles.card}>
            <SettingsRow
              title="About Drill Bit Chart"
              detail="Version, privacy policy and feedback"
              control="action"
              onChange={onAbout}
            />
          </View>
        </View>
      </ScrollView>

      <ContentSheet title="Clear favorites?" open={confirmOpen} onClose={closeConfirm}>
        <Text style={styles.sheetBody}>
          This removes every saved speed, thread and bit size. Unit settings and
          your calculator inputs are kept.
        </Text>
        <View style={styles.sheetActions}>
          <SecondaryButton label="KEEP FAVORITES" onPress={closeConfirm} />
          <PrimaryButton label="CLEAR FAVORITES" onPress={confirmClear} />
        </View>
      </ContentSheet>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  region: {flex: 1},
  content: {alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16},
  module: {width: MODULE_W, gap: 12},
  stripe: {
    width: 64,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  card: {
    width: '100%',
    borderRadius: theme.radius.card,
    padding: 16,
    backgroundColor: '#FFFFFFD9',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    shadowColor: theme.shadows.card.shadowColor,
    shadowOffset: theme.shadows.card.shadowOffset,
    shadowOpacity: theme.shadows.card.shadowOpacity,
    shadowRadius: theme.shadows.card.shadowRadius,
    elevation: theme.shadows.card.elevation,
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    paddingVertical: 6,
  },
  divider: {height: 1, backgroundColor: theme.colors.ui.hairline},
  sheetBody: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: theme.colors.text.secondary,
  },
  sheetActions: {gap: 12, marginTop: 16},
});
