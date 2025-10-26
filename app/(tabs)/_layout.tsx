import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default function TabsLayout() {
  return (
    <>
      {/* Ẩn thanh status bar mặc định của Android */}
      <StatusBar style="light" backgroundColor="#81C784" />
      <Tabs
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: "#709972ff" }, // 💚 đồng bộ với RootLayout
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          tabBarActiveTintColor: "#2E7D32", // xanh lá đậm hơn
          tabBarInactiveTintColor: "gray",
          tabBarIcon: ({ color, size }) => {
            const iconName =
              route.name === "home" ? "home-outline" : "heart-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="home" options={{ title: "Home" }} />
        <Tabs.Screen name="favorites" options={{ title: "Favorites" }} />
      </Tabs>
    </>
  );
}
