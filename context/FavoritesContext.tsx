import React, { createContext, useContext, useState, ReactNode } from "react";
import { ArtTool } from "@/utils/types";

interface FavoritesContextType {
  favorites: ArtTool[];
  toggleFavorite: (tool: ArtTool) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<ArtTool[]>([]);

  const toggleFavorite = (tool: ArtTool) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === tool.id);
      if (exists) {
        return prev.filter((item) => item.id !== tool.id);
      } else {
        return [...prev, { ...tool, isFavorite: true }];
      }
    });
  };

  const isFavorite = (id: number) => favorites.some((item) => item.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
};
