import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import ArtToolCard from "../../components/custom/ArtToolCard";
import { ArtTool } from "../../utils/types";
import { getArtTools } from "../../utils/api";
import { useFavorites } from "../../context/FavoritesContext";

export default function HomeScreen() {
  const [tools, setTools] = useState<ArtTool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [searchText, setSearchText] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getArtTools();
        setTools(data || []);
      } catch (e) {
        console.error("Error fetching tools", e);
        setTools([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  const brands = Array.from(new Set(tools.map((t) => t.brand).filter(Boolean))) as string[];

  const filtered = tools.filter((t) => {
    const matchesSearch = t.artName.toLowerCase().includes(searchText.toLowerCase());
    const matchesBrand = selectedBrand ? t.brand === selectedBrand : true;
    return matchesSearch && matchesBrand;
  });

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        style={styles.search}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search art tools..."
      />

      <FlatList
        horizontal
        data={brands}
        keyExtractor={(item, idx) => `${item}-${idx}`}
        renderItem={({ item }) => {
          const selected = selectedBrand === item;
          return (
            <View style={{ paddingHorizontal: 4 }}>
              <Text
                onPress={() => setSelectedBrand(selected ? null : item)}
                style={[styles.brandButton, selected && styles.brandSelected, { padding: 10 }]}
              >
                {item}
              </Text>
            </View>
          );
        }}
        style={{ marginBottom: 10 }}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ArtToolCard
            tool={{ ...item, isFavorite: isFavorite(item.id) }}
            onPress={() => router.push(`/detail?id=${item.id}`)}
            onFavorite={() => toggleFavorite(item)}
          />
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 30 }}>No art tools found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  brandButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    minWidth: 70,
  },
  brandSelected: {
    backgroundColor: "#2E7D32",
    color: "#fff",
  },
});
