import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
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
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="favorites" options={{ title: "Favorites" }} />
      <Tabs.Screen name="imagepicker" options={{ title: "Image Picker" }} />

    </Tabs>
  );
}
