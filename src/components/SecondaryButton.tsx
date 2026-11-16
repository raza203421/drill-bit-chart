import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {theme} from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

export type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  Icon?: React.ComponentType<any>;
  tone?: 'light' | 'dark';
  disabled?: boolean;
  accessibilityLabel?: string;
  flex?: boolean;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

/** 48dp bordered action. Same 24dp icon size and 10dp gap as PrimaryButton. */
function SecondaryButtonBase({
  label,
  onPress,
  Icon,
  tone = 'light',
  disabled = false,
  accessibilityLabel,
  flex = false,
}: SecondaryButtonProps) {
  const {scale, onPressIn, onPressOut} = usePressScale(!disabled);
  const dark = tone === 'dark';
  const textColor = dark ? theme.colors.text.onDark : theme.colors.text.primary;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{disabled: disabled}}
      style={[
        styles.press,
        flex ? styles.flexPress : styles.fullPress,
        disabled ? styles.disabled : null,
      ]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.anim,
          dark ? styles.dark : styles.light,
          {transform: [{scale: scale}]},
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={24} color={textColor} strokeWidth={2} /> : null}
          <Text style={[styles.label, {color: textColor}]} numberOfLines={2}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {height: 48, borderRadius: theme.radius.well},
  fullPress: {width: '100%'},
  flexPress: {flex: 1},
  disabled: {opacity: 0.45},
  anim: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.well,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  light: {
    backgroundColor: theme.colors.ui.fill,
    borderColor: theme.colors.ui.borderStrong,
  },
  dark: {
    backgroundColor: theme.colors.ui.darkFill,
    borderColor: theme.colors.ui.darkBorderStrong,
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
    textAlign: 'center',
  },
});

export const SecondaryButton = React.memo(SecondaryButtonBase);
export default SecondaryButton;
