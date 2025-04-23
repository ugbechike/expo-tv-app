import { Image, StyleSheet, Platform, View, Text } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useScale } from "@/hooks/useScale";
import { MovieCarousel } from "@/components/MovieeCardList";
import topRatedMovies from "@/mocks/topRatedMovies.json";
import upcomingMovies from "@/mocks/upcomingMovies.json";
import popularMovies from "@/mocks/popularMovies.json";
import nowPlayingMovies from "@/mocks/nowPlaying.json";
import trendingMovies from "@/mocks/trendingMovies.json";
import { useMovieDetailsStore } from "@/store/movieDetailsSlice";
import { formatDate } from "@/utils/dateFormat";
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const styles = useHomeScreenStyles();
  const scale = useScale();
  const { movieDetails } = useMovieDetailsStore();
  const releaseYear = formatDate(movieDetails?.release_date as string);
  const videoSource = movieDetails?.videoUrl!;
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
    
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#151718" }}
      // // headerHeight={300 * scale}
      headerLeftContent={
        <View style={{ gap: 8 * scale, paddingLeft: 16 }}>
          <Text style={styles.headerTitle}>{movieDetails?.title}</Text>
          <View
            style={{
              flexDirection: "row",
              gap: 8 * scale,
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.movieInfo}>{releaseYear}</Text>
            </View>
            <View>
              <Text style={[styles.movieInfo, { color: "gray" }]}>•</Text>
            </View>
            <View>
              <Text style={styles.movieInfo}>{movieDetails?.genre?.[0]}</Text>
            </View>
            <View>
              <Text style={styles.movieInfo}>{movieDetails?.duration}</Text>
            </View>
            <View style={styles.roundedText}>
              <Text style={styles.movieInfo}>{movieDetails?.video_type}</Text>
            </View>
            <View style={styles.roundedText}>
              <Text style={styles.movieInfo}>
                {movieDetails?.vote_average}
              </Text>
            </View>
            <View style={styles.roundedText}>
              <Text style={styles.movieInfo}>
                PG-{movieDetails?.pg_rating}
              </Text>
            </View>
          </View>
          <View style={{ marginBottom: 8 * scale }}>
            <Text style={styles.overview}>{movieDetails?.overview}</Text>
          </View>

          <View style={{flexDirection: 'row', gap: 8 * scale}}>
            <Text style={styles.genre}>
              {movieDetails?.genre?.join(' • ')}
            </Text>
          </View>
        </View>
      }
      headerRightContent={
        <View style={{
          position: 'relative',
        }}>
          <LinearGradient
            colors={[
              '#151718',
              'rgba(21,23,24,0.8)',
              'rgba(21,23,24,0.4)',
              '#151718',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              // width: 10,
              zIndex: 1,
            }}
          />
          <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture contentFit="cover" />
        </View>
      }
    >
      <MovieCarousel title="Trending" movies={trendingMovies.results} />
      <MovieCarousel title="Now playing" movies={nowPlayingMovies.results} />
      <MovieCarousel title="Top Rated" movies={topRatedMovies.results} />
      <MovieCarousel title="Upcoming" movies={upcomingMovies.results} />
      <MovieCarousel title="Popular" movies={popularMovies.results} />
    </ParallaxScrollView>
  );
}

const useHomeScreenStyles = function () {
  const scale = useScale();
  return StyleSheet.create({
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8 * scale,
    },
    stepContainer: {
      gap: 8 * scale,
      marginBottom: 8 * scale,
    },
    reactLogo: {
      height: "100%",
      width: "100%",
    },
    headerTitle: {
      color: "white",
      fontSize: 26 * scale,
      fontWeight: "bold",
    },
    movieInfo: {
      color: "white",
      fontSize: 10 * scale,
    },
    genre: {
      color: "white",
      fontSize: 12 * scale,
      fontWeight: "bold",
    },
    roundedText: {
      borderWidth: 1,
      borderColor: "gray",
      paddingHorizontal: 4 * scale,
      borderRadius: 4 * scale,
      backgroundColor: "#343434",
    },
    overview: {
      color: "#F9F6EE",
      fontSize: 14 * scale,
      lineHeight: 20 * scale,
    },
    video: {
      width: '100%',
      height: "100%",
    },
    leftGradient: {
      position: 'absolute',
      top: 10,
      left: 0,
      right: 10,
      bottom: 0,
      borderWidth: 1,
      borderColor: "red",
    },
  });
};
