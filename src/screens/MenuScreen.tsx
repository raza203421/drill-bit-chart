import React, {useCallback} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {ChevronRight, Gauge, Hash, Info, Ruler, Settings, Star} from 'lucide-react-native';
import {assets} from '../assets';
import AppShell from '../components/AppShell';
import IconButton from '../components/IconButton';
import InlineNotice from '../components/InlineNotice';
import PrimaryButton from '../components/PrimaryButton';
import StatCard from '../components/StatCard';
import ToolTile from '../components/ToolTile';
import {
  BENTO_FEATURED_H,
  BENTO_FEATURED_W,
  BENTO_GAP,
  BENTO_SMALL_H,
  BENTO_SMALL_W,
  MODULE_W,
  theme,
} from '../constants/theme';
import {FRACTIONAL_BITS, METRIC_BITS, TAP_CODE_BITS} from '../data/bitSizeData';
import {MATERIALS} from '../data/materialData';
import {TAP_DRILLS} from '../data/tapDrillData';

export type MenuScreenProps = {
  savedCount: number;
  setupLabel: string;
  notice: string | null;
  reducedMotion: boolean;
  onStartCalc: () => void;
  onTapDrill: () => void;
  onBitSizes: () => void;
  onFavorites: () => void;
  onSettings: () => void;
  onAbout: () => void;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

const TOTAL_SIZES = METRIC_BITS.length + FRACTIONAL_BITS.length + TAP_CODE_BITS.length;

/** M3 Bento-Hub. The featured tile hosts the START action; it is not itself a Pressable. */
export default function MenuScreen({
  savedCount,
  setupLabel,
  notice,
  reducedMotion,
  onStartCalc,
  onTapDrill,
  onBitSizes,
  onFavorites,
  onSettings,
  onAbout,
}: MenuScreenProps) {
  const favoritesSubtitle =
    savedCount > 0
      ? savedCount + (savedCount === 1 ? ' saved value' : ' saved values')
      : 'Pin useful values for next time';

  const handleFavorites = useCallback(() => onFavorites(), [onFavorites]);

  return (
    <AppShell
      variant="hub"
      title="Drill Bit Chart"
      reducedMotion={reducedMotion}
      leftSlot={<IconButton Icon={Settings} label="Settings" onPress={onSettings} />}
      rightSlot={<IconButton Icon={Info} label="About" onPress={onAbout} />}>
      <ScrollView
        style={styles.region}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.module}>
          <Text style={styles.heading} numberOfLines={3}>
            Ready for the next hole?
          </Text>
          <Text style={styles.subheading} numberOfLines={2}>
            Pick a bit. Find a starting speed.
          </Text>

          {notice ? (
            <View style={styles.notice}>
              <InlineNotice text={notice} tone="information" compact />
            </View>
          ) : null}

          <View style={styles.bento}>
            <ToolTile
              title="Speed Calc"
              subtitle={setupLabel}
              Icon={Gauge}
              variant="featured"
              width={BENTO_FEATURED_W}
              height={BENTO_FEATURED_H}
              illustration={assets.sprite1}>
              <PrimaryButton
                label="START SPEED CALC"
                onPress={onStartCalc}
                accessibilityLabel="Start speed calc"
              />
            </ToolTile>

            <View style={styles.bentoColumn}>
              <ToolTile
                title="Tap Drill"
                subtitle="Thread to drill"
                Icon={Hash}
                variant="standard"
                width={BENTO_SMALL_W}
                height={BENTO_SMALL_H}
                onPress={onTapDrill}
              />
              <ToolTile
                title="Bit Sizes"
                subtitle="Metric and imperial"
                Icon={Ruler}
                variant="standard"
                width={BENTO_SMALL_W}
                height={BENTO_SMALL_H}
                onPress={onBitSizes}
              />
            </View>
          </View>

          <Pressable
            onPress={handleFavorites}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="Favorites"
            style={styles.wideTile}>
            <View style={styles.wideIcon}>
              <Star size={24} color={theme.colors.accent} strokeWidth={1.8} />
            </View>
            <View style={styles.wideText}>
              <Text style={styles.wideTitle} numberOfLines={1}>
                Favorites
              </Text>
              <Text style={styles.wideSubtitle} numberOfLines={1}>
                {favoritesSubtitle}
              </Text>
            </View>
            <ChevronRight size={24} color={theme.colors.text.tertiary} strokeWidth={2} />
          </Pressable>

          <View style={styles.statsRow}>
            <View style={styles.statSlot}>
              <StatCard
                value={String(MATERIALS.length)}
                label="materials"
                valueColor={theme.colors.primary}
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                value={String(TAP_DRILLS.length)}
                label="threads"
                valueColor={theme.colors.accent}
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard value={String(TOTAL_SIZES)} label="bit sizes" valueColor="#7A6A58" />
            </View>
          </View>

          <Text style={styles.footnote} numberOfLines={3}>
            Offline reference for HSS twist drills. Match your tool and machine
            specifications.
          </Text>
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  region: {flex: 1},
  content: {alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16},
  module: {width: MODULE_W, gap: BENTO_GAP},
  heading: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: theme.colors.text.primary,
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginTop: -4,
  },
  notice: {width: '100%'},
  bento: {flexDirection: 'row', gap: BENTO_GAP},
  bentoColumn: {gap: BENTO_GAP},
  wideTile: {
    width: '100%',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: theme.radius.card,
    backgroundColor: '#FFFFFFD9',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    shadowColor: theme.shadows.card.shadowColor,
    shadowOffset: theme.shadows.card.shadowOffset,
    shadowOpacity: theme.shadows.card.shadowOpacity,
    shadowRadius: theme.shadows.card.shadowRadius,
    elevation: theme.shadows.card.elevation,
  },
  wideIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.ui.accentBorder,
  },
  wideText: {flex: 1, gap: 1},
  wideTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  wideSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.tertiary,
  },
  statsRow: {flexDirection: 'row', gap: BENTO_GAP},
  statSlot: {flex: 1},
  footnote: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.tertiary,
    marginTop: 2,
  },
});
