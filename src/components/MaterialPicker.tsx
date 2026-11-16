import React, {useCallback} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {Check} from 'lucide-react-native';
import {theme} from '../constants/theme';
import {Material, MaterialId} from '../data/materialData';
import ContentSheet from './ContentSheet';
import SecondaryButton from './SecondaryButton';

export type MaterialPickerProps = {
  open: boolean;
  materials: Material[];
  selectedMaterialId: MaterialId;
  onSelect: (id: MaterialId) => void;
  onClose: () => void;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

type RowProps = {
  id: MaterialId;
  label: string;
  qualifier: string;
  selected: boolean;
  onSelect: (id: MaterialId) => void;
};

function Row({id, label, qualifier, selected, onSelect}: RowProps) {
  const handlePress = useCallback(() => onSelect(id), [id, onSelect]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="radio"
      accessibilityLabel={label + ', ' + qualifier}
      accessibilityState={{checked: selected}}
      style={[styles.row, selected ? styles.rowOn : null]}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.rowQualifier} numberOfLines={2}>
          {qualifier}
        </Text>
      </View>
      {selected ? (
        <Check size={24} color={theme.colors.accent} strokeWidth={2.4} />
      ) : null}
    </Pressable>
  );
}

const MemoRow = React.memo(Row);

const keyExtractor = (item: Material) => item.id;

/** 56dp radio rows with the applicability qualifier always visible. */
function MaterialPickerBase({
  open,
  materials,
  selectedMaterialId,
  onSelect,
  onClose,
}: MaterialPickerProps) {
  const renderItem = useCallback(
    ({item}: {item: Material}) => (
      <MemoRow
        id={item.id}
        label={item.label}
        qualifier={item.qualifier}
        selected={item.id === selectedMaterialId}
        onSelect={onSelect}
      />
    ),
    [onSelect, selectedMaterialId],
  );

  return (
    <ContentSheet
      title="Material"
      open={open}
      onClose={onClose}
      footer={<SecondaryButton label="CLOSE" onPress={onClose} />}>
      <FlatList
        data={materials}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        initialNumToRender={5}
        accessibilityRole="radiogroup"
      />
    </ContentSheet>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    borderRadius: theme.radius.well,
    backgroundColor: '#FFFFFFB3',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  rowOn: {borderColor: theme.colors.accent, borderWidth: 2},
  rowText: {flex: 1, paddingVertical: 8},
  rowLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  rowQualifier: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.tertiary,
  },
  separator: {height: 8},
});

export const MaterialPicker = React.memo(MaterialPickerBase);
export default MaterialPicker;
