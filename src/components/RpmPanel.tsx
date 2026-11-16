import React, {useEffect, useRef} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {assets} from '../assets';
import {VALUE_FADE_MS} from '../constants/config';
import {CHART_PAD, theme} from '../constants/theme';
import {EXCEEDS_MACHINE_RANGE, RpmResult} from '../game/calculateRpm';
import {formatRpm} from '../utils/formatters';

export type RpmPanelProps = {
  result: RpmResult | null;
  variant: 'preview' | 'result';
  emptyMessage?: string;
  reducedMotion?: boolean;
  children?: React.ReactNode;
};

/** Matte chart panel with stable tabular RPM figures and labelled assumptions. */
function RpmPanelBase({
  result,
  variant,
  emptyMessage,
  reducedMotion = false,
  children,
}: RpmPanelProps) {
  const isResult = variant === 'result';
  const fade = useRef(new Animated.Value(1)).current;
  const value = result ? result.startRpm : 0;

  useEffect(() => {
    if (reducedMotion) {
      fade.setValue(1);
      return;
    }
    fade.setValue(0.25);
    Animated.timing(fade, {
      toValue: 1,
      duration: VALUE_FADE_MS,
      useNativeDriver: true,
    }).start();
  }, [fade, value, reducedMotion]);

  return (
    <LinearGradient
      colors={[theme.gradients.panel[0], theme.gradients.panel[1]]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[styles.panel, isResult ? styles.panelResult : styles.panelPreview]}>
      <View style={styles.frame}>
        <Text style={styles.caption}>
          {isResult ? 'SUGGESTED STARTING SPEED' : 'STARTING ESTIMATE'}
        </Text>

        {result ? (
          <Animated.View style={{opacity: fade}}>
            <View style={styles.valueRow}>
              <Text
                style={isResult ? styles.heroValue : styles.previewValue}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.72}
                accessibilityLiveRegion="polite">
                {formatRpm(result.startRpm)}
              </Text>
              <Text style={styles.unit}>RPM</Text>
            </View>
            <Text style={styles.range}>
              Reference range {formatRpm(result.startRpm)}-{formatRpm(result.endRpm)} RPM
            </Text>
          </Animated.View>
        ) : (
          <Text style={styles.empty}>
            {emptyMessage || 'Enter a valid diameter to see a starting speed.'}
          </Text>
        )}

        <Text style={styles.assumption}>HSS twist drill</Text>

        {result && result.startRpm > EXCEEDS_MACHINE_RANGE ? (
          <Text style={styles.warning}>Check machine speed range</Text>
        ) : null}

        {children ? <View style={styles.slot}>{children}</View> : null}
      </View>

      <Image
        source={assets.sprite4}
        style={isResult ? styles.spriteResult : styles.spritePreview}
        resizeMode="contain"
        accessible={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    borderRadius: theme.radius.feature,
    borderWidth: 1,
    padding: CHART_PAD,
    overflow: 'hidden',
  },
  panelPreview: {minHeight: 112, borderColor: theme.colors.ui.accentLine},
  panelResult: {
    minHeight: 224,
    borderColor: theme.colors.ui.accentBorder,
    shadowColor: theme.shadows.dark.shadowColor,
    shadowOffset: theme.shadows.dark.shadowOffset,
    shadowOpacity: theme.shadows.dark.shadowOpacity,
    shadowRadius: theme.shadows.dark.shadowRadius,
    elevation: theme.shadows.dark.elevation,
  },
  frame: {flex: 1, padding: 10, gap: 4},
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.accent,
  },
  valueRow: {flexDirection: 'row', alignItems: 'flex-end', gap: 8},
  heroValue: {
    fontSize: 56,
    lineHeight: 64,
    fontWeight: '800',
    letterSpacing: -1,
    color: theme.colors.text.onDark,
    fontVariant: ['tabular-nums'],
  },
  previewValue: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: theme.colors.text.onDark,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.dim,
    paddingBottom: 6,
  },
  range: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.colors.text.dim,
  },
  empty: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: theme.colors.text.dim,
    paddingVertical: 8,
  },
  assumption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    letterSpacing: 0.4,
    color: '#DDD2B0B3',
  },
  warning: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  slot: {marginTop: 10, gap: 10},
  spritePreview: {position: 'absolute', right: 10, bottom: 10, width: 44, height: 44, opacity: 0.85},
  spriteResult: {position: 'absolute', right: 14, bottom: 14, width: 64, height: 64, opacity: 0.9},
});

export const RpmPanel = React.memo(RpmPanelBase);
export default RpmPanel;
