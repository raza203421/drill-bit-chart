import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {X} from 'lucide-react-native';
import {theme} from '../constants/theme';
import IconButton from './IconButton';

export type ContentSheetProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  tone?: 'light' | 'dark';
};

/** Native modal bottom sheet: inset aware, focus managed by the platform. */
function ContentSheetBase({
  title,
  open,
  onClose,
  children,
  footer,
  tone = 'light',
}: ContentSheetProps) {
  const dark = tone === 'dark';
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          style={styles.scrim}
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
        />
        <View style={[styles.sheet, dark ? styles.sheetDark : styles.sheetLight]}>
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.title,
                {color: dark ? theme.colors.text.onDark : theme.colors.text.primary},
              ]}
              numberOfLines={2}
              accessibilityRole="header">
              {title}
            </Text>
            <IconButton
              Icon={X}
              label="Close"
              tone={dark ? 'dark' : 'light'}
              onPress={onClose}
            />
          </View>
          <View style={styles.body}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, justifyContent: 'flex-end'},
  scrim: {...StyleSheet.absoluteFillObject, backgroundColor: '#111114A6'},
  sheet: {
    maxHeight: '86%',
    borderTopLeftRadius: theme.radius.feature,
    borderTopRightRadius: theme.radius.feature,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  sheetLight: {
    backgroundColor: theme.colors.cream,
    borderTopColor: theme.colors.ui.border,
  },
  sheetDark: {
    backgroundColor: theme.colors.chartSurface,
    borderTopColor: theme.colors.ui.accentBorder,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 12,
  },
  title: {flex: 1, fontSize: 20, lineHeight: 26, fontWeight: '700'},
  body: {flexShrink: 1},
  footer: {paddingTop: 12, gap: 12},
});

export const ContentSheet = React.memo(ContentSheetBase);
export default ContentSheet;
