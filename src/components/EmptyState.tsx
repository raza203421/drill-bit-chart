import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from '../constants/theme';
import PrimaryButton from './PrimaryButton';

export type EmptyStateProps = {
  Icon: React.ComponentType<any>;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'light' | 'dark';
};

/** Meaningful local recovery, never a bare empty box. */
function EmptyStateBase({
  Icon,
  title,
  body,
  actionLabel,
  onAction,
  tone = 'light',
}: EmptyStateProps) {
  const dark = tone === 'dark';
  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: theme.colors.ui.accentSoft,
            borderColor: theme.colors.ui.accentBorder,
          },
        ]}>
        <Icon size={32} color={theme.colors.accent} strokeWidth={1.6} />
      </View>
      <Text
        style={[
          styles.title,
          {color: dark ? theme.colors.text.onDark : theme.colors.text.primary},
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.body,
          {color: dark ? theme.colors.text.dim : theme.colors.text.tertiary},
        ]}>
        {body}
      </Text>
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <PrimaryButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20, gap: 8},
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: {fontSize: 20, lineHeight: 26, fontWeight: '700', textAlign: 'center'},
  body: {fontSize: 16, lineHeight: 24, fontWeight: '400', textAlign: 'center'},
  action: {width: '100%', maxWidth: 320, marginTop: 14},
});

export const EmptyState = React.memo(EmptyStateBase);
export default EmptyState;
