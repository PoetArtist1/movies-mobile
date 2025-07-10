import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import api from '../../api';

export default function MovieDetail() {
  const { movieId } = useLocalSearchParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [myText, setMyText] = useState('');
  const [myScore, setMyScore] = useState(0);  // ahora es número 0-10
  const [posting, setPosting] = useState(false);

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      const { data: m } = await api.get(`/movies/${movieId}`);
      setMovie(m);
      const { data: c } = await api.get(`/comments/movie/${movieId}`);
      setComments(c);
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) loadData();
  }, [movieId]);

  const postComment = async () => {
    if (!myText.trim()) {
      Alert.alert('Error', 'Escribe un comentario');
      return;
    }
    if (myScore < 1 || myScore > 10) {
      Alert.alert('Error', 'Selecciona un puntaje entre 1 y 10 estrellas');
      return;
    }
    setPosting(true);
    try {
      await api.post('/comments', {
        movie_id: movieId,
        text: myText,
        score: myScore,
      });
      setMyText('');
      setMyScore(0);
      const { data: c } = await api.get(`/comments/movie/${movieId}`);
      setComments(c);
    } catch {
      Alert.alert('Error', 'No se pudo agregar comentario');
    } finally {
      setPosting(false);
    }
  };

  // calcula promedio
  const userScoreAvg = comments.length
    ? (comments.reduce((sum, cm) => sum + cm.score, 0) / comments.length).toFixed(1)
    : '—';

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando detalles...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <Button title="Reintentar" onPress={loadData} />
      </View>
    );
  }
  if (!movie) {
    return (
      <View style={styles.center}>
        <Text>No se encontró la película</Text>
      </View>
    );
  }

  const coverUrl = movie.cover?.startsWith('http')
    ? movie.cover
    : `https://image.tmdb.org/t/p/w500${movie.cover}`;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        keyboardShouldPersistTaps="always"
        style={styles.list}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ListHeaderComponent={() => (
          <View>
            <Image source={{ uri: coverUrl }} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{movie.title}</Text>
            <Text>⭐ {movie.tmdb_score}/10 (TMDb)</Text>
            <Text style={styles.subtitle}>
              ⭐ {userScoreAvg}/10 ({comments.length} comentarios)
            </Text>
            <Text style={{ marginVertical: 10 }}>{movie.synopsis}</Text>
            <Text>
              Fecha de salida:{' '}
              {new Date(movie.release_date).toISOString().slice(0, 10).replace(/-/g, '/')}
            </Text>
            <Text style={styles.sectionTitle}>Comentarios:</Text>
            {comments.length === 0 && <Text>No hay comentarios aún</Text>}
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.commentBox}>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>{item.username}</Text> ({item.role}):{' '}
              {item.score}/10
            </Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.sectionTitle}>Tu valoración:</Text>
        <View style={styles.starsRow}>
          {Array.from({ length: 10 }).map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setMyScore(i + 1)}>
              <Text style={[styles.star, i < myScore ? styles.starFilled : styles.starEmpty]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.scoreHint}>
          {myScore > 0 ? `${myScore} de 10 estrellas` : 'Toca una estrella para puntuar'}
        </Text>

        <TextInput
          placeholder="Tu comentario"
          value={myText}
          onChangeText={setMyText}
          style={styles.input}
        />
        {posting ? (
          <ActivityIndicator />
        ) : (
          <Button title="Agregar comentario" onPress={postComment} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 300, marginVertical: 10 },
  title: { fontSize: 24, marginBottom: 5 },
  subtitle: { fontSize: 16, marginBottom: 10, color: '#555' },
  sectionTitle: { fontSize: 18, marginVertical: 10 },
  commentBox: { borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 10 },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  starsRow: { flexDirection: 'row', marginVertical: 5 },
  star: { fontSize: 28, marginHorizontal: 2 },
  starFilled: { color: 'gold' },
  starEmpty: { color: '#ccc' },
  scoreHint: { marginBottom: 10, color: '#555' },
  input: { borderWidth: 1, padding: 8, marginBottom: 10 },
});
