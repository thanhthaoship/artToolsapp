import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchArtToolById } from '../utils/api';
import { ArtTool } from '../types/artTool';
import { useFavorites } from '../context/FavoritesContext';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<ArtTool | null>(null);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();

  const isFav = !!(id && favorites[id]);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const data = await fetchArtToolById(id);
      setItem(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#8FBC8F" />;
  }
  if (!item) {
    return <Text style={{ margin: 20 }}>ArtTool not found.</Text>;
  }

  // safe average
  const feedbacks = Array.isArray(item.feedbacks) ? item.feedbacks : [];
  const avgRating =
    feedbacks.length > 0
      ? feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0) / feedbacks.length
      : 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ padding: 16 }}>
      <Image
        source={{ uri: item.image }}
        style={{ width: '100%', height: 250, borderRadius: 12, marginBottom: 16 }}
        resizeMode="contain"
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '700', flex: 1 }}>{item.artName}</Text>

        <Pressable onPress={() => toggleFavorite(item)} hitSlop={8}>
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={30}
            color={isFav ? '#b01f1f' : '#cfbbbb'}
            style={{
              textShadowColor: 'rgba(0,0,0,0.2)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}
          />
        </Pressable>
      </View>

      <Text style={{ color: '#ee2330', fontWeight: '700', fontSize: 30, marginTop: 8 }}>${item.price}</Text>

      <Text style={{ marginVertical: 8 }}>{item.description}</Text>

      {/* Ratings & Feedbacks */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 8 }}>Ratings & Feedbacks</Text>

        {feedbacks.length > 0 ? (
          <>
            {/* average row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>
                {avgRating.toFixed(1)} / 5
              </Text>

              <Ionicons name="star" size={20} color="#FFD700" style={{ marginLeft: 6 }} />

              <Text style={{ color: '#666', marginLeft: 8 }}>
                ({feedbacks.length} reviews)
              </Text>
            </View>

            {/* list */}
            {feedbacks.map((fb, idx) => (
              <View
                key={idx}
                style={{
                  marginBottom: 12,
                  borderBottomWidth: 0.5,
                  borderColor: '#ddd',
                  paddingBottom: 8,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontWeight: '600' }}>{fb.rating}</Text>
                  <Ionicons name="star" size={16} color="#FFD700" style={{ marginLeft: 6 }} />
                </View>

                <Text style={{ fontStyle: 'italic', marginVertical: 6 }}>{fb.comment}</Text>

                <Text style={{ color: '#666', fontSize: 12 }}>by {fb.author}</Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={{ color: '#888', fontStyle: 'italic' }}>No feedback yet</Text>
        )}
      </View>
    </ScrollView>
  );
}
