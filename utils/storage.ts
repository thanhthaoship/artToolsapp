import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArtTool } from "./types";

const FAVORITES_KEY = "favorites";

export async function getFavorites(): Promise<ArtTool[]> {
  const data = await AsyncStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

export async function addFavorite(tool: ArtTool): Promise<void> {
  const favorites = await getFavorites();
  if (!favorites.some((item) => item.id === tool.id)) {
    const updated = [...favorites, tool];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  }
}

export async function removeFavorite(id: number): Promise<void> {
  const favorites = await getFavorites();
  const updated = favorites.filter((item) => item.id !== id);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

export async function clearFavorites(): Promise<void> {
  await AsyncStorage.removeItem(FAVORITES_KEY);
}
