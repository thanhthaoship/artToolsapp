import { View, FlatList, Text, Alert } from "react-native";
import { useEffect, useState } from "react";
import ArtToolCard from "../../components/custom/ArtToolCard";
import {
  getFavorites,
  removeFavorite,
  clearFavorites,
} from "../../utils/storage";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    const data = await getFavorites();
    setFavorites(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const removeAll = async () => {
    Alert.alert("Confirm", "Remove all favorites?", [
      { text: "Cancel" },
      { text: "OK", onPress: async () => {
          await clearFavorites();
          loadFavorites();
        }
      },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {favorites.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 30 }}>
          No favorites yet ❤️
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ArtToolCard
              tool={{ ...item, isFavorite: true }}
              onPress={() => router.push(`/detail?id=${item.id}`)}
              onFavorite={() => {
                removeFavorite(item.id).then(loadFavorites);
              }}
            />
          )}
        />
      )}
      {favorites.length > 0 && (
        <Text
          onPress={removeAll}
          style={{
            textAlign: "center",
            color: "red",
            marginVertical: 10,
            fontWeight: "600",
          }}
        >
          Remove All
        </Text>
      )}
    </View>
  );
}
