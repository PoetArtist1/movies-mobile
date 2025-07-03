import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TextInput, Button, Alert } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import api from '../../api';

export default function MovieDetail() {
  const { movieId } = useSearchParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [myText, setMyText] = useState('');
  const [myScore, setMyScore] = useState('5');

  const load = async () => {
    const { data: m } = await api.get(`/movies/${movieId}`);
    setMovie(m);
    const { data: c } = await api.get(`/comments/movie/${movieId}`);
    setComments(c);
  };

  useEffect(() => { load(); }, []);

  const postComment = async () => {
    try {
      await api.post('/comments', { movie_id: movieId, text: myText, score: parseInt(myScore) });
      Alert.alert('OK', 'Comentario agregado', [{ text: 'OK', onPress: load }]);
    } catch {
      Alert.alert('Error', 'No se pudo agregar comentario');
    }
  };

  if (!movie) return <Text>Cargando...</Text>;

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Image source={{ uri: movie.cover }} style={{ width: '100%', height: 200, marginBottom: 10 }} />
      <Text style={{ fontSize: 24, marginBottom: 5 }}>{movie.title}</Text>
      <Text style={{ marginBottom: 5 }}>{movie.synopsis}</Text>
      <Text>Fecha: {movie.release_date}</Text>
      <Text>Actores: {movie.actors}</Text>
      <Text>Score TMDB: {movie.tmdb_score}</Text>
      <Text>Score Usuarios: {movie.user_score}</Text>

      <Text style={{ marginTop: 20, fontSize: 18 }}>Comentarios:</Text>
      <FlatList
        data={comments}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 5 }}>
            <Text>
              {item.username} ({item.role}): {item.score}/10
            </Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <TextInput
        placeholder="Tu comentario"
        value={myText}
        onChangeText={setMyText}
        style={{ borderWidth: 1, padding: 5, marginVertical: 5 }}
      />
      <TextInput
        placeholder="Puntaje 1-10"
        value={myScore}
        onChangeText={setMyScore}
        keyboardType="numeric"
        style={{ borderWidth: 1, width: 80, padding: 5, marginBottom: 10 }}
      />
      <Button title="Agregar comentario" onPress={postComment} />
    </View>
  );
}
