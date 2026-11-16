import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {ArrowLeft, Info, Search} from 'lucide-react-native';
import {assets} from '../assets';
import AppShell from '../components/AppShell';
import ContentSheet from '../components/ContentSheet';
import EmptyState from '../components/EmptyState';
import FilterChips from '../components/FilterChips';
import IconButton from '../components/IconButton';
import ReferenceDetail from '../components/ReferenceDetail';
import ReferenceTable, {TableRow} from '../components/ReferenceTable';
import SearchField from '../components/SearchField';
import SecondaryButton from '../components/SecondaryButton';
import {TabId} from '../components/BottomTabs';
import {SEARCH_DEBOUNCE_MS} from '../constants/config';
import {MODULE_W, theme} from '../constants/theme';
import {
  TAP_DRILLS,
  TapDrillRecord,
  findThread,
  threadSecondaryLine,
} from '../data/tapDrillData';
import {filterThreads} from '../game/referenceSearch';
import {canonicalId} from '../game/favoriteIdentity';
import {formatIn, formatMm} from '../utils/formatters';
import {Units} from '../utils/units';

export type TapDrillScreenProps = {
  units: Units;
  favoriteIds: string[];
  savingId: string | null;
  reducedMotion: boolean;
  onBack: () => void;
  onSelectTab: (id: TabId) => void;
  onToggleThreadFavorite: (record: TapDrillRecord) => void;
  onUseInCalculator: (record: TapDrillRecord) => void;
};

const FAMILIES = [
  {id: 'metric', label: 'Metric'},
  {id: 'unc', label: 'UNC'},
  {id: 'unf', label: 'UNF'},
];

const SERIES = [
  {id: 'coarse', label: 'Coarse'},
  {id: 'fine', label: 'Fine'},
];

const HELP_TEXT =
  'These are reference hole sizes for cutting taps in common workshop use. ' +
  'Forming taps displace material instead of cutting it and need their own ' +
  'drill data, so they are not covered here. Thread percentage preferences ' +
  'differ with the tap and the material.';

export default function TapDrillScreen({
  units,
  favoriteIds,
  savingId,
  reducedMotion,
  onBack,
  onSelectTab,
  onToggleThreadFavorite,
  onUseInCalculator,
}: TapDrillScreenProps) {
  const [family, setFamily] = useState('metric');
  const [series, setSeries] = useState('coarse');
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const records = useMemo(
    () => filterThreads(TAP_DRILLS, family, series, debounced),
    [debounced, family, series],
  );

  const rows: TableRow[] = useMemo(
    () =>
      records.map(record => ({
        id: record.id,
        primary: record.designation,
        secondary: threadSecondaryLine(record),
        value: record.drillLabel,
        valueNote:
          units === 'metric'
            ? formatMm(record.drillNm, 3) + ' mm'
            : formatIn(record.drillNm, 4) + ' in',
      })),
    [records, units],
  );

  // Close the detail when its row is filtered out.
  useEffect(() => {
    if (selectedId && !records.some(record => record.id === selectedId)) {
      setSelectedId(null);
    }
  }, [records, selectedId]);

  const favoriteRowIds = useMemo(
    () =>
      records
        .filter(
          record => favoriteIds.indexOf(canonicalId('thread', {threadId: record.id})) !== -1,
        )
        .map(record => record.id),
    [favoriteIds, records],
  );

  const selected = selectedId ? findThread(selectedId) : null;
  const selectedFavoriteId = selected ? canonicalId('thread', {threadId: selected.id}) : '';
  const selectedSaved = favoriteIds.indexOf(selectedFavoriteId) !== -1;

  const handleClear = useCallback(() => {
    setQuery('');
    setDebounced('');
  }, []);

  const handleToggleFavorite = useCallback(
    (id: string) => {
      const record = findThread(id);
      if (record) {
        onToggleThreadFavorite(record);
      }
    },
    [onToggleThreadFavorite],
  );

  const handleSaveSelected = useCallback(() => {
    if (selected) {
      onToggleThreadFavorite(selected);
    }
  }, [onToggleThreadFavorite, selected]);

  const handleUse = useCallback(() => {
    if (selected) {
      onUseInCalculator(selected);
      setSelectedId(null);
    }
  }, [onUseInCalculator, selected]);

  const closeDetail = useCallback(() => setSelectedId(null), []);
  const openHelp = useCallback(() => setHelpOpen(true), []);
  const closeHelp = useCallback(() => setHelpOpen(false), []);

  const emptyComponent = (
    <EmptyState
      Icon={Search}
      title="No matching thread"
      body="Try another size or standard."
      actionLabel={query ? 'CLEAR SEARCH' : undefined}
      onAction={query ? handleClear : undefined}
      tone="dark"
    />
  );

  return (
    <AppShell
      variant="table"
      title="Tap Drill"
      reducedMotion={reducedMotion}
      selectedTab="tapDrill"
      onSelectTab={onSelectTab}
      leftSlot={<IconButton Icon={ArrowLeft} label="Back to hub" onPress={onBack} />}
      rightSlot={<IconButton Icon={Info} label="Tap drill help" onPress={openHelp} />}>
      <View style={styles.region}>
        <View style={styles.module}>
          <View style={styles.scopeRow}>
            <Image
              source={assets.sprite2}
              style={styles.scopeSprite}
              resizeMode="contain"
              accessible={false}
            />
            <Text style={styles.scopeText} numberOfLines={2}>
              Cutting taps · selected workshop hole sizes
            </Text>
          </View>

          <SearchField
            value={query}
            placeholder="Search M6 or 1/4-20"
            onChange={setQuery}
            onClear={handleClear}
            accessibilityLabel="Search threads"
          />

          <FilterChips items={FAMILIES} selectedId={family} onSelect={setFamily} />

          {family === 'metric' ? (
            <FilterChips items={SERIES} selectedId={series} onSelect={setSeries} />
          ) : null}

          <View style={styles.tableWrap}>
            <ReferenceTable
              rows={rows}
              columns={['THREAD', 'TAP DRILL']}
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
          title={selected.designation}
          saved={selectedSaved}
          saving={savingId === selectedFavoriteId}
          lines={[
            {label: 'Thread', value: selected.designation},
            {
              label: selected.pitchMm !== null ? 'Pitch' : 'Threads per inch',
              value:
                selected.pitchMm !== null
                  ? selected.pitchMm.toFixed(2) + ' mm'
                  : String(selected.tpi),
            },
            {label: 'Tap drill', value: selected.drillLabel},
            {label: 'Millimetres', value: formatMm(selected.drillNm, 3) + ' mm'},
            {label: 'Inches', value: formatIn(selected.drillNm, 4) + ' in'},
          ]}
          onSave={handleSaveSelected}
          onUseInCalculator={handleUse}
          onClose={closeDetail}
        />
      ) : null}

      <ContentSheet
        title="About these sizes"
        open={helpOpen}
        onClose={closeHelp}
        footer={<SecondaryButton label="CLOSE" onPress={closeHelp} />}>
        <Text style={styles.sheetBody}>{HELP_TEXT}</Text>
      </ContentSheet>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  region: {flex: 1, alignItems: 'center', paddingTop: 12, paddingHorizontal: 16},
  module: {width: MODULE_W, flex: 1, gap: 10},
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
  sheetBody: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: theme.colors.text.secondary,
  },
});
