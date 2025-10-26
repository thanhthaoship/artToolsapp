import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArtTool } from '../types/artTool';

const FAVORITES_KEY = 'FAVORITES_v1';

export async function loadFavorites(): Promise<Record<string, ArtTool>> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Error loading favorites', err);
    return {};
  }
}

export async function saveFavorites(favorites: Record<string, ArtTool>): Promise<void> {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.warn('Error saving favorites', err);
  }
}

export async function clearFavorites(): Promise<void> {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
  } catch (err) {
    console.warn('Error clearing favorites', err);
  }
}
