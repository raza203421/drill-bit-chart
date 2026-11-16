import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from '../constants/theme';

export type StatCardProps = {
  value: string;
  label: string;
  valueColor: string;
  tone?: 'light' | 'dark';
};

/**
 * Uniform reference pill. No raster icon: colour carries the semantics, so every
 * pill in a row is exactly the same shape. Width is 100% of its flex slot - never
 * flex:1 inside a flex:1 parent.
 */
function StatCardBase({value, label, valueColor, tone = 'light'}: StatCardProps) {
  const dark = tone === 'dark';
  return (
    <View
      style={[
        styles.card,
        dark ? styles.cardDark : styles.cardLight,
        {borderColor: valueColor + '55'},
      ]}>
      <View style={[styles.dot, {backgroundColor: valueColor}]} />
      <Text style={[styles.value, {color: valueColor}]} numberOfLines={1}>
        {value}
      </Text>
      <Text
        style={[
          styles.label,
          {color: dark ? theme.colors.text.dim : theme.colors.text.tertiary},
        ]}
        numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: theme.radius.card,
    borderWidth: 1,
    gap: 4,
  },
  cardLight: {backgroundColor: '#FFFFFFCC'},
  cardDark: {backgroundColor: theme.colors.chartSurface},
  dot: {width: 8, height: 8, borderRadius: 4, marginBottom: 2},
  value: {fontSize: 22, lineHeight: 28, fontWeight: '800', letterSpacing: -0.3},
  label: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

export const StatCard = React.memo(StatCardBase);
export default StatCard;
