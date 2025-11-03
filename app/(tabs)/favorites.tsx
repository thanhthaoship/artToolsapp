import React from 'react';
import { View, Text, FlatList, Image, Pressable, Alert, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '../../context/FavoritesContext';
import { EvilIcons } from "@expo/vector-icons";

export default function Favorites() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const router = useRouter();
  const favList = Object.values(favorites);


  const confirmClear = () => {
    Alert.alert('Clear All', 'Remove all favorites?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: clearFavorites },
    ]);
  };

  if (favList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorites yet 💔</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }} // đủ khoảng trống cho nút nổi
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/detail', params: { id: item.id } })}
            style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.itemName}>{item.artName}</Text>
              <Text>${item.price}</Text>
            </View>
            <Pressable onPress={() => removeFavorite(item.id)}>
              <EvilIcons name="trash" size={32} color="#d9534f" />
            </Pressable>
          </Pressable>
        )}
      />

      {/* Nút Clear All nổi */}
      <Pressable
        style={({ pressed }) => [
          styles.floatingButton,
          pressed && styles.floatingButtonPressed,
        ]}
        onPress={confirmClear}
      >
        <Text style={styles.clearButtonText}>Clear All</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  itemName: {
    fontWeight: '700',
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#e3635f',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 6, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  floatingButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  clearButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
