import React from "react";
import { View, FlatList, Text } from "react-native";
import ArtToolCard from "../../components/custom/ArtToolCard";
import { useFavorites } from "../../context/FavoritesContext";
import { router } from "expo-router";

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  if (favorites.length === 0) {
    return <Text style={{ textAlign: "center", marginTop: 30 }}>No favorites yet ❤️</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ArtToolCard
            tool={{ ...item, isFavorite: isFavorite(item.id) }}
            onPress={() => router.push(`/detail?id=${item.id}`)}
            onFavorite={() => toggleFavorite(item)}
          />
        )}
      />
    </View>
  );
}
