import { useScale } from "@/hooks/useScale";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/authSlice";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TVFocusGuideView,
  Pressable,
  StyleSheet,
} from "react-native";

export default function Profile() {
  const [focusValue, setFocusValue] = useState<string | null>("");
  const router = useRouter();
  const styles = useProfileStyles();
  const user = useAuth((state) => state.user);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error);
    } else {
      router.push('/auth');
    }
  }

  return (
    <TVFocusGuideView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome {user?.email?.split('@')[0]}</Text>
        <TVFocusGuideView
          onFocus={() => setFocusValue("logout")}
          onBlur={() => setFocusValue(null)}
        >
          <Pressable
            style={[
              styles.logoutButton,
              focusValue === "logout" && {
                transform: [{ scale: 1.04 }],
              },
            ]}
            onPress={signOut}
          >
            <Text
              style={[
                styles.logoutButtonText,
              ]}
            >
              Logout
            </Text>
          </Pressable>
        </TVFocusGuideView>
        {/* <TVFocusGuideView
          onFocus={() => setFocusValue("back")}
          onBlur={() => setFocusValue(null)}
        >
          <Pressable
            style={[
              styles.backButton,
              focusValue === "back" && {
                transform: [{ scale: 1.04 }],
              },
            ]}
            onPress={() => router.back()}
          >
            <Text
              style={[
                styles.backButtonText,
              ]}
            >
              Back
            </Text>
          </Pressable>
        </TVFocusGuideView> */}
      </View>
    </TVFocusGuideView>
  );
}

const useProfileStyles = function () {
  const scale = useScale();
  return StyleSheet.create({
    container: {
      flex: 1,
      // height: 40,
      // width: '100%'
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      gap: 10 * scale,
    },
    title: {
      fontSize: 35 * scale,
      fontWeight: "bold",
      color: "white",
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    backButton: {
      backgroundColor: "white",
      borderRadius: 20,
      paddingHorizontal: 24 * scale,
      paddingVertical: 6 * scale,
    },
    logoutButton: {
      backgroundColor: "red",
      borderRadius: 20,
      paddingHorizontal: 24 * scale,
      paddingVertical: 6 * scale,
    },
    rentButton: {
      backgroundColor: "#151718",
      //   padding: 10,
      borderRadius: 20,
      paddingHorizontal: 24 * scale,
      paddingVertical: 6 * scale,
    },
    logoutButtonText: {
      color: "white",
      fontSize: 12 * scale,
      fontWeight: "bold",
      textAlign: "center",
    },
    backButtonText: {
      color: "black",
      fontSize: 12 * scale,
      fontWeight: "bold",
      textAlign: "center",
    },
    buttonContainer: {
      gap: 4 * scale,
      width: "18%",
    },
  });
};
