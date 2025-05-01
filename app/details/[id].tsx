import { useScale } from "@/hooks/useScale";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetMovieDetails } from "@/hooks/api/useGetMovieDetails";
import {
  InteractionManager,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TVFocusGuideView,
  View,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { formatDate } from "@/utils/dateFormat";
import { LinearGradient } from "expo-linear-gradient";

export default function Details() {
  const { id } = useLocalSearchParams();
  const styles = useDetailsStyles();
  const { data: movieDetails } = useGetMovieDetails(Number(id));
  const videoSource = movieDetails?.videoUrl!;
  const isFocused = useIsFocused();
  const releaseYear = formatDate(movieDetails?.release_date as string);
  const scale = useScale();
  const [focusValue, setFocusValue] = useState<string | null>("buy");
  const router = useRouter();


  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
    player.muted = true;
  });

  const handleRentAndPause = (intent: string) => {
 
    router.push({
      pathname: '/payment/[id]',
      params: {
        id: id as string,
        intent: intent,
      },
    });


  }


  return (
    <TVFocusGuideView style={styles.container}>
      <View style={styles.videoContainer}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="cover"
        />
        {/* Vertical gradient for top and bottom fade */}
        <LinearGradient
          colors={[
            'rgba(0,0,0,0.98)',
            'rgba(0,0,0,0.2)',
            'rgba(0,0,0,0.1)',
            'rgba(0,0,0,0.2)',
            'rgba(0,0,0,0.85)',
            'rgba(0,0,0,0.98)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        />
        <View style={[styles.contentContainer, { zIndex: 2 }]}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{movieDetails?.title}</Text>
          </View>
          <View style={styles.descriptionContainer}>
            <View style={styles.buttonContainer}>
              <TVFocusGuideView
                onFocus={() => setFocusValue("buy")}
                onBlur={() => setFocusValue(null)}
              >
                <Pressable
                  style={[
                    styles.buyButton,
                    focusValue === "buy" && {
                      transform: [{ scale: 1.04 }],
                      backgroundColor: "white",
                    },
                  ]}
                  onPress={() => handleRentAndPause('buy')}
                >
                  <Text
                    style={[
                      styles.buyButtonText,
                      focusValue === "buy" && { color: "#151718" },
                    ]}
                  >
                    Buy ${movieDetails?.buyPrice}
                  </Text>
                </Pressable>
              </TVFocusGuideView>
              <TVFocusGuideView
                onFocus={() => setFocusValue("rent")}
                onBlur={() => setFocusValue(null)}
              >
                <Pressable
                  style={[
                    styles.rentButton,
                    focusValue === "rent" && {
                      transform: [{ scale: 1.04 }],
                      backgroundColor: "white",
                    },
                  ]}
                  onPress={() => handleRentAndPause('rent')}
                >
                  <Text
                    style={[
                      styles.rentButtonText,
                      focusValue === "rent" && { color: "#151718" },
                    ]}
                  >
                    Rent ${movieDetails?.rentPrice}
                  </Text>
                </Pressable>
              </TVFocusGuideView>
            </View>
            <View style={styles.overviewContainer}>
              <View
                style={{
                  flex: 1,
                  marginBottom: 16 * scale,
                }}
              >
                <Text style={styles.description}>{movieDetails?.overview}dddd</Text>
              </View>

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
                  <Text style={styles.movieInfo}>
                    {movieDetails?.genre?.[0]}
                  </Text>
                </View>
                <View>
                  <Text style={styles.movieInfo}>{movieDetails?.duration}</Text>
                </View>
                <View style={styles.roundedText}>
                  <Text style={styles.movieInfo}>
                    {movieDetails?.video_type}
                  </Text>
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
            </View>
          </View>
        </View>
      </View>
    </TVFocusGuideView>
  );
}

const useDetailsStyles = function () {
  const scale = useScale();
  const isIos = Platform.OS === 'ios' && !Platform.isTV;
  return StyleSheet.create({
    container: {
      flex: 1,
      // height: 40,
      // width: '100%'
    },
    video: {
      width: "100%",
      height: "100%",
    },
    videoContainer: {
      // borderWidth: 1,
      // borderColor: 'red',
      height: "100%",
      width: "100%",
      position: "relative",
    },
    title: {
      fontSize: 35 * scale,
      fontWeight: "bold",
      color: "white",
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    backButton: {
      height: 40,
      width: 40,
      backgroundColor: "red",
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    contentContainer: {
      position: "absolute",
      top: isIos ? 40 * scale : 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    titleContainer: {
      flex: 2,
      paddingHorizontal: 16,
    },
    descriptionContainer: {
      flex: isIos ? 1.5 : 0.5,
      flexDirection: isIos ? "column" : "row",
      gap: 16 * scale,
    //   backgroundColor: "rgba(0,0,0,0.85)",
      paddingHorizontal: 16,
      paddingVertical: 16 * scale,
    },
    description: {
      color: "white",
      fontSize: 14 * scale,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    buyButton: {
      backgroundColor: "#151718",
      borderRadius: 20,
      paddingHorizontal: 24 * scale,
      paddingVertical: isIos ? 10 * scale : 6 * scale,
    },
    rentButton: {
      backgroundColor: "#151718",
      //   padding: 10,
      borderRadius: 20,
      paddingHorizontal: 24 * scale,
      paddingVertical: isIos ? 10 * scale : 6 * scale,
    },
    buyButtonText: {
      color: "white",
      fontSize: isIos ? 14 * scale : 10 * scale,
      fontWeight: "bold",
      textAlign: "center",
    },
    rentButtonText: {
      color: "white",
      fontSize: isIos ? 14 * scale : 10 * scale,
      fontWeight: "bold",
      textAlign: "center",
    },
    buttonContainer: {
      gap: 4 * scale,
      width: isIos ? "100%" : "18%",
    },
    overviewContainer: {
      width: isIos ? "100%" : "50%",
      flex: 0.5,
    },
    movieInfo: {
      color: "white",
      fontSize: 10 * scale,
    },
    roundedText: {
      borderWidth: 1,
      borderColor: "gray",
      paddingHorizontal: 4 * scale,
      borderRadius: 4 * scale,
      backgroundColor: "#343434",
    },
  });
};
