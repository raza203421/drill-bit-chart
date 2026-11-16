import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {TRANSITION_MS} from '../constants/config';
import {theme} from '../constants/theme';
import BackgroundLayer, {BackgroundVariant} from './BackgroundLayer';
import BottomTabs, {TabId} from './BottomTabs';
import ScreenHeader from './ScreenHeader';

export type AppShellProps = {
  variant: BackgroundVariant;
  title: string;
  subtitle?: string | null;
  tone?: 'light' | 'dark';
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  selectedTab?: TabId | null;
  onSelectTab?: (id: TabId) => void;
  reducedMotion?: boolean;
};

/**
 * Root frame for every working screen: header, flexible content region,
 * optional controls surface and bottom navigation. Never a ScrollView wrapper.
 */
function AppShellBase({
  variant,
  title,
  subtitle,
  tone = 'light',
  leftSlot,
  rightSlot,
  children,
  footer,
  selectedTab = null,
  onSelectTab,
  reducedMotion = false,
}: AppShellProps) {
  const fade = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const rise = useRef(new Animated.Value(reducedMotion ? 0 : 8)).current;

  useEffect(() => {
    if (reducedMotion) {
      fade.setValue(1);
      rise.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: TRANSITION_MS,
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: TRANSITION_MS,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, rise, reducedMotion]);

  return (
    <View style={styles.root}>
      <BackgroundLayer variant={variant} />
      <ScreenHeader
        title={title}
        subtitle={subtitle}
        tone={tone}
        leftSlot={leftSlot}
        rightSlot={rightSlot}
      />
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.content,
          {opacity: fade, transform: [{translateY: rise}]},
        ]}>
        {children}
      </Animated.View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
      {onSelectTab ? (
        <BottomTabs selectedTab={selectedTab} onSelect={onSelectTab} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.colors.cream},
  content: {flex: 1},
  footer: {},
});

export const AppShell = React.memo(AppShellBase);
export default AppShell;
