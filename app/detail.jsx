import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { getArtToolById } from "../utils/api";
import RatingStars from "../components/custom/RatingStars";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const [tool, setTool] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // 🔹 Lấy dữ liệu chi tiết sản phẩm
  useEffect(() => {
    getArtToolById(id).then(setTool);
  }, [id]);

  // 🔹 Kiểm tra sản phẩm có trong danh sách yêu thích không
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("favorites");
        const favorites = jsonValue != null ? JSON.parse(jsonValue) : [];
        const found = favorites.some((item) => item.id === id);
        setIsFavorite(found);
      } catch (e) {
        console.log("Error reading favorites", e);
      }
    };
    checkFavorite();
  }, [id]);

  // 🔹 Hàm thêm/bỏ yêu thích
  const toggleFavorite = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("favorites");
      let favorites = jsonValue != null ? JSON.parse(jsonValue) : [];

      if (isFavorite) {
        favorites = favorites.filter((item) => item.id !== tool.id);
      } else {
        favorites.push(tool);
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.log("Error updating favorites", e);
    }
  };

  if (!tool)
    return (
      <Text style={{ marginTop: 50, textAlign: "center" }}>Loading...</Text>
    );

  return (
    <ScrollView style={{ padding: 10 }}>
      <Image
        source={{ uri: tool.image }}
        style={{ width: "100%", height: 250, borderRadius: 10 }}
        resizeMode="cover"
      />

      {/* 🔹 Tên + Nút trái tim */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start", // 👈 quan trọng: để icon nằm trên cùng hàng đầu tiên
          marginTop: 15,
          marginBottom: 10,
          paddingHorizontal: 4,
        }}
      >
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              flexWrap: "wrap", // 👈 cho phép xuống dòng
            }}
          >
            {tool.artName}
          </Text>
        </View>

        <TouchableOpacity onPress={toggleFavorite}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={26}
            color={isFavorite ? "red" : "gray"}
          />
        </TouchableOpacity>
      </View>



      <Text style={{ fontSize: 16, color: "gray", marginBottom: 5 }}>
        ${tool.price}
      </Text>

      {/* 🔹 Limited Time Deal */}
      {tool.limitedTimeDeal ? (
        <Text style={{ color: "green", marginBottom: 5 }}>
          Limited time deal: {Math.round(tool.limitedTimeDeal * 100)}% off
        </Text>
      ) : null}

      {/* 🔹 Rating */}
      <RatingStars rating={tool.feedbacks?.[0]?.rating || 4} />

      {/* 🔹 Mô tả */}
      <Text style={{ marginTop: 10, lineHeight: 20 }}>{tool.description}</Text>

      {/* 🔹 Feedback */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
          Feedbacks
        </Text>

        {tool.feedbacks && tool.feedbacks.length > 0 ? (
          tool.feedbacks.map((fb, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "#f5f5f5",
                borderRadius: 10,
                padding: 10,
                marginBottom: 8,
              }}
            >
              <RatingStars rating={fb.rating} />
              <Text style={{ fontStyle: "italic", marginTop: 5 }}>
                "{fb.comment}"
              </Text>
              <Text style={{ fontSize: 12, color: "gray", marginTop: 5 }}>
                - {fb.author}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ color: "gray", fontStyle: "italic" }}>
            No feedbacks yet.
          </Text>
        )}
      </View>

    </ScrollView>
  );
}
