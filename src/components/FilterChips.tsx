import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Check} from 'lucide-react-native';
import {theme} from '../constants/theme';

export type ChipItem = {id: string; label: string};

export type FilterChipsProps = {
  items: ChipItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  accessibilityLabel?: string;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

type ChipProps = {
  id: string;
  label: string;
  selected: boolean;
  onSelect: (id: string) => void;
};

function Chip({id, label, selected, onSelect}: ChipProps) {
  const handlePress = useCallback(() => onSelect(id), [id, onSelect]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{selected: selected}}
      style={[styles.chip, selected ? styles.chipOn : styles.chipOff]}>
      {selected ? (
        <Check size={18} color={theme.colors.text.primary} strokeWidth={2.4} />
      ) : null}
      <Text
        style={[styles.label, selected ? styles.labelOn : styles.labelOff]}
        numberOfLines={1}>
        {label}
      </Text>
      {selected ? <View style={styles.marker} /> : null}
    </Pressable>
  );
}

const MemoChip = React.memo(Chip);

/** 48dp chips with an explicit check, not colour alone. */
function FilterChipsBase({items, selectedId, onSelect}: FilterChipsProps) {
  return (
    <View style={styles.row}>
      {items.map(item => (
        <MemoChip
          key={item.id}
          id={item.id}
          label={item.label}
          selected={item.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap'},
  chip: {
    minHeight: 48,
    minWidth: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: theme.radius.well,
    overflow: 'hidden',
  },
  chipOn: {
    backgroundColor: '#FFFFFFE6',
    borderWidth: 2,
    borderColor: theme.colors.text.primary,
  },
  chipOff: {
    backgroundColor: theme.colors.ui.fill,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  label: {fontSize: 14, lineHeight: 20, fontWeight: '700', letterSpacing: 0.3},
  labelOn: {color: theme.colors.text.primary},
  labelOff: {color: theme.colors.text.secondary},
  marker: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: theme.colors.accent,
  },
});

export const FilterChips = React.memo(FilterChipsBase);
export default FilterChips;
