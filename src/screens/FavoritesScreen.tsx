import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ArrowLeft, Pin} from 'lucide-react-native';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import FavoriteCard from '../components/FavoriteCard';
import FilterChips from '../components/FilterChips';
import IconButton from '../components/IconButton';
import UndoSnackbar from '../components/UndoSnackbar';
import {TabId} from '../components/BottomTabs';
import {MODULE_W} from '../constants/theme';
import {Favorite} from '../game/favoriteIdentity';
import {Units} from '../utils/units';

export type FavoritesScreenProps = {
  favorites: Favorite[];
  units: Units;
  removedLabel: string | null;
  reducedMotion: boolean;
  onBack: () => void;
  onSelectTab: (id: TabId) => void;
  onOpen: (entry: Favorite) => void;
  onRemove: (id: string) => void;
  onUndo: () => void;
  onDismissUndo: () => void;
  onStartCalc: () => void;
};

const FILTERS = [
  {id: 'all', label: 'All'},
  {id: 'speed', label: 'Speeds'},
  {id: 'thread', label: 'Threads'},
  {id: 'bit', label: 'Bits'},
];

const keyExtractor = (item: Favorite) => item.id;

export default function FavoritesScreen({
  favorites,
  units,
  removedLabel,
  reducedMotion,
  onBack,
  onSelectTab,
  onOpen,
  onRemove,
  onUndo,
  onDismissUndo,
  onStartCalc,
}: FavoritesScreenProps) {
  const [filter, setFilter] = useState('all');

  const data = useMemo(
    () => (filter === 'all' ? favorites : favorites.filter(item => item.kind === filter)),
    [favorites, filter],
  );

  const renderItem = useCallback(
    ({item}: {item: Favorite}) => (
      <FavoriteCard entry={item} units={units} onOpen={onOpen} onRemove={onRemove} />
    ),
    [onOpen, onRemove, units],
  );

  return (
    <AppShell
      variant="favorites"
      title="Favorites"
      subtitle={favorites.length > 0 ? favorites.length + ' saved' : null}
      reducedMotion={reducedMotion}
      selectedTab="favorites"
      onSelectTab={onSelectTab}
      leftSlot={<IconButton Icon={ArrowLeft} label="Back to hub" onPress={onBack} />}>
      <View style={styles.region}>
        <View style={styles.module}>
          {favorites.length > 0 ? (
            <View style={styles.filters}>
              <FilterChips items={FILTERS} selectedId={filter} onSelect={setFilter} />
            </View>
          ) : null}

          <FlatList
            style={styles.list}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
            contentContainerStyle={styles.listContent}
            initialNumToRender={8}
            windowSize={7}
            ListEmptyComponent={
              <EmptyState
                Icon={Pin}
                title={favorites.length > 0 ? 'Nothing in this filter' : 'No favorites yet'}
                body={
                  favorites.length > 0
                    ? 'Choose another filter to see your saved items.'
                    : 'Save speeds, threads or bit sizes for quick access.'
                }
                actionLabel={favorites.length > 0 ? undefined : 'START SPEED CALC'}
                onAction={favorites.length > 0 ? undefined : onStartCalc}
              />
            }
          />
        </View>
      </View>

      <UndoSnackbar
        text={removedLabel ? 'Removed ' + removedLabel : ''}
        visible={!!removedLabel}
        onUndo={onUndo}
        onDismiss={onDismissUndo}
      />
    </AppShell>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  region: {flex: 1, alignItems: 'center', paddingTop: 12, paddingHorizontal: 16},
  module: {width: MODULE_W, flex: 1, gap: 10},
  filters: {},
  list: {flex: 1},
  listContent: {paddingBottom: 90},
  separator: {height: 12},
});
