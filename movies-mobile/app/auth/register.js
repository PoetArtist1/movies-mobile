import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
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
    <View style={styles.container}>
      <TextInput
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'normal' && styles.roleButtonSelected]}
          onPress={() => setRole('normal')}
        >
          <Text style={[styles.roleText, role === 'normal' && styles.roleTextSelected]}>Normal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'critico' && styles.roleButtonSelected]}
          onPress={() => setRole('critico')}
        >
          <Text style={[styles.roleText, role === 'critico' && styles.roleTextSelected]}>Crítico</Text>
        </TouchableOpacity>
      </View>

      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9fb',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  roleButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#aaa',
    backgroundColor: '#fff',
  },
  roleButtonSelected: {
    backgroundColor: '#4a90e2',
    borderColor: '#357ABD',
  },
  roleText: {
    fontSize: 16,
    color: '#555',
  },
  roleTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});
