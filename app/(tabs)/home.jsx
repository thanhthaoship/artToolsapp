import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Animated, TouchableWithoutFeedback } from "react-native";
import ArtToolCard from "../../components/custom/ArtToolCard";
import { getArtTools } from "../../utils/api";
import { addFavorite, getFavorites, removeFavorite } from "../../utils/storage";
import { router } from "expo-router";

export default function HomeScreen() {
  const [tools, setTools] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getArtTools();
      setTools(data);
      const favs = await getFavorites();
      setFavorites(favs);
      setLoading(false);
    };
    fetchData();
  }, []);

  const toggleFavorite = async (tool) => {
    const isFav = favorites.some((item) => item.id === tool.id);
    if (isFav) {
      await removeFavorite(tool.id);
    } else {
      await addFavorite(tool);
    }
    const favs = await getFavorites();
    setFavorites(favs);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  // Lấy danh sách brand duy nhất từ tools
  const brands = [...new Set(tools.map((t) => t.brand))];

  // Lọc theo search + brand
  const filtered = tools.filter((t) => {
    const matchesSearch = t.artName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesBrand = selectedBrand ? t.brand === selectedBrand : true;
    return matchesSearch && matchesBrand;
  });

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* 🔎 Thanh tìm kiếm */}
      <TextInput
        style={styles.search}
        placeholder="Search art tools..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* 🏷️ Bộ lọc theo brand */}
      <FlatList
        horizontal
        data={brands}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => {
          const isSelected = selectedBrand === item;
          return (
            <View
              style={{
                paddingHorizontal: 4, // ✅ giữ khoảng cách ổn định, tránh co giãn khi rerender
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  setSelectedBrand(isSelected ? null : item)
                }
                activeOpacity={0.8}
                style={[
                  styles.brandButton,
                  isSelected && styles.brandSelected,
                ]}
              >
                <Text
                  style={{
                    color: isSelected ? "white" : "#333",
                    fontWeight: "500",
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        style={{ marginBottom: 10 }}
      />

      {/* 🧩 Danh sách sản phẩm */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ArtToolCard
            tool={{
              ...item,
              isFavorite: favorites.some((fav) => fav.id === item.id),
            }}
            onPress={() => router.push(`/detail?id=${item.id}`)}
            onFavorite={() => toggleFavorite(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 30 }}>
            No art tools found
          </Text>
        }
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
  },
  brandSelected: {
    backgroundColor: "#2E7D32",
    borderColor: "#007AFF",
  },
});
