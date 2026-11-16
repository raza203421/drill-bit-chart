import React, {useCallback, useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {Minus, Plus} from 'lucide-react-native';
import {STEPPER_HOLD_DELAY_MS, STEPPER_REPEAT_MS} from '../constants/config';
import {theme} from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';
import {formatConverted, formatDiameter} from '../utils/formatters';
import {Units} from '../utils/units';
import SecondaryButton from './SecondaryButton';

export type DiameterControlProps = {
  diameterNm: number;
  units: Units;
  sourceLabel: string;
  canStepDown: boolean;
  canStepUp: boolean;
  onStep: (direction: 1 | -1) => void;
  onOpenPicker: () => void;
  onOpenCustom: () => void;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

type StepperProps = {
  direction: 1 | -1;
  disabled: boolean;
  label: string;
  onStep: (direction: 1 | -1) => void;
};

function Stepper({direction, disabled, label, onStep}: StepperProps) {
  const {scale, onPressIn, onPressOut} = usePressScale(!disabled);
  const delayRef = useRef<any>(null);
  const repeatRef = useRef<any>(null);
  const stepRef = useRef(onStep);
  stepRef.current = onStep;

  const stop = useCallback(() => {
    if (delayRef.current) {
      clearTimeout(delayRef.current);
      delayRef.current = null;
    }
    if (repeatRef.current) {
      clearInterval(repeatRef.current);
      repeatRef.current = null;
    }
  }, []);

  useEffect(() => stop, [stop]);

  const handlePressIn = useCallback(() => {
    onPressIn();
    if (disabled) {
      return;
    }
    // Hold for 400ms, then repeat every 120ms. Haptics never fire on repeats.
    delayRef.current = setTimeout(() => {
      repeatRef.current = setInterval(() => stepRef.current(direction), STEPPER_REPEAT_MS);
    }, STEPPER_HOLD_DELAY_MS);
  }, [direction, disabled, onPressIn]);

  const handlePressOut = useCallback(() => {
    onPressOut();
    stop();
  }, [onPressOut, stop]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      stepRef.current(direction);
    }
  }, [direction, disabled]);

  const Icon = direction === 1 ? Plus : Minus;

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={HIT}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{disabled: disabled}}
      style={styles.stepPress}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.stepSurface,
          disabled ? styles.stepDisabled : null,
          {transform: [{scale: scale}]},
        ]}>
        <Icon size={24} color={theme.colors.text.primary} strokeWidth={2.4} />
      </Animated.View>
    </Pressable>
  );
}

const MemoStepper = React.memo(Stepper);

/** Exact-value steppers plus the chosen-size label. */
function DiameterControlBase({
  diameterNm,
  units,
  sourceLabel,
  canStepDown,
  canStepUp,
  onStep,
  onOpenPicker,
  onOpenCustom,
}: DiameterControlProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Bit diameter</Text>

      <View style={styles.valueRow}>
        <MemoStepper
          direction={-1}
          disabled={!canStepDown}
          label="Decrease diameter"
          onStep={onStep}
        />
        <View style={styles.valueWrap}>
          <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
            {formatDiameter(diameterNm, units)}
          </Text>
          <Text style={styles.converted} numberOfLines={1}>
            {formatConverted(diameterNm, units)}
          </Text>
        </View>
        <MemoStepper
          direction={1}
          disabled={!canStepUp}
          label="Increase diameter"
          onStep={onStep}
        />
      </View>

      <Text style={styles.source} numberOfLines={1}>
        Selected size: {sourceLabel}
      </Text>

      <View style={styles.actions}>
        <Pressable
          onPress={onOpenPicker}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Choose size from a size family"
          style={styles.pickerRow}>
          <Text style={styles.pickerLabel}>Choose size</Text>
          <Text style={styles.pickerHint}>Metric · Fractional · Tap codes</Text>
        </Pressable>
        <SecondaryButton label="CUSTOM SIZE" onPress={onOpenCustom} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: theme.radius.card,
    padding: 16,
    backgroundColor: '#FFFFFFD9',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    gap: 10,
    shadowColor: theme.shadows.card.shadowColor,
    shadowOffset: theme.shadows.card.shadowOffset,
    shadowOpacity: theme.shadows.card.shadowOpacity,
    shadowRadius: theme.shadows.card.shadowRadius,
    elevation: theme.shadows.card.elevation,
  },
  heading: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  valueRow: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  stepPress: {width: 48, height: 48, alignItems: 'center', justifyContent: 'center'},
  stepSurface: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.well,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.fillStrong,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
  },
  stepDisabled: {opacity: 0.45},
  valueWrap: {flex: 1, alignItems: 'center'},
  value: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  converted: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.tertiary,
  },
  source: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.primary,
  },
  actions: {gap: 10},
  pickerRow: {
    height: 56,
    borderRadius: theme.radius.well,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.ui.accentBorder,
  },
  pickerLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  pickerHint: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.tertiary,
  },
});

export const DiameterControl = React.memo(DiameterControlBase);
export default DiameterControl;
