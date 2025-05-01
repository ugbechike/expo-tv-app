// app/player/[id].tsx
import { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  TVRemoteEvent,
  useTVEventHandler,
  Pressable,
  Text,
  TVFocusGuideView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetMovieDetails } from "@/hooks/api/useGetMovieDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VideoView, useVideoPlayer } from "expo-video";
import { HWEvent } from "react-native";

export default function Player() {
  const { id } = useLocalSearchParams();
  const movieId = Number(id);
  const router = useRouter();
  const { data: movieDetails } = useGetMovieDetails(movieId);
  const [isLoading, setIsLoading] = useState(true);
  const [lastPosition, setLastPosition] = useState(0);
  const styles = usePlayerStyles();

  // Video source setup
  const videoSource = movieDetails?.videoUrl || "";

  // Initialize video player
  //   const player = useVideoPlayer(videoSource, (player) => {
  //     player.loop = false; // We typically don't want movies to loop
  //   });

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
  });

  // Handle TV remote control events using event listeners
  useTVEventHandler((evt) => {
    if (evt && evt.eventType === "select") {
      if (player.playing) {
        player.pause();
        savePlaybackPosition();
      } else {
        player.play();
      }
    }
    if (evt && evt.eventType === "menu") {
      savePlaybackPosition();
      router.back();
    }
  });

  // Load the last saved position when the component mounts
  useEffect(() => {
    const loadLastPosition = async () => {
      try {
        const savedPosition = await AsyncStorage.getItem(
          `movie_position_${movieId}`
        );
        if (savedPosition) {
          setLastPosition(parseFloat(savedPosition));
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load playback position:", error);
        setIsLoading(false);
      }
    };

    loadLastPosition();
  }, [movieId]);

  // Set the player to the last saved position once loaded
  useEffect(() => {
    if (!isLoading && lastPosition > 0 && player) {
      // Check if player has the currentTime setter
      if (typeof player.currentTime === "number") {
        player.currentTime = lastPosition;
      }
    }
  }, [isLoading, lastPosition, player]);

  // Save the current playback position
  const savePlaybackPosition = async () => {
    if (
      player &&
      typeof player.currentTime === "number" &&
      player.currentTime > 0
    ) {
      try {
        await AsyncStorage.setItem(
          `movie_position_${movieId}`,
          player.currentTime.toString()
        );
      } catch (error) {
        console.error("Failed to save playback position:", error);
      }
    }
  };

  // Periodically save the playback position
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (player && player.playing) {
        savePlaybackPosition();
      }
    }, 10000); // Save every 10 seconds

    return () => {
      clearInterval(saveInterval);
      savePlaybackPosition(); // Save when unmounting
    };
  }, [player]);

  // Handle back navigation and clean up
  useEffect(() => {
    return () => {
      savePlaybackPosition();
    };
  }, []);

  // VideoView event handlers
  const handleVideoReady = () => {
    // Set initial position when video is ready
    if (lastPosition > 0 && player) {
      if (typeof player.currentTime === "number") {
        player.currentTime = lastPosition;
      }
    }
    player.play();
  };

  //   const handleVideoError = (error) => {
  //     console.error("Video playback error:", error);
  //   };

  if (isLoading || !movieDetails) {
    return (
      <View style={styles.container}>
        {/* You could add a loading indicator here */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.videoPlayer}
        player={player}
        // @ts-ignore
        statusChange={({ status }) => {
          console.log("status", status);
          if (status === "readyToPlay" && lastPosition > 0 && player) {
            player.currentTime = lastPosition;
            player.play();
          }
        }}
        // @ts-ignore
        playToEnd={() => {
          AsyncStorage.removeItem(`movie_position_${movieId}`);
        }}
      />
    </View>
  );
}

const usePlayerStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
      position: "relative",
    },
    videoPlayer: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    backButton: {
        height: 40,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        paddingHorizontal: 16,
      },
      buttonText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "black",
      },
      focused: {
        backgroundColor: "white",
        color: "black",
        transform: [{ scale: 1.05 }],
      },
  });
};
