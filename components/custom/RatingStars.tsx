import React from "react";
import { View, Text } from "react-native";

interface RatingStarsProps {
  rating: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ fontSize: 16, color: "#FFD700" }}>⭐ {rating}/5</Text>
    </View>
  );
};

export default RatingStars;
