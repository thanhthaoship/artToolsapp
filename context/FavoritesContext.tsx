import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ArtTool } from '../types/artTool';
import { loadFavorites, saveFavorites, clearFavorites as clearFavStorage } from '../utils/storage';

type FavoritesContextValue = {
  favorites: Record<string, ArtTool>;
  toggleFavorite: (item: ArtTool) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Record<string, ArtTool>>({});

  useEffect(() => {
    (async () => setFavorites(await loadFavorites()))();
  }, []);

  const persist = async (next: Record<string, ArtTool>) => {
    setFavorites(next);
    await saveFavorites(next);
  };

  const toggleFavorite = async (item: ArtTool) => {
    const next = { ...favorites };
    next[item.id] ? delete next[item.id] : (next[item.id] = item);
    await persist(next);
  };

  const removeFavorite = async (id: string) => {
    const next = { ...favorites };
    delete next[id];
    await persist(next);
  };

  const clearFavorites = async () => {
    setFavorites({});
    await clearFavStorage();
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, removeFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
};
