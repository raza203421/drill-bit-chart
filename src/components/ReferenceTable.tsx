import React, {useCallback} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {Star} from 'lucide-react-native';
import {theme} from '../constants/theme';

export type TableRow = {
  id: string;
  primary: string;
  secondary?: string;
  value: string;
  valueNote?: string;
};

export type ReferenceTableProps = {
  rows: TableRow[];
  columns: [string, string];
  selectedId: string | null;
  favoriteIds: string[];
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  emptyComponent: React.ReactElement;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

type RowProps = {
  row: TableRow;
  index: number;
  selected: boolean;
  saved: boolean;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
};

function Row({row, index, selected, saved, onSelect, onToggleFavorite}: RowProps) {
  const handleSelect = useCallback(() => onSelect(row.id), [onSelect, row.id]);
  const handleFavorite = useCallback(
    () => onToggleFavorite(row.id),
    [onToggleFavorite, row.id],
  );

  return (
    <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
      {selected ? <View style={styles.marker} /> : null}
      <Pressable
        onPress={handleSelect}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel={row.primary + ', ' + row.value}
        accessibilityState={{selected: selected}}
        style={styles.main}>
        <View style={styles.cellPrimary}>
          <Text style={styles.primary} numberOfLines={1}>
            {row.primary}
          </Text>
          {row.secondary ? (
            <Text style={styles.secondary} numberOfLines={1}>
              {row.secondary}
            </Text>
          ) : null}
        </View>
        <View style={styles.cellValue}>
          <Text style={styles.value} numberOfLines={1}>
            {row.value}
          </Text>
          {row.valueNote ? (
            <Text style={styles.valueNote} numberOfLines={1}>
              {row.valueNote}
            </Text>
          ) : null}
        </View>
      </Pressable>
      <Pressable
        onPress={handleFavorite}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel={(saved ? 'Remove saved ' : 'Save ') + row.primary}
        accessibilityState={{checked: saved}}
        style={styles.favorite}>
        <Star
          size={24}
          color={saved ? theme.colors.accent : theme.colors.text.dim}
          strokeWidth={2}
          fill={saved ? theme.colors.accent : 'transparent'}
        />
      </Pressable>
    </View>
  );
}

const MemoRow = React.memo(Row);

const keyExtractor = (item: TableRow) => item.id;

/** Matte charcoal panel: fixed column heading plus a bounded virtualised list. */
function ReferenceTableBase({
  rows,
  columns,
  selectedId,
  favoriteIds,
  onSelect,
  onToggleFavorite,
  emptyComponent,
}: ReferenceTableProps) {
  const renderItem = useCallback(
    ({item, index}: {item: TableRow; index: number}) => (
      <MemoRow
        row={item}
        index={index}
        selected={item.id === selectedId}
        saved={favoriteIds.indexOf(item.id) !== -1}
        onSelect={onSelect}
        onToggleFavorite={onToggleFavorite}
      />
    ),
    [favoriteIds, onSelect, onToggleFavorite, selectedId],
  );

  return (
    <View style={styles.panel}>
      <View style={styles.headRow}>
        <Text style={[styles.headCell, styles.headPrimary]} numberOfLines={1}>
          {columns[0]}
        </Text>
        <Text style={[styles.headCell, styles.headValue]} numberOfLines={1}>
          {columns[1]}
        </Text>
        <View style={styles.headSave} />
      </View>
      <FlatList
        style={styles.list}
        data={rows}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={emptyComponent}
        initialNumToRender={10}
        windowSize={9}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    borderRadius: theme.radius.card,
    overflow: 'hidden',
    backgroundColor: theme.colors.chart,
    borderWidth: 1,
    borderColor: theme.colors.ui.darkBorder,
  },
  headRow: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: theme.colors.chartEnd,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.darkBorder,
  },
  headCell: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.dim,
  },
  headPrimary: {flex: 1},
  headValue: {width: 120, textAlign: 'right'},
  headSave: {width: 48},
  list: {flex: 1},
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  rowEven: {backgroundColor: theme.colors.chartSurface},
  rowOdd: {backgroundColor: theme.colors.chartRow},
  marker: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: theme.colors.accent,
  },
  main: {
    flex: 1,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cellPrimary: {flex: 1, paddingVertical: 8},
  primary: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: theme.colors.text.onDark,
  },
  secondary: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: '#DDD2B0B3',
  },
  cellValue: {width: 120, alignItems: 'flex-end'},
  value: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.onDark,
    fontVariant: ['tabular-nums'],
  },
  valueNote: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.dim,
    fontVariant: ['tabular-nums'],
  },
  favorite: {width: 48, height: 48, alignItems: 'center', justifyContent: 'center'},
});

export const ReferenceTable = React.memo(ReferenceTableBase);
export default ReferenceTable;
