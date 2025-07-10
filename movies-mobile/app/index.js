import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useNavigation } from 'expo-router';
import api from '../api';

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('tmdb_score');
  const router = useRouter();
  const navigation = useNavigation();

  const fetchMovies = useCallback(async () => {
    try {
      const { data } = await api.get('/movies', {
        params: { search, sortBy, order: 'DESC' },
      });

      if (data.length === 0 && search.trim() !== '') {
        const tmdbSearch = await api.get(
          `https://api.themoviedb.org/3/search/movie`,
          {
            params: {
              api_key: '39138b8c198824b1f6de24334e4a3cc1',
              query: search,
            },
          }
        );

        if (tmdbSearch.data.results.length > 0) {
          const movie = tmdbSearch.data.results[0];
          await api.post(`/movies/fetch/${movie.id}`);
          fetchMovies();
          return;
        }
      }

      setMovies(data);
    } catch (err) {
      console.error('Error fetching movies:', err.message);
    }
  }, [search, sortBy]);

  useEffect(() => {
    fetchMovies();
  }, [sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, sortBy]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchMovies);
    return unsubscribe;
  }, [fetchMovies]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          onPress={() => {
            global.token = null;
            global.user = null;
            router.replace('/auth/login');
          }}
          style={{ color: 'red', marginRight: 10 }}
        >
          Cerrar sesión
        </Text>
      ),
    });
  }, [navigation]);

  const renderHeader = () => (
    <View style={[styles.row, styles.header]}>
      <Text style={[styles.cell, styles.imageCell]}>📷</Text>
      <Text style={[styles.cell, styles.titleCell]}>Título</Text>
      <Text style={[styles.cell, styles.scoreCell]}>⭐</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const imageUrl = item.cover?.startsWith('http')
      ? item.cover
      : `https://image.tmdb.org/t/p/w500${item.cover}`;

    return (
      <TouchableOpacity onPress={() => router.push(`/movies/${item.id}`)}>
        <View style={styles.row}>
          <View style={[styles.cell, styles.imageCell]}>
            <Image
              source={{ uri: imageUrl }}
              style={{ width: 50, height: 75, borderRadius: 4 }}
              resizeMode="cover"
            />
          </View>
          <Text style={[styles.cell, styles.titleCell]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.cell, styles.scoreCell]}>{item.tmdb_score}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        placeholder="Buscar título..."
        value={search}
        onChangeText={setSearch}
        style={{ marginBottom: 10, padding: 8, borderWidth: 1, borderRadius: 4 }}
      />
      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginBottom: 10 }}>
        <Picker
          selectedValue={sortBy}
          onValueChange={(value) => setSortBy(value)}
          style={{
            height: Platform.OS === 'ios' ? 180 : 55,
            width: '100%',
            justifyContent: 'center',
          }}
          itemStyle={{ fontSize: 16 }}
        >
          <Picker.Item label="Ordenar por Puntuación" value="tmdb_score" />
          <Picker.Item label="Ordenar por Fecha" value="release_date" />
        </Picker>
      </View>

      {renderHeader()}

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  header: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#eee',
  },
  cell: {
    paddingHorizontal: 8,
    fontSize: 16,
  },
  imageCell: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleCell: {
    flex: 1,
  },
  scoreCell: {
    width: 60,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});
