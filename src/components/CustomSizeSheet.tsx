import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {theme} from '../constants/theme';
import {formatIn, formatMm} from '../utils/formatters';
import {Units} from '../utils/units';
import {parseDiameterInput} from '../utils/validation';
import ContentSheet from './ContentSheet';
import InlineNotice from './InlineNotice';
import PrimaryButton from './PrimaryButton';

export type CustomSizeSheetProps = {
  open: boolean;
  units: Units;
  initialDiameterNm: number;
  onApply: (nm: number, label: string) => void;
  onClose: () => void;
};

/** Decimal entry with a visible unit suffix. Invalid input never calculates. */
function CustomSizeSheetBase({
  open,
  units,
  initialDiameterNm,
  onApply,
  onClose,
}: CustomSizeSheetProps) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(
        units === 'metric' ? formatMm(initialDiameterNm, 2) : formatIn(initialDiameterNm, 4),
      );
      setError(null);
    }
  }, [initialDiameterNm, open, units]);

  const handleApply = useCallback(() => {
    const parsed = parseDiameterInput(draft, units);
    if (!parsed.ok) {
      setError(parsed.message);
      return;
    }
    const label =
      units === 'metric'
        ? formatMm(parsed.nm, 2) + ' mm'
        : formatIn(parsed.nm, 4) + ' in';
    setError(null);
    onApply(parsed.nm, label);
  }, [draft, onApply, units]);

  const handleChange = useCallback((text: string) => {
    setDraft(text);
    setError(null);
  }, []);

  return (
    <ContentSheet title="Custom size" open={open} onClose={onClose}>
      <View style={styles.body}>
        <View style={[styles.field, error ? styles.fieldError : null]}>
          <TextInput
            value={draft}
            onChangeText={handleChange}
            keyboardType="decimal-pad"
            selectTextOnFocus
            autoFocus={false}
            style={styles.input}
            accessibilityLabel="Custom diameter"
            placeholder={units === 'metric' ? '6.00' : '0.2362'}
            placeholderTextColor={theme.colors.text.tertiary}
          />
          <Text style={styles.suffix}>{units === 'metric' ? 'mm' : 'in'}</Text>
        </View>

        {error ? <InlineNotice text={error} tone="error" /> : null}

        <Text style={styles.hint}>
          {units === 'metric'
            ? 'Two decimals, 0.25 to 25.40 mm. Both . and , work.'
            : 'Up to six decimals, 0.009843 to 1.000000 in.'}
        </Text>

        <PrimaryButton
          label="APPLY SIZE"
          onPress={handleApply}
          accessibilityLabel="Apply custom size"
        />
      </View>
    </ContentSheet>
  );
}

const styles = StyleSheet.create({
  body: {gap: 12, paddingBottom: 4},
  field: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radius.well,
    backgroundColor: '#FFFFFFCC',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  fieldError: {borderColor: theme.colors.primary, borderWidth: 2},
  input: {
    flex: 1,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: theme.colors.text.primary,
    padding: 0,
    fontVariant: ['tabular-nums'],
  },
  suffix: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.tertiary,
  },
  hint: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.tertiary,
  },
});

export const CustomSizeSheet = React.memo(CustomSizeSheetBase);
export default CustomSizeSheet;
