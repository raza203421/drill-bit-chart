import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Info} from 'lucide-react-native';
import {theme} from '../constants/theme';

export type InlineNoticeProps = {
  text: string;
  tone?: 'information' | 'error';
  compact?: boolean;
};

/** Icon plus text with live-region semantics. */
function InlineNoticeBase({text, tone = 'information', compact = false}: InlineNoticeProps) {
  const error = tone === 'error';
  const color = error ? theme.colors.primary : theme.colors.accent;
  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.row,
        compact ? styles.compact : null,
        {backgroundColor: color + '14', borderColor: color + '66'},
      ]}>
      <Info size={24} color={color} strokeWidth={2} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: theme.radius.well,
    borderWidth: 1,
  },
  compact: {paddingVertical: 8},
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
});

export const InlineNotice = React.memo(InlineNoticeBase);
export default InlineNotice;
