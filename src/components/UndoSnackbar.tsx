import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text} from 'react-native';
import {SNACKBAR_MS, VALUE_FADE_MS} from '../constants/config';
import {theme} from '../constants/theme';

export type UndoSnackbarProps = {
  text: string;
  visible: boolean;
  onUndo: () => void;
  onDismiss: () => void;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

/** Sits above the controls and navigation; auto-dismisses after 4000ms. */
function UndoSnackbarBase({text, visible, onUndo, onDismiss}: UndoSnackbarProps) {
  const fade = useRef(new Animated.Value(0)).current;
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  useEffect(() => {
    if (!visible) {
      fade.setValue(0);
      return;
    }
    Animated.timing(fade, {
      toValue: 1,
      duration: VALUE_FADE_MS,
      useNativeDriver: true,
    }).start();
    const timer = setTimeout(() => dismissRef.current(), SNACKBAR_MS);
    return () => clearTimeout(timer);
  }, [fade, visible]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="box-none"
      accessibilityLiveRegion="polite"
      style={[styles.bar, {opacity: fade}]}>
      <Text style={styles.text} numberOfLines={2}>
        {text}
      </Text>
      <Pressable
        onPress={onUndo}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel="Undo remove"
        style={styles.action}>
        <Text style={styles.actionLabel}>UNDO</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: theme.radius.well,
    backgroundColor: theme.colors.chartSurface,
    borderWidth: 1,
    borderColor: theme.colors.ui.accentBorder,
    elevation: 6,
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.colors.text.onDark,
  },
  action: {
    minWidth: 72,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.accent,
  },
});

export const UndoSnackbar = React.memo(UndoSnackbarBase);
export default UndoSnackbar;
