import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../api';

export default function MovieDetail() {
  const router = useRouter();
  // Obtenemos el movieId directamente del query string
  const { movieId } = router.query || {};
  
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [myText, setMyText] = useState('');
  const [myScore, setMyScore] = useState('5');

  const load = async () => {
    try {
      if (!movieId) return;
      
      const { data: m } = await api.get(`/movies/${movieId}`);
      setMovie(m);
      console.log(movie);
      const { data: c } = await api.get(`/comments/movie/${movieId}`);
      setComments(c);
    } catch (error) {
      console.error('Error loading movie:', error);
    }
  };

  useEffect(() => { 
    if (movieId) {
      load();
    }
  }, [movieId]);

  const postComment = async () => {
    try {
      await api.post('/comments', { 
        movie_id: movieId, 
        text: myText, 
        score: parseInt(myScore) 
      });
      setMyText('');
      setMyScore('5');
      load(); // Recargar comentarios
    } catch {
      Alert.alert('Error', 'No se pudo agregar comentario');
    }
  };

  if (!movie) return <Text>Cargando...</Text>;

  // Asegurar que las imágenes carguen correctamente
  const coverUrl = movie.cover?.startsWith('http') 
    ? movie.cover 
    : `https://image.tmdb.org/t/p/w500${movie.cover}`;

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Image 
        source={{ uri: coverUrl }} 
        style={{ width: '100%', height: 200, marginBottom: 10 }} 
        resizeMode="contain"
      />
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