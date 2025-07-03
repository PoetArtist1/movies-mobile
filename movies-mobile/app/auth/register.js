import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../api.js';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('normal');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', { username, password, role });
      Alert.alert('Éxito', 'Registrado correctamente', [
        { text: 'OK', onPress: () => router.replace('/auth/login') }
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Problema al registrar');
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
        <Button title="Normal" onPress={() => setRole('normal')} />
        <Button title="Crítico" onPress={() => setRole('critico')} />
      </View>
      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
}
