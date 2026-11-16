import React, {useCallback, useMemo} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {Check} from 'lucide-react-native';
import {SCREEN_H, theme} from '../constants/theme';
import {BIT_FAMILIES, BitFamily, BitSizeRecord, bitsForFamily} from '../data/bitSizeData';
import {formatConverted} from '../utils/formatters';
import {Units} from '../utils/units';
import ContentSheet from './ContentSheet';
import FilterChips from './FilterChips';
import SecondaryButton from './SecondaryButton';

export type SizePickerProps = {
  open: boolean;
  family: BitFamily;
  units: Units;
  selectedDiameterNm: number;
  onFamilyChange: (family: BitFamily) => void;
  onSelect: (record: BitSizeRecord) => void;
  onClose: () => void;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const ROW_H = 64;

type RowProps = {
  record: BitSizeRecord;
  converted: string;
  selected: boolean;
  onSelect: (record: BitSizeRecord) => void;
};

function Row({record, converted, selected, onSelect}: RowProps) {
  const handlePress = useCallback(() => onSelect(record), [onSelect, record]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={record.label + ', ' + converted}
      accessibilityState={{selected: selected}}
      style={[styles.row, selected ? styles.rowOn : null]}>
      <Text style={styles.label} numberOfLines={1}>
        {record.label}
      </Text>
      <Text style={styles.converted} numberOfLines={1}>
        {converted}
      </Text>
      {selected ? (
        <Check size={24} color={theme.colors.accent} strokeWidth={2.4} />
      ) : null}
    </Pressable>
  );
}

const MemoRow = React.memo(Row);

const keyExtractor = (item: BitSizeRecord) => item.id;
const getItemLayout = (_: any, index: number) => ({
  length: ROW_H + 8,
  offset: (ROW_H + 8) * index,
  index: index,
});

/** Bounded size list with 48dp family controls. */
function SizePickerBase({
  open,
  family,
  units,
  selectedDiameterNm,
  onFamilyChange,
  onSelect,
  onClose,
}: SizePickerProps) {
  const data = useMemo(() => bitsForFamily(family), [family]);

  const initialIndex = useMemo(() => {
    let best = 0;
    let bestDelta = Infinity;
    for (let i = 0; i < data.length; i++) {
      const delta = Math.abs(data[i].diameterNm - selectedDiameterNm);
      if (delta < bestDelta) {
        bestDelta = delta;
        best = i;
      }
    }
    return best;
  }, [data, selectedDiameterNm]);

  const handleFamily = useCallback(
    (id: string) => onFamilyChange(id as BitFamily),
    [onFamilyChange],
  );

  const renderItem = useCallback(
    ({item}: {item: BitSizeRecord}) => (
      <MemoRow
        record={item}
        converted={formatConverted(item.diameterNm, units)}
        selected={item.diameterNm === selectedDiameterNm}
        onSelect={onSelect}
      />
    ),
    [onSelect, selectedDiameterNm, units],
  );

  return (
    <ContentSheet
      title="Choose size"
      open={open}
      onClose={onClose}
      footer={<SecondaryButton label="CLOSE" onPress={onClose} />}>
      <View style={styles.controls}>
        <FilterChips items={BIT_FAMILIES} selectedId={family} onSelect={handleFamily} />
      </View>
      <View style={styles.listWrap}>
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={Separator}
          getItemLayout={getItemLayout}
          initialScrollIndex={initialIndex}
          initialNumToRender={12}
          windowSize={7}
          removeClippedSubviews
        />
      </View>
    </ContentSheet>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  controls: {paddingBottom: 12},
  listWrap: {height: Math.min(360, Math.round(SCREEN_H * 0.45))},
  row: {
    height: ROW_H,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: theme.radius.well,
    backgroundColor: '#FFFFFFB3',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  rowOn: {borderColor: theme.colors.accent, borderWidth: 2},
  label: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  converted: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.colors.text.tertiary,
    fontVariant: ['tabular-nums'],
  },
  separator: {height: 8},
});

export const SizePicker = React.memo(SizePickerBase);
export default SizePicker;
