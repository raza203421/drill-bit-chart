import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Gauge, Hash, Ruler, Trash2} from 'lucide-react-native';
import {theme} from '../constants/theme';
import {Favorite} from '../game/favoriteIdentity';
import {formatConverted, formatRpm} from '../utils/formatters';
import {Units} from '../utils/units';

export type FavoriteCardProps = {
  entry: Favorite;
  units: Units;
  onOpen: (entry: Favorite) => void;
  onRemove: (id: string) => void;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

const KIND_META = {
  speed: {Icon: Gauge, tag: 'SPEED', color: theme.colors.accent},
  thread: {Icon: Hash, tag: 'THREAD', color: theme.colors.primary},
  bit: {Icon: Ruler, tag: 'BIT', color: '#7A6A58'},
};

/** Distinct content per favorite kind with a separate 48dp remove target. */
function FavoriteCardBase({entry, units, onOpen, onRemove}: FavoriteCardProps) {
  const handleOpen = useCallback(() => onOpen(entry), [entry, onOpen]);
  const handleRemove = useCallback(() => onRemove(entry.id), [entry.id, onRemove]);

  const meta = KIND_META[entry.kind];
  const Icon = meta.Icon;

  let title = entry.sizeLabel;
  let detail = formatConverted(entry.diameterNm, units);

  if (entry.kind === 'speed') {
    title = (entry.materialLabel || 'Material') + ' · ' + entry.sizeLabel;
    detail = formatRpm(entry.startRpm || 0) + ' RPM starting speed';
  } else if (entry.kind === 'thread') {
    title = entry.threadLabel || entry.sizeLabel;
    detail = 'Tap drill ' + (entry.drillLabel || entry.sizeLabel);
  }

  return (
    <View style={styles.card}>
      <Pressable
        onPress={handleOpen}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel={'Open ' + title}
        style={styles.main}>
        <View style={[styles.iconWrap, {borderColor: meta.color + '66', backgroundColor: meta.color + '1A'}]}>
          <Icon size={24} color={meta.color} strokeWidth={1.8} />
        </View>
        <View style={styles.text}>
          <Text style={[styles.tag, {color: meta.color}]}>{meta.tag}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.detail} numberOfLines={1}>
            {detail}
          </Text>
        </View>
      </Pressable>
      <Pressable
        onPress={handleRemove}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel={'Remove ' + title}
        style={styles.remove}>
        <Trash2 size={24} color={theme.colors.primary} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.card,
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFFD9',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    shadowColor: theme.shadows.card.shadowColor,
    shadowOffset: theme.shadows.card.shadowOffset,
    shadowOpacity: theme.shadows.card.shadowOpacity,
    shadowRadius: theme.shadows.card.shadowRadius,
    elevation: theme.shadows.card.elevation,
  },
  main: {flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48},
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {flex: 1, gap: 1},
  tag: {fontSize: 12, lineHeight: 18, fontWeight: '700', letterSpacing: 1},
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  detail: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.tertiary,
  },
  remove: {width: 48, height: 48, alignItems: 'center', justifyContent: 'center'},
});

export const FavoriteCard = React.memo(FavoriteCardBase);
export default FavoriteCard;
