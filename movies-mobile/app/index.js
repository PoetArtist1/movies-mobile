import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../api';

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('tmdb_score');
  const router = useRouter();

  const fetchMovies = async () => {
  const { data } = await api.get('/movies', {
    params: { search, sortBy, order: 'DESC' }
  });

  if (data.length === 0 && search.trim() !== '') {
    try {
      // Llama a TMDb para intentar traerla por su nombre (primera coincidencia)
      const tmdbSearch = await api.get(
        `https://api.themoviedb.org/3/search/movie`,
        {
          params: {
            api_key: '39138b8c198824b1f6de24334e4a3cc1',
            query: search
          }
        }
      );

      if (tmdbSearch.data.results.length > 0) {
        const movie = tmdbSearch.data.results[0];
        // Llama al backend para guardar en tu base
        await api.post(`/movies/fetch/${movie.id}`);
        // Recarga la lista
        fetchMovies();
        return;
      }
    } catch (err) {
      console.error('Error buscando en TMDb:', err.message);
    }
  }

  setMovies(data);
};


  useEffect(() => { fetchMovies(); }, []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        placeholder="Buscar título..."
        value={search}
        onChangeText={setSearch}
        style={{ marginBottom: 10 }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <Button title="Por Puntuación" onPress={() => setSortBy('tmdb_score')} />
        <Button title="Por Fecha" onPress={() => setSortBy('release_date')} />
      </View>
      <Button title="Buscar" onPress={fetchMovies} />
      <FlatList
        data={movies}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/movies/${item.id}`)}
            style={{ paddingVertical: 8 }}
          >
            <Text style={{ fontSize: 18 }}>
              {item.title} ({item.tmdb_score})
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
