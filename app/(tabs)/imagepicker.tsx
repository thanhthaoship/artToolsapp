import React, { useState, useEffect } from "react";
import { View, Image, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function ImagePickerScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const savedImage = await AsyncStorage.getItem("savedImage");
      if (savedImage) setSelectedImage(savedImage);
    })();
  }, []);

  const saveImage = async (uri: string) => {
    try {
      await AsyncStorage.setItem("savedImage", uri);
    } catch (error) {
      console.error("Lỗi khi lưu ảnh:", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Cần quyền truy cập", "Hãy cho phép truy cập thư viện ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      saveImage(uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Cần quyền truy cập", "Hãy cho phép sử dụng camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      saveImage(uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Ionicons name="camera" size={26} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Chụp ảnh</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Ionicons name="images" size={26} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Chọn ảnh từ thư viện</Text>
      </TouchableOpacity>

      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  button: {
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#709972",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 50, 
    marginBottom: 15,
    width: 280,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 15,
    resizeMode: "cover",
  },
});
