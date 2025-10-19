import React from "react";
import { View, Text } from "react-native";

export default function RatingStars({ rating }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ fontSize: 16, color: "#FFD700" }}>⭐ {rating}/5</Text>
    </View>
  );
}
