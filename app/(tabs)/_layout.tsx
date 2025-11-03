import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#709972ff" }, // 💚 đồng bộ với RootLayout
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#2E7D32", // xanh lá đậm hơn
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === "home"
              ? "home-outline"
              : route.name === "favorites"
                ? "heart-outline"
                : "camera-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "Home" }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            // ✅ Chỉ reset khi bấm tab Home
            router.replace({ pathname: "/home", params: { reset: "true" } });
          },
        }}
      />

      {/* ❤️ Favorites tab */}
      <Tabs.Screen
        name="favorites"
        options={{ title: "Favorites" }}
      />

      {/* 📸 Image Picker tab */}
      <Tabs.Screen
        name="imagepicker"
        options={{ title: "Image Picker" }}
      />
    </Tabs>
  );
}
