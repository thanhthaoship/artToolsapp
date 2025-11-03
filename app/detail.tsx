import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fetchArtToolById } from "../utils/api";
import { ArtTool } from "../types/artTool";
import { useFavorites } from "../context/FavoritesContext";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<ArtTool | null>(null);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();

  const isFav = !!(id && favorites[id]);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const data = await fetchArtToolById(id);
      setItem(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <ActivityIndicator
        style={{ marginTop: 40 }}
        size="large"
        color="#8FBC8F"
      />
    );
  }

  if (!item) {
    return <Text style={{ margin: 20 }}>Art tool not found.</Text>;
  }

  // 🧮 Discount logic
  const deal = item.limitedTimeDeal ?? 0; // fallback 0 nếu undefined
  const hasDiscount = deal > 0;
  const discountedPrice = item.price * (1 - deal);

  // ⭐ Feedback
  const feedbacks = Array.isArray(item.feedbacks) ? item.feedbacks : [];
  const avgRating =
    feedbacks.length > 0
      ? feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0) /
        feedbacks.length
      : 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Ảnh sản phẩm */}
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: item.image }}
          style={{
            width: "100%",
            height: 250,
            borderRadius: 12,
            marginBottom: 16,
          }}
          resizeMode="contain"
        />

        {/* Gắn nhãn giảm giá nếu có */}
        {hasDiscount && (
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "#ee2330",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
              -{Math.round(deal * 100)}%
            </Text>
          </View>
        )}
      </View>

      {/* Tên + Nút ❤️ */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "700", flex: 1 }}>
          {item.artName}
        </Text>

        <Pressable onPress={() => toggleFavorite(item)} hitSlop={8}>
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={30}
            color={isFav ? "#b01f1f" : "#cfbbbb"}
          />
        </Pressable>
      </View>

      {/* 💰 Giá hiển thị */}
      {hasDiscount ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 6,
            gap: 8,
          }}
        >
          <Text
            style={{
              color: "#888",
              textDecorationLine: "line-through",
              fontSize: 18,
            }}
          >
            ${item.price.toFixed(2)}
          </Text>
          <Text
            style={{
              color: "#ee2330ff",
              fontWeight: "700",
              fontSize: 24,
            }}
          >
            ${discountedPrice.toFixed(2)}
          </Text>
        </View>
      ) : (
        <Text
          style={{
            color: "#709972ff",
            fontWeight: "700",
            fontSize: 24,
            marginTop: 8,
          }}
        >
          ${item.price.toFixed(2)}
        </Text>
      )}

      {/* Mô tả */}
      <Text style={{ marginVertical: 10, color: "#333" }}>
        {item.description || "No description available."}
      </Text>

      {/* ⭐ Ratings & Feedback */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: "700", fontSize: 18, marginBottom: 8 }}>
          Ratings & Feedbacks
        </Text>

        {feedbacks.length > 0 ? (
          <>
            {/* Average rating */}
            <View
              style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {avgRating.toFixed(1)} / 5
              </Text>
              <Ionicons
                name="star"
                size={20}
                color="#FFD700"
                style={{ marginLeft: 6 }}
              />
              <Text style={{ color: "#666", marginLeft: 8 }}>
                ({feedbacks.length} reviews)
              </Text>
            </View>

            {/* Feedback list */}
            {feedbacks.map((fb, idx) => (
              <View
                key={idx}
                style={{
                  marginBottom: 12,
                  borderBottomWidth: 0.5,
                  borderColor: "#ddd",
                  paddingBottom: 8,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontWeight: "600" }}>{fb.rating}</Text>
                  <Ionicons
                    name="star"
                    size={16}
                    color="#FFD700"
                    style={{ marginLeft: 6 }}
                  />
                </View>
                <Text
                  style={{ fontStyle: "italic", marginVertical: 6, color: "#333" }}
                >
                  {fb.comment}
                </Text>
                <Text style={{ color: "#666", fontSize: 12 }}>by {fb.author}</Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={{ color: "#888", fontStyle: "italic" }}>
            No feedback yet
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
