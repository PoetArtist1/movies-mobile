import { Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="auth/login" options={{ headerTitle: 'Iniciar Sesión' }} />
      <Stack.Screen name="auth/register" options={{ headerTitle: 'Registrarse' }} />
      <Stack.Screen name="index" options={{ headerTitle: 'Películas' }} />
      <Stack.Screen name="movies/[movieId]" options={{ headerTitle: 'Detalle' }} />
    </Stack>
  );
}
