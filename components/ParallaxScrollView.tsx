import { useState, type PropsWithChildren, type ReactElement } from 'react';
import { StyleSheet, useColorScheme, Text, View } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedView } from '@/components/ThemedView';
import { useScale } from '@/hooks/useScale';
import { Colors } from '@/constants/Colors';

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  headerLeftContent?: ReactElement;
  headerRightContent?: ReactElement;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  headerLeftContent,
  headerRightContent,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scale = useScale();
  const styles = useParallaxScrollViewStyles();

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[styles.header, { backgroundColor: headerBackgroundColor["dark"] }]}>
        {headerImage}
        
        <View style={styles.headerContent}>
          {/* Left section for text and buttons */}
          <View style={styles.leftSection}>
            <LinearGradient
                colors={[
                  '#151718',
                  'rgba(21,23,24,1)',
                  '#151718',
                  'rgba(0,0,0,0)',
                ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.leftGradient}
            />
            {headerLeftContent}
          </View>

          {/* Right section for video/preview */}
          <View style={styles.rightSection}>
            {headerRightContent}
          </View>
        </View>

        {/* Bottom blend gradient */}
        <LinearGradient
          colors={[
            'rgba(0,0,0,0)',
            '#151718',
            'rgba(21,23,24,0.9)',
            '#151718'
          ]}
          start={{ x: 0.4, y: 0}}
          end={{ x: 0.4, y: 1 }}
          locations={[0, 0.9, 0.5, 1]}
          style={styles.headerOverlay}
        />
      </Animated.View>
      <Animated.ScrollView 
        ref={scrollRef} 
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
      
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const useParallaxScrollViewStyles = function () {
  const scale = useScale();
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: 350 * scale,
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      overflow: 'hidden',
    },
    headerContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      height: '100%'
    },
    leftSection: {
      flex: 1,
      position: 'relative',
    },
    rightSection: {
      flex: 1,
    },
    leftGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    scrollView: {
      flex: 1,
      marginTop: 300 * scale,
    },
    content: {
      flex: 1,
      backgroundColor: Colors.dark.background,
      paddingBottom: 20
    },
  });
};
