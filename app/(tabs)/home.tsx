import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArtTool } from '../../types/artTool';
import { useFavorites } from '../../context/FavoritesContext';
import { fetchArtTools } from '../../utils/api';
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState<ArtTool[]>([]);
  const [filtered, setFiltered] = useState<ArtTool[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [brandFilter, setBrandFilter] = useState<string>('All');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchArtTools();
        setData(list);
        setFiltered(list);
        setBrands(['All', ...Array.from(new Set(list.map(i => i.brand || 'Unknown')))]);
      } catch (err) {
        Alert.alert('Error', 'Cannot load data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let temp = [...data];
    if (brandFilter !== 'All') temp = temp.filter(it => it.brand === brandFilter);
    if (query.trim()) temp = temp.filter(it => it.artName.toLowerCase().includes(query.toLowerCase()));
    setFiltered(temp);
  }, [data, brandFilter, query]);

  const renderItem = ({ item }: { item: ArtTool }) => {
    const isFav = !!favorites[item.id];
    return (
      <Pressable
        onPress={() => router.push({ pathname: '/detail', params: { id: item.id } })}
        style={{
          flexDirection: 'row',
          marginVertical: 8,
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}>
        <Image source={{ uri: item.image }} style={{ width: 80, height: 80, borderRadius: 6, marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', marginBottom: 4 }}>{item.artName}</Text>
          <Text style={{ color: '#666' }}>Brand: {item.brand}</Text>
          <Text style={{ color: '#ee2330ff', fontWeight: '600' }}>${item.price}</Text>
        </View>
        <Pressable onPress={() => toggleFavorite(item)} hitSlop={8}>
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={26}
            color={isFav ? "#E57373" : "#ccc"}
          />
        </Pressable>
      </Pressable>
    );
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#8FBC8F" />;

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
      {/* 🔹 Phần search + filter */}
      <View style={{ padding: 10, backgroundColor: '#f4f4f4' }}>
        <TextInput
          placeholder="Search art tools..."
          value={query}
          onChangeText={setQuery}
          style={{
            backgroundColor: 'white',
            padding: 8,
            borderRadius: 10,
            marginBottom: 10,
          }}
        />

        <FlatList
          data={brands}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setBrandFilter(item)}
              style={{
                backgroundColor: brandFilter === item ? '#709972ff' : 'white',
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
                borderWidth: 1,
                borderColor: '#709972ff',
              }}
            >
              <Text
                style={{
                  color: brandFilter === item ? 'white' : '#333',
                  fontWeight: '600',
                }}
              >
                {item}
              </Text>
            </Pressable>
          )}
          contentContainerStyle={{
            alignItems: 'center',
            paddingVertical: 4,
          }}
        />
      </View>

      {/* 🔹 Phần danh sách sản phẩm */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ flex: 1, paddingHorizontal: 10 }}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No items found</Text>
          </View>
        }
      />
    </View>
  );

}
