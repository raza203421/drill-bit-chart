import React from 'react';
import {Animated, Image, ImageSourcePropType, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

export type ToolTileProps = {
  title: string;
  subtitle?: string | null;
  Icon: React.ComponentType<any>;
  variant: 'featured' | 'standard' | 'wide';
  /** Omit to render a static tile that hosts its own interactive children. */
  onPress?: () => void;
  width: number;
  height: number;
  illustration?: ImageSourcePropType;
  accessibilityLabel?: string;
  children?: React.ReactNode;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

/** Bento hub tile. The whole tile is the target; fixed 24dp or 48dp vector icon. */
function ToolTileBase({
  title,
  subtitle,
  Icon,
  variant,
  onPress,
  width,
  height,
  illustration,
  accessibilityLabel,
  children,
}: ToolTileProps) {
  const {scale, onPressIn, onPressOut} = usePressScale(true, 0.985);
  const featured = variant === 'featured';
  const titleColor = featured ? theme.colors.text.onPrimary : theme.colors.text.primary;
  const subColor = featured ? '#F6F0EDCC' : theme.colors.text.tertiary;

  const body = (
    <View style={styles.inner}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrap,
            featured ? styles.iconWrapFeatured : styles.iconWrapStandard,
          ]}>
          <Icon
            size={24}
            color={featured ? theme.colors.text.onPrimary : theme.colors.accent}
            strokeWidth={1.8}
          />
        </View>
        {illustration ? (
          <Image
            source={illustration}
            style={styles.illustration}
            resizeMode="contain"
            accessible={false}
          />
        ) : null}
      </View>
      <View style={styles.textBlock}>
        <Text style={[styles.title, {color: titleColor}]} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, {color: subColor}]} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {children ? <View style={styles.slot}>{children}</View> : null}
    </View>
  );

  const surface = (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.anim,
        featured ? styles.animFeatured : styles.animStandard,
        {transform: [{scale: scale}]},
      ]}>
      {featured ? (
        <LinearGradient
          colors={[theme.gradients.tile[0], theme.gradients.tile[1]]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.fill}>
          {body}
        </LinearGradient>
      ) : (
        <View style={[styles.fill, styles.standardFill]}>{body}</View>
      )}
    </Animated.View>
  );

  // A tile that hosts its own button is a plain surface, never a nested Pressable.
  if (!onPress) {
    return <View style={[styles.press, {width: width, height: height}]}>{surface}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      style={[styles.press, {width: width, height: height}]}>
      {surface}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: theme.radius.feature,
    shadowColor: theme.shadows.card.shadowColor,
    shadowOffset: theme.shadows.card.shadowOffset,
    shadowOpacity: theme.shadows.card.shadowOpacity,
    shadowRadius: theme.shadows.card.shadowRadius,
    elevation: theme.shadows.card.elevation,
  },
  anim: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.feature,
    overflow: 'hidden',
    borderWidth: 1,
  },
  animFeatured: {borderColor: '#F6F0ED2E'},
  animStandard: {borderColor: theme.colors.ui.border},
  fill: {width: '100%', height: '100%', padding: 14},
  standardFill: {backgroundColor: '#FFFFFFD9', padding: 12},
  inner: {flex: 1, justifyContent: 'space-between'},
  topRow: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'},
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconWrapFeatured: {backgroundColor: '#F6F0ED1F', borderColor: '#F6F0ED3D'},
  iconWrapStandard: {
    backgroundColor: theme.colors.ui.accentSoft,
    borderColor: theme.colors.ui.accentBorder,
  },
  illustration: {width: 56, height: 56},
  textBlock: {gap: 2, marginTop: 8},
  title: {fontSize: 20, lineHeight: 26, fontWeight: '700'},
  subtitle: {fontSize: 12, lineHeight: 18, fontWeight: '500', letterSpacing: 0.2},
  slot: {marginTop: 10},
});

export const ToolTile = React.memo(ToolTileBase);
export default ToolTile;
