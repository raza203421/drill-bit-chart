import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

export type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  Icon?: React.ComponentType<any>;
  disabled?: boolean;
  busy?: boolean;
  accessibilityLabel?: string;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

/**
 * 56dp gradient action. The icon is always exactly 24dp with a 10dp gap and the
 * label line height matches the icon, so nothing drifts between buttons.
 */
function PrimaryButtonBase({
  label,
  onPress,
  Icon,
  disabled = false,
  busy = false,
  accessibilityLabel,
}: PrimaryButtonProps) {
  const inactive = disabled || busy;
  const {scale, onPressIn, onPressOut} = usePressScale(!inactive);

  return (
    <Pressable
      onPress={inactive ? undefined : onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{disabled: inactive, busy: busy}}
      style={[styles.press, inactive ? styles.inactive : null]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.anim, {transform: [{scale: scale}]}]}>
        <LinearGradient
          colors={[theme.gradients.action[0], theme.gradients.action[1]]}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          style={styles.fill}>
          <View style={styles.row}>
            {Icon ? (
              <Icon size={24} color={theme.colors.text.primary} strokeWidth={2} />
            ) : null}
            <Text style={styles.label} numberOfLines={2}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 56,
    borderRadius: theme.radius.card,
    shadowColor: theme.shadows.button.shadowColor,
    shadowOffset: theme.shadows.button.shadowOffset,
    shadowOpacity: theme.shadows.button.shadowOpacity,
    shadowRadius: theme.shadows.button.shadowRadius,
    elevation: theme.shadows.button.elevation,
  },
  inactive: {opacity: 0.45, elevation: 0},
  anim: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.card,
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
});

export const PrimaryButton = React.memo(PrimaryButtonBase);
export default PrimaryButton;
