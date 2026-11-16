import React from 'react';
import {Animated, Pressable, StyleSheet} from 'react-native';
import {theme} from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

export type IconButtonProps = {
  Icon: React.ComponentType<any>;
  label: string;
  onPress: () => void;
  tone?: 'light' | 'dark' | 'accent';
  selected?: boolean;
  disabled?: boolean;
  size?: number;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

/** 48dp square target with a fixed 24dp vector icon. */
function IconButtonBase({
  Icon,
  label,
  onPress,
  tone = 'light',
  selected = false,
  disabled = false,
  size = 48,
}: IconButtonProps) {
  const {scale, onPressIn, onPressOut} = usePressScale(!disabled);
  const dark = tone === 'dark';
  const iconColor = disabled
    ? theme.colors.ui.borderStrong
    : tone === 'accent'
    ? theme.colors.accent
    : dark
    ? theme.colors.text.onDark
    : theme.colors.text.primary;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{disabled: disabled, selected: selected}}
      style={[styles.press, {width: size, height: size}]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.surface,
          dark ? styles.surfaceDark : styles.surfaceLight,
          selected ? styles.selected : null,
          disabled ? styles.disabled : null,
          {transform: [{scale: scale}]},
        ]}>
        <Icon size={24} color={iconColor} strokeWidth={1.5} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {alignItems: 'center', justifyContent: 'center'},
  surface: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.well,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  surfaceLight: {
    backgroundColor: theme.colors.ui.fill,
    borderColor: theme.colors.ui.border,
  },
  surfaceDark: {
    backgroundColor: theme.colors.ui.darkFill,
    borderColor: theme.colors.ui.darkBorder,
  },
  selected: {borderColor: theme.colors.accent, borderWidth: 2},
  disabled: {opacity: 0.45},
});

export const IconButton = React.memo(IconButtonBase);
export default IconButton;
