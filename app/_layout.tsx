import { Stack } from "expo-router";
import { FavoritesProvider } from "../context/FavoritesContext";
import React from "react";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#81C784" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      >
        {/* Tabs (Home, Favorites, etc.) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Chi tiết sản phẩm */}
        <Stack.Screen
          name="detail"
          options={{ title: "Tool Details" }}
        />
      </Stack>
    </FavoritesProvider>
  );
}
