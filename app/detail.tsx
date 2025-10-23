import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import RatingStars from "../components/custom/RatingStars";
import { getArtToolById } from "../utils/api";
import { ArtTool } from "../utils/types";
import { useFavorites } from "../context/FavoritesContext";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tool, setTool] = useState<ArtTool | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await getArtToolById(id);
        setTool(data as ArtTool);
      } catch (e) {
        console.error("Error loading tool", e);
        setTool(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (!tool) return <Text style={{ marginTop: 50, textAlign: "center" }}>Tool not found</Text>;

  return (
    <ScrollView style={{ padding: 10 }}>
      <Image source={{ uri: tool.image }} style={{ width: "100%", height: 250, borderRadius: 10 }} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", flex: 1 }}>{tool.artName}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(tool)}>
          <Ionicons name={isFavorite(tool.id) ? "heart" : "heart-outline"} size={26} color={isFavorite(tool.id) ? "red" : "gray"} />
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 16, color: "gray", marginTop: 8 }}>${tool.price}</Text>
      {tool.limitedTimeDeal ? <Text style={{ color: "green", marginTop: 6 }}>Limited time deal: {Math.round((tool.limitedTimeDeal ?? 0) * 100)}% off</Text> : null}

      <RatingStars rating={tool.feedbacks?.[0]?.rating ?? 4} />

      <Text style={{ marginTop: 10, lineHeight: 20 }}>{tool.description ?? "No description."}</Text>

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>Feedbacks</Text>
        {tool.feedbacks && tool.feedbacks.length > 0 ? (
          tool.feedbacks.map((fb, i) => (
            <View key={i} style={{ backgroundColor: "#f5f5f5", padding: 10, borderRadius: 10, marginBottom: 8 }}>
              <RatingStars rating={fb.rating} />
              <Text style={{ fontStyle: "italic", marginTop: 5 }}>"{fb.comment}"</Text>
              <Text style={{ fontSize: 12, color: "gray", marginTop: 5 }}>- {fb.author}</Text>
            </View>
          ))
        ) : (
          <Text style={{ color: "gray", fontStyle: "italic" }}>No feedbacks yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}
