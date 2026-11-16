import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {HEADER_ROW_H, HEADER_TOP_PAD} from '../constants/config';
import {theme} from '../constants/theme';

export type ScreenHeaderProps = {
  title: string;
  subtitle?: string | null;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tone?: 'light' | 'dark';
};

/**
 * One header for every screen. Screens differ only through leftSlot / rightSlot
 * so padding, title size and the bottom hairline never drift between them.
 */
function ScreenHeaderBase({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  tone = 'light',
}: ScreenHeaderProps) {
  const dark = tone === 'dark';
  return (
    <View style={[styles.header, dark ? styles.headerDark : styles.headerLight]}>
      <View style={styles.row}>
        <View style={styles.side}>{leftSlot}</View>
        <View style={styles.titleWrap}>
          <Text
            style={[
              styles.title,
              {color: dark ? theme.colors.text.onDark : theme.colors.text.primary},
            ]}
            numberOfLines={2}
            accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[
                styles.subtitle,
                {color: dark ? theme.colors.text.dim : theme.colors.text.tertiary},
              ]}
              numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: HEADER_TOP_PAD,
    borderBottomWidth: 1,
  },
  headerLight: {
    backgroundColor: '#F6F0ED4D',
    borderBottomColor: theme.colors.ui.hairline,
  },
  headerDark: {
    backgroundColor: '#1111144D',
    borderBottomColor: theme.colors.ui.darkBorder,
  },
  row: {
    minHeight: HEADER_ROW_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  side: {
    minWidth: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sideRight: {justifyContent: 'flex-end'},
  titleWrap: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    letterSpacing: 0.3,
    textAlign: 'center',
    marginTop: 2,
  },
});

export const ScreenHeader = React.memo(ScreenHeaderBase);
export default ScreenHeader;
