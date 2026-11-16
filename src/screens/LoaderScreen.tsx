import React, {useEffect, useRef} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import {assets} from '../assets';
import {LOADER_DURATION_MS} from '../constants/config';
import {theme} from '../constants/theme';
import BackgroundLayer from '../components/BackgroundLayer';

export type LoaderScreenProps = {
  onDone: () => void;
  reducedMotion: boolean;
};

const TRACK_W = 220;

/**
 * Splash. Deliberately distinct from the hub: dark overlay, no chips, no
 * interactive call-to-action. Duration is fixed at 8000ms by the factory.
 */
export default function LoaderScreen({onDone, reducedMotion}: LoaderScreenProps) {
  const fade = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(reducedMotion ? 1 : 0.96)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (reducedMotion) {
      fade.setValue(1);
      scale.setValue(1);
      progress.setValue(1);
    } else {
      Animated.parallel([
        Animated.timing(fade, {toValue: 1, duration: 200, useNativeDriver: true}),
        Animated.timing(scale, {toValue: 1, duration: 200, useNativeDriver: true}),
      ]).start();
      Animated.timing(progress, {
        toValue: 1,
        duration: LOADER_DURATION_MS,
        useNativeDriver: true,
      }).start();
    }
    const timer = setTimeout(() => doneRef.current(), LOADER_DURATION_MS);
    return () => clearTimeout(timer);
  }, [fade, progress, scale, reducedMotion]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-TRACK_W, 0],
  });

  return (
    <View style={styles.root}>
      <BackgroundLayer variant="splash" />

      <View style={styles.center}>
        <Animated.View
          pointerEvents="none"
          style={[styles.brand, {opacity: fade, transform: [{scale: scale}]}]}>
          <View style={styles.logoCard}>
            <Image
              source={assets.logo}
              style={styles.logo}
              resizeMode="contain"
              accessible={false}
            />
          </View>
          <Text style={styles.title} numberOfLines={2}>
            Drill Bit Chart
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            Sizes right. Speeds ready.
          </Text>
        </Animated.View>

        <View style={styles.progressBlock}>
          <View style={styles.track} accessible accessibilityLabel="Loading">
            <Animated.View
              style={[styles.fill, {transform: [{translateX: translateX}]}]}
            />
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.colors.chart},
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 48,
  },
  brand: {alignItems: 'center'},
  logoCard: {
    width: 136,
    height: 136,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18181CE6',
    borderWidth: 1,
    borderColor: theme.colors.ui.accentBorder,
    marginBottom: 20,
  },
  logo: {width: 104, height: 104},
  title: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: theme.colors.text.onDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: theme.colors.text.dim,
    textAlign: 'center',
    marginTop: 8,
  },
  progressBlock: {alignItems: 'center', gap: 12},
  track: {
    width: TRACK_W,
    height: 4,
    borderRadius: 8,
    backgroundColor: '#F6F0ED26',
    overflow: 'hidden',
  },
  fill: {
    width: TRACK_W,
    height: 4,
    borderRadius: 8,
    backgroundColor: theme.colors.accent,
  },
  loading: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.dim,
  },
});
