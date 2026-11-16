import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Switch, Text, View} from 'react-native';
import {Check, ChevronRight} from 'lucide-react-native';
import {theme} from '../constants/theme';

export type SettingsRowProps = {
  title: string;
  detail?: string | null;
  control: 'radio' | 'switch' | 'action';
  value?: boolean;
  confirmed?: boolean;
  disabled?: boolean;
  onChange: () => void;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

/** 64dp minimum row shared by every settings card. */
function SettingsRowBase({
  title,
  detail,
  control,
  value = false,
  confirmed = false,
  disabled = false,
  onChange,
}: SettingsRowProps) {
  const handleSwitch = useCallback(() => onChange(), [onChange]);

  const body = (
    <View style={styles.text}>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {detail ? (
        <Text style={styles.detail} numberOfLines={3}>
          {detail}
        </Text>
      ) : null}
    </View>
  );

  if (control === 'switch') {
    return (
      <View style={styles.row}>
        {body}
        {confirmed ? (
          <Check size={24} color={theme.colors.accent} strokeWidth={2.4} />
        ) : null}
        <Switch
          value={value}
          onValueChange={handleSwitch}
          disabled={disabled}
          accessibilityLabel={title}
          trackColor={{false: theme.colors.ui.border, true: theme.colors.ui.accentBorder}}
          thumbColor={value ? theme.colors.accent : '#FFFFFF'}
        />
      </View>
    );
  }

  return (
    <Pressable
      onPress={disabled ? undefined : onChange}
      hitSlop={HIT}
      disabled={disabled}
      accessibilityRole={control === 'radio' ? 'radio' : 'button'}
      accessibilityLabel={title}
      accessibilityState={
        control === 'radio' ? {checked: value, disabled: disabled} : {disabled: disabled}
      }
      style={[styles.row, disabled ? styles.disabled : null]}>
      {control === 'radio' ? (
        <View style={[styles.radio, value ? styles.radioOn : null]}>
          {value ? <View style={styles.radioDot} /> : null}
        </View>
      ) : null}
      {body}
      {confirmed ? <Check size={24} color={theme.colors.accent} strokeWidth={2.4} /> : null}
      {control === 'action' ? (
        <ChevronRight size={24} color={theme.colors.text.tertiary} strokeWidth={2} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  disabled: {opacity: 0.45},
  text: {flex: 1, gap: 2},
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  detail: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.tertiary,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.ui.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {borderColor: theme.colors.accent},
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.accent,
  },
});

export const SettingsRow = React.memo(SettingsRowBase);
export default SettingsRow;
