import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {ArrowLeft, Search} from 'lucide-react-native';
import {assets} from '../assets';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import FilterChips from '../components/FilterChips';
import IconButton from '../components/IconButton';
import ReferenceDetail from '../components/ReferenceDetail';
import ReferenceTable, {TableRow} from '../components/ReferenceTable';
import SearchField from '../components/SearchField';
import {TabId} from '../components/BottomTabs';
import {SEARCH_DEBOUNCE_MS} from '../constants/config';
import {MODULE_W, theme} from '../constants/theme';
import {BIT_FAMILIES, BitFamily, BitSizeRecord, bitsForFamily} from '../data/bitSizeData';
import {canonicalId} from '../game/favoriteIdentity';
import {filterBits} from '../game/referenceSearch';
import {
  formatConverted,
  formatDiameter,
  formatIn,
  formatMm,
  isApproximate,
} from '../utils/formatters';
import {Units} from '../utils/units';

export type BitSizesScreenProps = {
  units: Units;
  favoriteIds: string[];
  savingId: string | null;
  reducedMotion: boolean;
  onBack: () => void;
  onSelectTab: (id: TabId) => void;
  onToggleBitFavorite: (record: BitSizeRecord) => void;
  onUseInCalculator: (record: BitSizeRecord) => void;
  onEnterCustomSize: () => void;
};

export default function BitSizesScreen({
  units,
  favoriteIds,
  savingId,
  reducedMotion,
  onBack,
  onSelectTab,
  onToggleBitFavorite,
  onUseInCalculator,
  onEnterCustomSize,
}: BitSizesScreenProps) {
  const [family, setFamily] = useState<BitFamily>('metric');
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const source = useMemo(() => bitsForFamily(family), [family]);
  const records = useMemo(() => filterBits(source, debounced), [debounced, source]);

  const rows: TableRow[] = useMemo(
    () =>
      records.map(record => ({
        id: record.id,
        primary: record.label,
        secondary: record.fraction ? record.fraction + ' in' : undefined,
        value: formatDiameter(record.diameterNm, units),
        valueNote: formatConverted(record.diameterNm, units),
      })),
    [records, units],
  );

  useEffect(() => {
    if (selectedId && !records.some(record => record.id === selectedId)) {
      setSelectedId(null);
    }
  }, [records, selectedId]);

  const favoriteRowIds = useMemo(
    () =>
      records
        .filter(
          record =>
            favoriteIds.indexOf(canonicalId('bit', {diameterNm: record.diameterNm})) !== -1,
        )
        .map(record => record.id),
    [favoriteIds, records],
  );

  const selected = useMemo(
    () => (selectedId ? source.filter(item => item.id === selectedId)[0] || null : null),
    [selectedId, source],
  );
  const selectedFavoriteId = selected
    ? canonicalId('bit', {diameterNm: selected.diameterNm})
    : '';
  const selectedSaved = favoriteIds.indexOf(selectedFavoriteId) !== -1;

  const handleClear = useCallback(() => {
    setQuery('');
    setDebounced('');
  }, []);

  const handleFamily = useCallback((id: string) => setFamily(id as BitFamily), []);

  const handleToggleFavorite = useCallback(
    (id: string) => {
      const record = source.filter(item => item.id === id)[0];
      if (record) {
        onToggleBitFavorite(record);
      }
    },
    [onToggleBitFavorite, source],
  );

  const handleSaveSelected = useCallback(() => {
    if (selected) {
      onToggleBitFavorite(selected);
    }
  }, [onToggleBitFavorite, selected]);

  const handleUse = useCallback(() => {
    if (selected) {
      onUseInCalculator(selected);
      setSelectedId(null);
    }
  }, [onUseInCalculator, selected]);

  const closeDetail = useCallback(() => setSelectedId(null), []);

  const emptyComponent = (
    <EmptyState
      Icon={Search}
      title="No size found in this list"
      body="Clear the search, or enter a custom size in the calculator."
      actionLabel="ENTER CUSTOM SIZE"
      onAction={onEnterCustomSize}
      tone="dark"
    />
  );

  const detailLines = selected
    ? [
        {label: 'Size', value: selected.label},
        {
          label: 'Millimetres',
          value:
            formatMm(selected.diameterNm, 3) +
            ' mm · ' +
            (isApproximate(selected.diameterNm, formatMm(selected.diameterNm, 3), 'metric')
              ? 'Approx.'
              : 'Exact'),
        },
        {
          label: 'Inches',
          value:
            formatIn(selected.diameterNm, 4) +
            ' in · ' +
            (isApproximate(selected.diameterNm, formatIn(selected.diameterNm, 4), 'imperial')
              ? 'Approx.'
              : 'Exact'),
        },
        {label: 'Family', value: family === 'tapCodes' ? 'Tap codes' : family === 'fractional' ? 'Fractional' : 'Metric'},
      ]
    : [];

  return (
    <AppShell
      variant="sizes"
      title="Bit Sizes"
      reducedMotion={reducedMotion}
      selectedTab="bitSizes"
      onSelectTab={onSelectTab}
      leftSlot={<IconButton Icon={ArrowLeft} label="Back to hub" onPress={onBack} />}
      rightSlot={
        <View style={styles.unitsBadge}>
          <Text style={styles.unitsText}>{units === 'metric' ? 'mm' : 'in'}</Text>
        </View>
      }>
      <View style={styles.region}>
        <View style={styles.module}>
          <View style={styles.scopeRow}>
            <Image
              source={assets.sprite3}
              style={styles.scopeSprite}
              resizeMode="contain"
              accessible={false}
            />
            <Text style={styles.scopeText} numberOfLines={2}>
              Common reference sizes · both mm and inches shown
            </Text>
          </View>

          <SearchField
            value={query}
            placeholder="Search 6.0, 1/4 or #7"
            onChange={setQuery}
            onClear={handleClear}
            accessibilityLabel="Search bit sizes"
          />

          <FilterChips items={BIT_FAMILIES} selectedId={family} onSelect={handleFamily} />

          <View style={styles.tableWrap}>
            <ReferenceTable
              rows={rows}
              columns={['SIZE', units === 'metric' ? 'MM / IN' : 'IN / MM']}
              selectedId={selectedId}
              favoriteIds={favoriteRowIds}
              onSelect={setSelectedId}
              onToggleFavorite={handleToggleFavorite}
              emptyComponent={emptyComponent}
            />
          </View>
        </View>
      </View>

      {selected ? (
        <ReferenceDetail
          open
          title={selected.label}
          lines={detailLines}
          saved={selectedSaved}
          saving={savingId === selectedFavoriteId}
          onSave={handleSaveSelected}
          onUseInCalculator={handleUse}
          onClose={closeDetail}
        />
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  region: {flex: 1, alignItems: 'center', paddingTop: 12, paddingHorizontal: 16},
  module: {width: MODULE_W, flex: 1, gap: 10},
  unitsBadge: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.well,
    backgroundColor: theme.colors.ui.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.ui.accentBorder,
  },
  unitsText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  scopeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.well,
    backgroundColor: '#FFFFFFB3',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  scopeSprite: {width: 36, height: 36},
  scopeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  tableWrap: {flex: 1, marginBottom: 12},
});
