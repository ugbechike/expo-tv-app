import { View, Text, StyleSheet, TVFocusGuideView, Pressable, findNodeHandle, Platform, SafeAreaView, Animated } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Tab } from "@/components/Tab";
import { useGetUser } from "@/hooks/api/useGetUser";
import { useScale } from "@/hooks/useScale";
import { MovieCard } from "@/components/MovieCard";
import { LargeMovieCard } from "@/components/LargeMovieCard";

const tabs = [
  {
    id: "rent",
    title: "Rent",
  },
  {
    id: "purchase",
    title: "Purchase",
  },
]

export default function Collections() {
  const { intent } = useLocalSearchParams();
  const styles = useCollectionsStyles();
  const [activeTab, setActiveTab] = useState(intent as string || "rent");
  const { data: userData } = useGetUser();
  
  const rentTabRef = useRef<View>(null);
  const purchaseTabRef = useRef<View>(null);
  const contentRef = useRef<View>(null);
  const firstRentItemRef = useRef<View>(null);
  const firstPurchaseItemRef = useRef<View>(null);


  if (Platform.OS === 'ios' && !Platform.isTV) {
    return (
      <SafeAreaView style={{
        flex: 1,
        width: "100%",
      }}>
        <Tab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        />

        {/* Content Area */}
      <View ref={contentRef} style={styles.contentContainer}>
        {/* Rented Movies Content */}
        {activeTab === "rent" && (
          <View style={styles.movieSectionContainer}>
            {/* No movies rented */}
            {(!userData?.rentedMovies || userData.rentedMovies.length === 0) ? (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataTitle}>
                  You do not have any rented movies
                </Text>
                <Text style={styles.noDataDescription}>
                  Your Rented Movies will display here
                </Text>
              </View>
            ) : (
              /* Movies rented list */
              <Animated.ScrollView
            //   ref={scrollRef}
              scrollEventThrottle={16} 
              style={styles.movieListContainer}
              >
                {userData.rentedMovies.map((movie, index) => (
                  <Pressable
                    key={movie.id}
                    ref={index === 0 ? firstRentItemRef : null}
                    style={({focused}) => [
                      styles.movieCardWrapper,
                      focused && styles.focused
                    ]}
                    accessible={true}
                    accessibilityRole="button"
                    nextFocusRight={findNodeHandle(firstPurchaseItemRef.current)}
                    nextFocusUp={findNodeHandle(rentTabRef.current)}
                    onPress={() => router.navigate(`/player/${movie.id}`)}
                  >
                    <LargeMovieCard {...movie} />
                  </Pressable>
                ))}
              </Animated.ScrollView>
            )}
          </View>
        )}

        {/* Purchased Movies Content */}
        {activeTab === "purchase" && (
          <View style={styles.movieSectionContainer}>
            {/* No movies purchased */}
            {(!userData?.purchasedMovies || userData.purchasedMovies.length === 0) ? (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataTitle}>
                  You do not have any purchased movies
                </Text>
                <Text style={styles.noDataDescription}>
                  Your Purchased Movies will display here
                </Text>
              </View>
            ) : (
              /* Purchased movies list */
              <View style={styles.movieListContainer}>
                {userData.purchasedMovies.map((movie, index) => (
                  <Pressable
                    key={movie.id}
                    ref={index === 0 ? firstPurchaseItemRef : null}
                    style={({focused}) => [
                      styles.movieCardWrapper,
                      focused && styles.focused
                    ]}
                    accessible={true}
                    accessibilityRole="button"
                    nextFocusUp={findNodeHandle(purchaseTabRef.current)}
                    onPress={() => router.navigate(`/player/${movie.id}`)}
                  >
                    <MovieCard {...movie} />
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
        
      </SafeAreaView>
    )
  }
  
  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          ref={rentTabRef}
          style={[styles.tabButton, activeTab === "rent" && styles.activeTab]}
          onPress={() => setActiveTab("rent")}
          onFocus={() => setActiveTab("rent")}
          hasTVPreferredFocus={true}
          accessible={true}
          accessibilityRole="button"
          nextFocusRight={findNodeHandle(firstRentItemRef.current)}
        >
          <Text style={[styles.tabText, activeTab === "rent" && styles.activeTabText]}>
            Rent
          </Text>
        </Pressable>
        
        <Pressable
          ref={purchaseTabRef}
          style={[styles.tabButton, activeTab === "purchase" && styles.activeTab]}
          onPress={() => setActiveTab("purchase")}
          onFocus={() => setActiveTab("purchase")}
          accessible={true}
          accessibilityRole="button"
          nextFocusRight={findNodeHandle(firstPurchaseItemRef.current)}
        >
          <Text style={[styles.tabText, activeTab === "purchase" && styles.activeTabText]}>
            Purchase
          </Text>
        </Pressable>
      </View>

      {/* Content Area */}
      <View ref={contentRef} style={styles.contentContainer}>
        {/* Rented Movies Content */}
        {activeTab === "rent" && (
          <View style={styles.movieSectionContainer}>
            {/* No movies rented */}
            {(!userData?.rentedMovies || userData.rentedMovies.length === 0) ? (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataTitle}>
                  You do not have any rented movies
                </Text>
                <Text style={styles.noDataDescription}>
                  Your Rented Movies will display here
                </Text>
              </View>
            ) : (
              /* Movies rented list */
              <View style={styles.movieListContainer}>
                {userData.rentedMovies.map((movie, index) => (
                  <Pressable
                    key={movie.id}
                    ref={index === 0 ? firstRentItemRef : null}
                    style={({focused}) => [
                      styles.movieCardWrapper,
                      focused && styles.focused
                    ]}
                    accessible={true}
                    accessibilityRole="button"
                    nextFocusRight={findNodeHandle(firstPurchaseItemRef.current)}
                    nextFocusUp={findNodeHandle(rentTabRef.current)}
                    onPress={() => router.navigate(`/player/${movie.id}`)}
                  >
                    <LargeMovieCard {...movie} />
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Purchased Movies Content */}
        {activeTab === "purchase" && (
          <View style={styles.movieSectionContainer}>
            {/* No movies purchased */}
            {(!userData?.purchasedMovies || userData.purchasedMovies.length === 0) ? (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataTitle}>
                  You do not have any purchased movies
                </Text>
                <Text style={styles.noDataDescription}>
                  Your Purchased Movies will display here
                </Text>
              </View>
            ) : (
              /* Purchased movies list */
              <View style={styles.movieListContainer}>
                {userData.purchasedMovies.map((movie, index) => (
                  <Pressable
                    key={movie.id}
                    ref={index === 0 ? firstPurchaseItemRef : null}
                    style={({focused}) => [
                      styles.movieCardWrapper,
                      focused && styles.focused
                    ]}
                    accessible={true}
                    accessibilityRole="button"
                    nextFocusUp={findNodeHandle(purchaseTabRef.current)}
                    onPress={() => router.navigate(`/player/${movie.id}`)}
                  >
                    <MovieCard {...movie} />
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const useCollectionsStyles = function () {
  const scale = useScale();

  return StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 50 * scale,
      flexDirection: "row",
    },
    tabContainer: {
      width: 200 * scale,
      marginRight: 20 * scale,
      paddingLeft: 20 * scale,
      flexDirection: "column",
    },
    tabButton: {
      padding: 15 * scale,
      marginBottom: 10 * scale,
      borderRadius: 8 * scale,
    },
    activeTab: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    tabText: {
      color: "rgba(255, 255, 255, 0.7)",
      fontSize: 18 * scale,
      fontWeight: "500",
    },
    activeTabText: {
      color: "white",
      fontWeight: "700",
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20 * scale,
    },
    movieSectionContainer: {
      flex: 1,
    },
    noDataContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    noDataTitle: {
      fontSize: 26 * scale,
      fontWeight: "600",
      color: "white",
      marginBottom: 10 * scale,
    },
    noDataDescription: {
      fontSize: 16 * scale,
      color: "rgba(255, 255, 255, 0.7)",
    },
    movieListContainer: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      paddingTop: 20 * scale,
    },
    movieCardWrapper: {
      margin: 10 * scale,
    },
    focused: {
      transform: [{ scale: 1.1 }],
      shadowColor: '#fff',
      shadowOpacity: 0.5,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 10,
    },
  });
};