import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../api.js';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { data } = await api.post('/auth/login', { username, password });
      global.token = data.token;
      global.user = data.user;
      console.log("Sesión iniciada");
      router.replace('/');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.msg || 'Problema al iniciar sesión');
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
      <TextInput placeholder="Usuario" value={username} onChangeText={setUsername} style={{ marginBottom: 10 }} />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 20 }}
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
      <View style={{ height: 10 }} />
      <Button title="Registrarse" onPress={() => router.push('/auth/register')} />
    </View>
  );
}
