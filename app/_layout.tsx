import React from 'react';
import { Stack } from 'expo-router';
import { FavoritesProvider } from '../context/FavoritesContext';

export default function RootLayout() {
  return (
      <FavoritesProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#81C784' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
        >
          {/* App chính */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="detail" options={{ title: 'Tool Details' }} />
        </Stack>
      </FavoritesProvider>
  );
}
