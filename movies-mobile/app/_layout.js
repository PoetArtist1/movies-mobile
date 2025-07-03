import { Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="auth/login" 
        options={{ 
          headerTitle: 'Iniciar Sesión',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="auth/register" 
        options={{ 
          headerTitle: 'Registrarse',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="index" 
        options={{ 
          headerTitle: 'Películas',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="movies/[movieId]" 
        options={{ 
          headerTitle: 'Detalle',
          headerShown: true
        }} 
      />
    </Stack>
  );
}