// import { Image, Pressable, StyleSheet, Text } from 'react-native';

import { Image, Pressable, StyleSheet, Text, TVFocusGuideView } from 'react-native';
import { useMovieDetailsStore } from '@/store/movieDetailsSlice';
import { IMovie } from '@/types/movie';
import { router } from 'expo-router';
interface MovieCardProps extends IMovie {}
export const MovieCard = ({
  title,
  poster_path,
  release_date,
  overview,
  vote_average,
  vote_count,
  videoUrl,
  duration,
  pg_rating,
  genre,
  video_type,
  id,
}: MovieCardProps) => {
  const { setMovieDetails } = useMovieDetailsStore();
  const handleFocus = () => {
    setMovieDetails({
      title,
      poster_path,
      release_date,
      overview,
      vote_average,
      vote_count,
      videoUrl,
      duration,
      pg_rating,
      genre,
      video_type,
    });
  };
  return (
    <TVFocusGuideView
      // style={styles.card}
      onFocus={handleFocus}
    >
      <Pressable
        // onFocus={onFocus}
        style={({ focused }) => [styles.card, focused && styles.focused]}
        onPress={() => router.navigate(`/details/${id}`)}
      >
        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${poster_path}` }} style={styles.poster} />
        {/* <Text numberOfLines={1} style={styles.title}>{title}tttt</Text> */}
      </Pressable>
    </TVFocusGuideView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    marginHorizontal: 6,
    // marginVertical: 16,
    // borderWidth: 1,
    // borderColor: 'blue',
    height: 300,
    // height: '100%',
  },
  focused: {
    transform: [{ scale: 1.0 }],
    shadowColor: '#000',
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    borderColor: '#fff',
    borderWidth: 2,
    // height: 280
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
});
