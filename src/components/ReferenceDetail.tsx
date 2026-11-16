import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Check, Star} from 'lucide-react-native';
import {theme} from '../constants/theme';
import ContentSheet from './ContentSheet';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export type DetailLine = {label: string; value: string};

export type ReferenceDetailProps = {
  open: boolean;
  title: string;
  lines: DetailLine[];
  saved: boolean;
  saving: boolean;
  onSave: () => void;
  onUseInCalculator: () => void;
  onClose: () => void;
};

/** Dark detail card with the exact canonical diameter and a single use action. */
function ReferenceDetailBase({
  open,
  title,
  lines,
  saved,
  saving,
  onSave,
  onUseInCalculator,
  onClose,
}: ReferenceDetailProps) {
  return (
    <ContentSheet
      title={title}
      open={open}
      onClose={onClose}
      tone="dark"
      footer={
        <View style={styles.footer}>
          <SecondaryButton
            label={saved ? 'SAVED' : 'SAVE REFERENCE'}
            Icon={saved ? Check : Star}
            tone="dark"
            disabled={saving}
            onPress={onSave}
            accessibilityLabel={saved ? 'Saved reference' : 'Save reference'}
          />
          <PrimaryButton label="USE IN SPEED CALC" onPress={onUseInCalculator} />
        </View>
      }>
      <View style={styles.body}>
        {lines.map(line => (
          <View key={line.label} style={styles.line}>
            <Text style={styles.label} numberOfLines={2}>
              {line.label}
            </Text>
            <Text style={styles.value} numberOfLines={2}>
              {line.value}
            </Text>
          </View>
        ))}
      </View>
    </ContentSheet>
  );
}

const styles = StyleSheet.create({
  body: {gap: 2, paddingBottom: 4},
  line: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.darkBorder,
  },
  label: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.colors.text.dim,
  },
  value: {
    flexShrink: 1,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.onDark,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  footer: {gap: 12},
});

export const ReferenceDetail = React.memo(ReferenceDetailBase);
export default ReferenceDetail;
