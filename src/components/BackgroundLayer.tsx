import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {assets} from '../assets';
import {SCREEN_H, theme} from '../constants/theme';

export type BackgroundVariant =
  | 'splash'
  | 'hub'
  | 'calculator'
  | 'result'
  | 'table'
  | 'sizes'
  | 'favorites'
  | 'settings'
  | 'about';

type Config = {
  colors: string[];
  start: {x: number; y: number};
  end: {x: number; y: number};
  opacity: number;
  tick: string;
  side: 'both' | 'right' | 'left' | 'none';
};

const CONFIG: Record<BackgroundVariant, Config> = {
  splash: {
    colors: [theme.gradients.splash[0], theme.gradients.splash[1]],
    start: {x: 0.5, y: 0},
    end: {x: 0.5, y: 1},
    opacity: 0.94,
    tick: theme.colors.accent,
    side: 'both',
  },
  hub: {
    colors: [theme.gradients.hub[0], theme.gradients.hub[1]],
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
    opacity: 0.96,
    tick: theme.colors.text.primary,
    side: 'right',
  },
  calculator: {
    colors: [theme.gradients.calculator[0], theme.gradients.calculator[1]],
    start: {x: 0.5, y: 0},
    end: {x: 0.5, y: 1},
    opacity: 0.97,
    tick: theme.colors.text.primary,
    side: 'left',
  },
  result: {
    colors: [theme.gradients.result[0], theme.gradients.result[1]],
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
    opacity: 0.94,
    tick: theme.colors.accent,
    side: 'both',
  },
  table: {
    colors: [theme.gradients.table[0], theme.gradients.table[1]],
    start: {x: 0, y: 0.2},
    end: {x: 1, y: 0.8},
    opacity: 0.97,
    tick: theme.colors.text.primary,
    side: 'left',
  },
  sizes: {
    colors: [theme.gradients.sizes[0], theme.gradients.sizes[1]],
    start: {x: 0.5, y: 0},
    end: {x: 0.5, y: 1},
    opacity: 0.97,
    tick: theme.colors.text.primary,
    side: 'right',
  },
  favorites: {
    colors: [theme.gradients.favorites[0], theme.gradients.favorites[1]],
    start: {x: 1, y: 0},
    end: {x: 0, y: 1},
    opacity: 0.96,
    tick: theme.colors.primary,
    side: 'both',
  },
  settings: {
    colors: [theme.gradients.settings[0], theme.gradients.settings[1]],
    start: {x: 0.5, y: 0},
    end: {x: 0.5, y: 1},
    opacity: 0.97,
    tick: theme.colors.text.primary,
    side: 'right',
  },
  about: {
    colors: [theme.gradients.about[0], theme.gradients.about[1]],
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
    opacity: 0.96,
    tick: theme.colors.primary,
    side: 'left',
  },
};

const TICK_COUNT = Math.max(8, Math.floor(SCREEN_H / 48));
const TICKS = Array.from({length: TICK_COUNT}, (_, i) => i);

function Ruler({color, align}: {color: string; align: 'left' | 'right'}) {
  return (
    <View style={[styles.ruler, align === 'left' ? styles.rulerLeft : styles.rulerRight]}>
      {TICKS.map(i => (
        <View
          key={i}
          style={[
            styles.tick,
            {
              backgroundColor: color,
              width: i % 4 === 0 ? 18 : 10,
              opacity: i % 4 === 0 ? 0.08 : 0.05,
            },
          ]}
        />
      ))}
    </View>
  );
}

/** Shared backdrop: one bg_game image under a per-screen gradient and ruler decor. */
function BackgroundLayerBase({variant}: {variant: BackgroundVariant}) {
  const cfg = CONFIG[variant];
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Image
        source={assets.bgGame}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        accessible={false}
      />
      <LinearGradient
        colors={cfg.colors}
        start={cfg.start}
        end={cfg.end}
        style={[StyleSheet.absoluteFill, {opacity: cfg.opacity}]}
      />
      {cfg.side === 'left' || cfg.side === 'both' ? (
        <Ruler color={cfg.tick} align="left" />
      ) : null}
      {cfg.side === 'right' || cfg.side === 'both' ? (
        <Ruler color={cfg.tick} align="right" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ruler: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 20,
    justifyContent: 'space-around',
  },
  rulerLeft: {left: 0, alignItems: 'flex-start'},
  rulerRight: {right: 0, alignItems: 'flex-end'},
  tick: {height: 1, borderRadius: 1},
});

export const BackgroundLayer = React.memo(BackgroundLayerBase);
export default BackgroundLayer;
