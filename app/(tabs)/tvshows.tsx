import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useScale } from '@/hooks/useScale';
import { MovieCarousel } from '@/components/MovieeCardList';
import trendingTvShows from '@/mocks/trendingTvShows.json';
import popularTvShows from '@/mocks/popularTvShows.json';

export default function ExploreScreen() {
  const styles = useTvShowsScreenStyles();
  const scale = useScale();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      // headerHeight={300 * scale}
      headerImage={
        <Image
          // source={require('@/assets/images/sample-image.jpg')}
          source={{uri: 'https://cdn.playbackonline.ca/wp/wp-content/uploads/2020/05/Screen-Shot-2020-05-04-at-1.41.10-PM.png'}}
          style={styles.reactLogo}
        />
      }
    >
      <MovieCarousel title="Trending TV Shows" movies={trendingTvShows.results} />
      <MovieCarousel title="Popular shows" movies={popularTvShows.results} />
    </ParallaxScrollView>
  );
}

const useTvShowsScreenStyles = function () {
  const scale = useScale();
  return StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
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
  });
};
