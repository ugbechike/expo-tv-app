import { View, Text, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { MovieCard } from './MovieCard';

export const MovieCarousel = ({ title, movies }: {
  title: string;
  movies: { id: number; title?: string; poster_path: string }[];
}) => {
  return (

    <View style={{ paddingTop: 8 }}>
      <Text style={styles.heading}>{title}</Text>
      <FlashList
        horizontal
        estimatedItemSize={150}
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MovieCard
            title={item?.title ?? ''}
            posterUri={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 16,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
});
 