import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Gauge, Hash, Ruler, Star} from 'lucide-react-native';
import {BOTTOM_TABS_H} from '../constants/config';
import {theme} from '../constants/theme';

export type TabId = 'game' | 'tapDrill' | 'bitSizes' | 'favorites';

const TABS: Array<{id: TabId; label: string; Icon: React.ComponentType<any>}> = [
  {id: 'game', label: 'Speed Calc', Icon: Gauge},
  {id: 'tapDrill', label: 'Tap Drill', Icon: Hash},
  {id: 'bitSizes', label: 'Bit Sizes', Icon: Ruler},
  {id: 'favorites', label: 'Favorites', Icon: Star},
];

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

type ItemProps = {
  id: TabId;
  label: string;
  Icon: React.ComponentType<any>;
  selected: boolean;
  onSelect: (id: TabId) => void;
};

function TabItem({id, label, Icon, selected, onSelect}: ItemProps) {
  const handlePress = useCallback(() => onSelect(id), [id, onSelect]);
  const color = selected ? theme.colors.accent : theme.colors.text.tertiary;
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{selected: selected}}
      style={styles.item}>
      <View style={[styles.marker, selected ? styles.markerOn : null]} />
      <Icon size={24} color={color} strokeWidth={selected ? 2.2 : 1.5} />
      <Text style={[styles.label, {color: color}]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const MemoTabItem = React.memo(TabItem);

/** Four utility destinations, each at least a 64dp target. */
function BottomTabsBase({
  selectedTab,
  onSelect,
}: {
  selectedTab: TabId | null;
  onSelect: (id: TabId) => void;
}) {
  return (
    <View style={styles.bar}>
      {TABS.map(tab => (
        <MemoTabItem
          key={tab.id}
          id={tab.id}
          label={tab.label}
          Icon={tab.Icon}
          selected={selectedTab === tab.id}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: BOTTOM_TABS_H,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#F6F0EDF2',
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.hairline,
  },
  item: {
    flex: 1,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 6,
  },
  marker: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  markerOn: {backgroundColor: theme.colors.accent},
  label: {fontSize: 12, lineHeight: 18, fontWeight: '500', letterSpacing: 0.2},
});

export const BottomTabs = React.memo(BottomTabsBase);
export default BottomTabs;
