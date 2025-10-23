import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 🔹 Định nghĩa kiểu dữ liệu
export interface ArtTool {
  id: number;
  artName: string;
  price: number;
  image: string;
  brand?: string; // ✅ thêm dòng này
  description?: string;
  limitedTimeDeal?: number;
  feedbacks?: {
    rating: number;
    comment: string;
    author: string;
  }[];
  isFavorite?: boolean;
}


// 🔹 Kiểu prop cho component
interface ArtToolCardProps {
  tool: ArtTool;
  onPress: () => void;
  onFavorite: () => void;
}

export default function ArtToolCard({ tool, onPress, onFavorite }: ArtToolCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 10,
        overflow: "hidden",
        elevation: 2,
      }}
    >
      <Image
        source={{ uri: tool.image }}
        style={{ width: "100%", height: 180 }}
        resizeMode="cover"
      />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 5 }}>
          {tool.artName}
        </Text>
        <Text style={{ fontSize: 14, color: "gray" }}>Price: ${tool.price}</Text>

        {/* Khu vực chứa tim ❤️ */}
        <Pressable
          onPress={onFavorite}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: 20,
            padding: 4,
          }}
        >
          <Ionicons
            name={tool.isFavorite ? "heart" : "heart-outline"}
            color={tool.isFavorite ? "red" : "gray"}
            size={24}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}
