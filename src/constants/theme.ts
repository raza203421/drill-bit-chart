import {Dimensions} from 'react-native';

const {width: WINDOW_W, height: WINDOW_H} = Dimensions.get('window');

export const SCREEN_W = WINDOW_W;
export const SCREEN_H = WINDOW_H;

/** Phone chart / calculator module width (rule: min(window - 32, 380)). */
export const MODULE_W = Math.min(WINDOW_W - 32, 380);

/** Bento geometry: featured tile takes 60% of the inner width after the gap. */
export const BENTO_GAP = 12;
export const BENTO_FEATURED_W = Math.floor((MODULE_W - BENTO_GAP) * 0.6);
export const BENTO_SMALL_W = MODULE_W - BENTO_GAP - BENTO_FEATURED_W;
export const BENTO_FEATURED_H = 248;
export const BENTO_SMALL_H = (BENTO_FEATURED_H - BENTO_GAP) / 2;

/** Chart panel frame: padding 6 + border 1 on each side. */
export const CHART_PAD = 6;
export const CHART_BORDER = 1;
export const CHART_FRAME = CHART_PAD + CHART_BORDER;

export const theme = {
  name: 'dark-premium',

  colors: {
    cream: '#F6F0ED',
    sand: '#DDD2B0',
    primary: '#AB4F2A',
    accent: '#28ABE0',
    chart: '#111114',
    chartSurface: '#18181C',
    chartRow: '#1F1F24',
    chartEnd: '#252530',

    text: {
      primary: '#241C18',
      secondary: '#241C18CC',
      tertiary: '#241C18B3',
      onDark: '#F6F0ED',
      onPrimary: '#F6F0ED',
      dim: '#DDD2B0',
    },

    ui: {
      hairline: '#241C181A',
      border: '#241C1833',
      borderStrong: '#241C1866',
      fill: '#241C180A',
      fillStrong: '#241C1814',
      shadow: '#241C181F',
      darkFill: '#F6F0ED14',
      darkBorder: '#DDD2B033',
      darkBorderStrong: '#F6F0ED66',
      accentBorder: '#28ABE066',
      accentLine: '#28ABE040',
      accentSoft: '#28ABE01A',
      accentFaint: '#28ABE014',
      primarySoft: '#AB4F2A1A',
    },
  },

  gradients: {
    splash: ['#111114', '#252530'] as const,
    hub: ['#F6F0ED', '#DDD2B0'] as const,
    calculator: ['#F6F0ED', '#E6DCC9'] as const,
    result: ['#111114', '#252530'] as const,
    table: ['#F6F0ED', '#DDD2B0'] as const,
    sizes: ['#DDD2B0', '#F6F0ED'] as const,
    favorites: ['#F6F0ED', '#DDD2B0'] as const,
    settings: ['#F6F0ED', '#E8DEC9'] as const,
    about: ['#DDD2B0', '#F6F0ED'] as const,
    action: ['#28ABE0', '#28ABE0D9'] as const,
    tile: ['#AB4F2A', '#8E3F20'] as const,
    panel: ['#18181C', '#252530'] as const,
    controls: ['#F6F0ED', '#E8DEC9'] as const,
  },

  typography: {
    hero: {fontSize: 40, lineHeight: 44, fontWeight: '800' as const, letterSpacing: -0.5},
    rpmHero: {fontSize: 56, lineHeight: 64, fontWeight: '800' as const, letterSpacing: -1},
    rpmPreview: {fontSize: 40, lineHeight: 48, fontWeight: '800' as const, letterSpacing: -0.5},
    screenTitle: {fontSize: 26, lineHeight: 32, fontWeight: '700' as const, letterSpacing: -0.3},
    cardTitle: {fontSize: 20, lineHeight: 26, fontWeight: '700' as const},
    heading: {fontSize: 18, lineHeight: 24, fontWeight: '700' as const},
    body: {fontSize: 16, lineHeight: 24, fontWeight: '400' as const},
    bodyMedium: {fontSize: 16, lineHeight: 24, fontWeight: '500' as const},
    button: {fontSize: 16, lineHeight: 24, fontWeight: '700' as const, letterSpacing: 0.4},
    caption: {fontSize: 12, lineHeight: 18, fontWeight: '500' as const, letterSpacing: 0.3},
    overline: {fontSize: 12, lineHeight: 18, fontWeight: '700' as const, letterSpacing: 1.2},
  },

  spacing: {xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32},

  radius: {sm: 10, well: 14, card: 16, feature: 18, pill: 100},

  shadows: {
    card: {
      shadowColor: '#241C18',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 3,
    },
    dark: {
      shadowColor: '#28ABE0',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.18,
      shadowRadius: 12,
      elevation: 4,
    },
    button: {
      shadowColor: '#28ABE0',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
  },

  animation: {
    press: {tension: 180, friction: 18},
    fast: 150,
    normal: 180,
    sheet: 200,
  },
};

export type Theme = typeof theme;
