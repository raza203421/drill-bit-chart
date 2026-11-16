import {useCallback, useRef, useState} from 'react';
import {REFERENCE_DATA_VERSION} from '../constants/config';
import {canonicalId, Favorite, FavoriteKind} from '../game/favoriteIdentity';
import {AppStore} from './useAppStore';

export type NewFavorite = {
  kind: FavoriteKind;
  diameterNm: number;
  sizeLabel: string;
  materialId?: string;
  materialLabel?: string;
  startRpm?: number;
  endRpm?: number;
  threadId?: string;
  threadLabel?: string;
  drillLabel?: string;
};

export type FavoritesApi = {
  favorites: Favorite[];
  count: number;
  savingId: string | null;
  removedLabel: string | null;
  idFor: (entry: NewFavorite) => string;
  isSaved: (id: string) => boolean;
  save: (entry: NewFavorite) => Promise<boolean>;
  remove: (id: string) => Promise<void>;
  undo: () => Promise<void>;
  dismissUndo: () => void;
  clearAll: () => Promise<void>;
};

export function useFavorites(store: AppStore): FavoritesApi {
  const {commit, state, setNotice} = store;
  const favorites = state.favorites;
  const [savingId, setSavingId] = useState<string | null>(null);
  const [removedLabel, setRemovedLabel] = useState<string | null>(null);
  const removedRef = useRef<{entry: Favorite; index: number} | null>(null);

  const idFor = useCallback(
    (entry: NewFavorite) =>
      canonicalId(entry.kind, {
        diameterNm: entry.diameterNm,
        materialId: entry.materialId,
        threadId: entry.threadId,
      }),
    [],
  );

  const isSaved = useCallback(
    (id: string) => favorites.some(item => item.id === id),
    [favorites],
  );

  const save = useCallback(
    async (entry: NewFavorite) => {
      const id = canonicalId(entry.kind, {
        diameterNm: entry.diameterNm,
        materialId: entry.materialId,
        threadId: entry.threadId,
      });
      if (state.favorites.some(item => item.id === id)) {
        return true;
      }
      setSavingId(id);
      const record: Favorite = {
        ...entry,
        id,
        createdAt: Date.now(),
        referenceDataVersion: REFERENCE_DATA_VERSION,
      };
      const ok = await commit({favorites: [record, ...state.favorites]});
      setSavingId(null);
      if (!ok) {
        setNotice('Could not save on this device. Try again.');
      }
      return ok;
    },
    [commit, setNotice, state.favorites],
  );

  const remove = useCallback(
    async (id: string) => {
      const index = state.favorites.findIndex(item => item.id === id);
      if (index === -1) {
        return;
      }
      const entry = state.favorites[index];
      const next = state.favorites.slice();
      next.splice(index, 1);
      const ok = await commit({favorites: next});
      if (ok) {
        removedRef.current = {entry, index};
        setRemovedLabel(entry.sizeLabel);
      } else {
        setNotice('Could not update saved items. Try again.');
      }
    },
    [commit, setNotice, state.favorites],
  );

  const undo = useCallback(async () => {
    const stashed = removedRef.current;
    if (!stashed) {
      return;
    }
    const next = state.favorites.slice();
    next.splice(Math.min(stashed.index, next.length), 0, stashed.entry);
    await commit({favorites: next});
    removedRef.current = null;
    setRemovedLabel(null);
  }, [commit, state.favorites]);

  const dismissUndo = useCallback(() => {
    removedRef.current = null;
    setRemovedLabel(null);
  }, []);

  const clearAll = useCallback(async () => {
    removedRef.current = null;
    setRemovedLabel(null);
    await commit({favorites: []});
  }, [commit]);

  return {
    favorites,
    count: favorites.length,
    savingId,
    removedLabel,
    idFor,
    isSaved,
    save,
    remove,
    undo,
    dismissUndo,
    clearAll,
  };
}
