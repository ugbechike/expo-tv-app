import {
  DarkTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Colors } from "@/constants/Colors";
import useAuthEvent from "@/hooks/api/useAuthEvent";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
    card: "#121212",
    border: "#1E1E1E",
    primary: Colors.dark.tint,
    text: Colors.dark.text,
  },
};

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useAuthEvent();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      if (error) {
        console.warn(`Error in loading fonts: ${error}`);
      }
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={CustomDarkTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth/index" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="details/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="payment/[id]" options={{ headerShown: false }} />
        </Stack>

      </ThemeProvider>
    </QueryClientProvider>
  );
}
