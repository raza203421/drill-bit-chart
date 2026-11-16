import React, {useCallback, useEffect, useRef, useState} from 'react';
import {BackHandler, StatusBar, StyleSheet, View} from 'react-native';
import {TabId} from './src/components/BottomTabs';
import {TRANSITION_MS} from './src/constants/config';
import {theme} from './src/constants/theme';
import {BitSizeRecord} from './src/data/bitSizeData';
import {getMaterial} from './src/data/materialData';
import {TapDrillRecord, findThread} from './src/data/tapDrillData';
import {calculateRpm, RpmResult} from './src/game/calculateRpm';
import {canonicalId, Favorite} from './src/game/favoriteIdentity';
import {useAppStore} from './src/hooks/useAppStore';
import {useCalculator} from './src/hooks/useCalculator';
import {useFavorites} from './src/hooks/useFavorites';
import {useReducedMotion} from './src/hooks/useReducedMotion';
import {useSettings} from './src/hooks/useSettings';
import AboutScreen from './src/screens/AboutScreen';
import BitSizesScreen from './src/screens/BitSizesScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import GameScreen from './src/screens/GameScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TapDrillScreen from './src/screens/TapDrillScreen';
import {tap} from './src/services/DeviceFeedback';
import {formatDiameter} from './src/utils/formatters';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'gameover'
  | 'tapDrill'
  | 'bitSizes'
  | 'favorites'
  | 'settings'
  | 'about';

export default function App(): React.JSX.Element {
  const store = useAppStore();
  const settings = useSettings(store);
  const reducedMotion = useReducedMotion(settings.reducedMotionPreference);
  const calculator = useCalculator(store, settings.units);
  const favorites = useFavorites(store);

  const [screen, setScreen] = useState<Screen>('loader');
  const [result, setResult] = useState<RpmResult | null>(null);
  const [resultLabel, setResultLabel] = useState('');
  const transitionLock = useRef(false);

  const favoriteIds = favorites.favorites.map(item => item.id);

  const goTo = useCallback((next: Screen) => setScreen(next), []);

  const goHome = useCallback(() => setScreen('menu'), []);

  // Android back: a working screen returns to the hub, a detail to its source.
  useEffect(() => {
    const onBack = () => {
      if (screen === 'loader' || screen === 'menu') {
        return false;
      }
      if (screen === 'gameover') {
        setScreen('game');
        return true;
      }
      setScreen('menu');
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [screen]);

  const handleLoaderDone = useCallback(() => setScreen('menu'), []);

  const handleStartCalc = useCallback(() => setScreen('game'), []);

  const handleCalculate = useCallback(() => {
    if (transitionLock.current) {
      return;
    }
    transitionLock.current = true;
    setTimeout(() => {
      transitionLock.current = false;
    }, TRANSITION_MS);

    const snapshot = calculator.commitResult();
    if (!snapshot) {
      return;
    }
    setResult(snapshot);
    setResultLabel(calculator.sizeLabel);
    setScreen('gameover');
  }, [calculator]);

  const handleToggleUnits = useCallback(() => {
    settings.setUnits(settings.units === 'metric' ? 'imperial' : 'metric');
  }, [settings]);

  const handleSelectTab = useCallback((id: TabId) => setScreen(id as Screen), []);

  const handleSaveSetup = useCallback(() => {
    if (!result) {
      return;
    }
    const material = getMaterial(result.materialId);
    const id = canonicalId('speed', {
      materialId: result.materialId,
      diameterNm: result.diameterNm,
    });
    if (favorites.isSaved(id)) {
      return;
    }
    favorites
      .save({
        kind: 'speed',
        diameterNm: result.diameterNm,
        sizeLabel: resultLabel || formatDiameter(result.diameterNm, settings.units),
        materialId: result.materialId,
        materialLabel: material.label,
        startRpm: result.startRpm,
        endRpm: result.endRpm,
      })
      .then(ok => {
        if (ok) {
          tap(settings.haptics);
        }
      });
  }, [favorites, result, resultLabel, settings.haptics, settings.units]);

  const handleToggleThreadFavorite = useCallback(
    (record: TapDrillRecord) => {
      const id = canonicalId('thread', {threadId: record.id});
      if (favorites.isSaved(id)) {
        void favorites.remove(id);
        return;
      }
      favorites
        .save({
          kind: 'thread',
          diameterNm: record.drillNm,
          sizeLabel: record.designation,
          threadId: record.id,
          threadLabel: record.designation,
          drillLabel: record.drillLabel,
        })
        .then(ok => {
          if (ok) {
            tap(settings.haptics);
          }
        });
    },
    [favorites, settings.haptics],
  );

  const handleToggleBitFavorite = useCallback(
    (record: BitSizeRecord) => {
      const id = canonicalId('bit', {diameterNm: record.diameterNm});
      if (favorites.isSaved(id)) {
        void favorites.remove(id);
        return;
      }
      favorites
        .save({
          kind: 'bit',
          diameterNm: record.diameterNm,
          sizeLabel: record.label,
        })
        .then(ok => {
          if (ok) {
            tap(settings.haptics);
          }
        });
    },
    [favorites, settings.haptics],
  );

  const handleUseThread = useCallback(
    (record: TapDrillRecord) => {
      calculator.applyDiameter(record.drillNm, record.drillLabel);
      setScreen('game');
    },
    [calculator],
  );

  const handleUseBit = useCallback(
    (record: BitSizeRecord) => {
      calculator.applyDiameter(record.diameterNm, record.label);
      setScreen('game');
    },
    [calculator],
  );

  const handleOpenFavorite = useCallback(
    (entry: Favorite) => {
      if (entry.kind === 'speed') {
        const snapshot = calculateRpm(entry.materialId || 'mildSteel', entry.diameterNm);
        if (snapshot) {
          calculator.setMaterial(snapshot.materialId);
          calculator.applyDiameter(entry.diameterNm, entry.sizeLabel);
          setResult(snapshot);
          setResultLabel(entry.sizeLabel);
          setScreen('gameover');
        }
        return;
      }
      if (entry.kind === 'thread') {
        const record = entry.threadId ? findThread(entry.threadId) : null;
        if (record) {
          setScreen('tapDrill');
        }
        return;
      }
      setScreen('bitSizes');
    },
    [calculator],
  );

  const handleEnterCustomSize = useCallback(() => setScreen('game'), []);

  const handleClearFavorites = useCallback(() => {
    void favorites.clearAll();
  }, [favorites]);

  const setupLabel =
    calculator.materialLabel + ' · ' + formatDiameter(calculator.diameterNm, settings.units);

  let body: React.ReactNode = null;

  if (screen === 'loader') {
    body = <LoaderScreen onDone={handleLoaderDone} reducedMotion={reducedMotion} />;
  } else if (screen === 'menu') {
    body = (
      <MenuScreen
        savedCount={favorites.count}
        setupLabel={setupLabel}
        notice={store.notice}
        reducedMotion={reducedMotion}
        onStartCalc={handleStartCalc}
        onTapDrill={() => goTo('tapDrill')}
        onBitSizes={() => goTo('bitSizes')}
        onFavorites={() => goTo('favorites')}
        onSettings={() => goTo('settings')}
        onAbout={() => goTo('about')}
      />
    );
  } else if (screen === 'game') {
    body = (
      <GameScreen
        calculator={calculator}
        units={settings.units}
        reducedMotion={reducedMotion}
        onBack={goHome}
        onToggleUnits={handleToggleUnits}
        onCalculate={handleCalculate}
        onSelectTab={handleSelectTab}
      />
    );
  } else if (screen === 'gameover' && result) {
    body = (
      <GameOverScreen
        result={result}
        sizeLabel={resultLabel}
        units={settings.units}
        saved={favorites.isSaved(
          canonicalId('speed', {
            materialId: result.materialId,
            diameterNm: result.diameterNm,
          }),
        )}
        saving={favorites.savingId !== null}
        reducedMotion={reducedMotion}
        onSave={handleSaveSetup}
        onBack={() => goTo('game')}
        onHome={goHome}
        onOpenTapDrill={() => goTo('tapDrill')}
        onCalculateAgain={() => goTo('game')}
      />
    );
  } else if (screen === 'tapDrill') {
    body = (
      <TapDrillScreen
        units={settings.units}
        favoriteIds={favoriteIds}
        savingId={favorites.savingId}
        reducedMotion={reducedMotion}
        onBack={goHome}
        onSelectTab={handleSelectTab}
        onToggleThreadFavorite={handleToggleThreadFavorite}
        onUseInCalculator={handleUseThread}
      />
    );
  } else if (screen === 'bitSizes') {
    body = (
      <BitSizesScreen
        units={settings.units}
        favoriteIds={favoriteIds}
        savingId={favorites.savingId}
        reducedMotion={reducedMotion}
        onBack={goHome}
        onSelectTab={handleSelectTab}
        onToggleBitFavorite={handleToggleBitFavorite}
        onUseInCalculator={handleUseBit}
        onEnterCustomSize={handleEnterCustomSize}
      />
    );
  } else if (screen === 'favorites') {
    body = (
      <FavoritesScreen
        favorites={favorites.favorites}
        units={settings.units}
        removedLabel={favorites.removedLabel}
        reducedMotion={reducedMotion}
        onBack={goHome}
        onSelectTab={handleSelectTab}
        onOpen={handleOpenFavorite}
        onRemove={id => void favorites.remove(id)}
        onUndo={() => void favorites.undo()}
        onDismissUndo={favorites.dismissUndo}
        onStartCalc={handleStartCalc}
      />
    );
  } else if (screen === 'settings') {
    body = (
      <SettingsScreen
        units={settings.units}
        haptics={settings.haptics}
        reducedMotionPreference={settings.reducedMotionPreference}
        reducedMotion={reducedMotion}
        savedCount={favorites.count}
        onBack={goHome}
        onHome={goHome}
        onSetUnits={settings.setUnits}
        onSetHaptics={settings.setHaptics}
        onSetReducedMotion={settings.setReducedMotion}
        onClearFavorites={handleClearFavorites}
        onAbout={() => goTo('about')}
      />
    );
  } else if (screen === 'about') {
    body = <AboutScreen reducedMotion={reducedMotion} onBack={goHome} onHome={goHome} />;
  } else {
    body = (
      <MenuScreen
        savedCount={favorites.count}
        setupLabel={setupLabel}
        notice={store.notice}
        reducedMotion={reducedMotion}
        onStartCalc={handleStartCalc}
        onTapDrill={() => goTo('tapDrill')}
        onBitSizes={() => goTo('bitSizes')}
        onFavorites={() => goTo('favorites')}
        onSettings={() => goTo('settings')}
        onAbout={() => goTo('about')}
      />
    );
  }

  const darkStatusBar = screen === 'loader' || screen === 'gameover';

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={darkStatusBar ? 'light-content' : 'dark-content'}
      />
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.colors.cream},
});
