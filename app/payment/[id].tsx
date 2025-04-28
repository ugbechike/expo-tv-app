import { TVFocusGuideView, View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useScale } from "@/hooks/useScale";
import { useLocalSearchParams } from "expo-router";
import { useGetMovieDetails } from "@/hooks/api/useGetMovieDetails";
import { useState } from "react";
import QRCode from "react-native-qrcode-svg";

export default function Payment() {
  const styles = usePaymentStyles();
  const { id } = useLocalSearchParams();
  const [selectedPayment, setSelectedPayment] = useState<"card" | "crypto" | null>(null);
  const [focusValue, setFocusValue] = useState<string | null>(null);
  const scale = useScale();

  const { data: movieDetails } = useGetMovieDetails(Number(id));

  const getQRUrl = () => {
    if (selectedPayment === "card") {
      return "mytvapp.com/fiat";
    }
    return "mytvapp.com/crypto";
  };

  return (
    <TVFocusGuideView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: movieDetails?.poster_path }} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        <Text style={styles.title}>
          You are about to buy {movieDetails?.title} for $19.99
        </Text>

        <View style={styles.paymentSection}>
          <Text style={styles.subtitle}>Select payment method</Text>
          
          <View style={styles.buttonContainer}>
            <TVFocusGuideView
              onFocus={() => setFocusValue("card")}
              onBlur={() => setFocusValue(null)}
            >
              <Pressable
                style={[
                  styles.button,
                  focusValue === "card" && styles.buttonFocused,
                  selectedPayment === "card" && styles.buttonSelected,
                ]}
                onPress={() => setSelectedPayment("card")}
              >
                <Text style={[
                  styles.buttonText,
                  (focusValue === "card" || selectedPayment === "card") && styles.buttonTextFocused
                ]}>
                  Pay with card
                </Text>
              </Pressable>
            </TVFocusGuideView>

            <TVFocusGuideView
              onFocus={() => setFocusValue("crypto")}
              onBlur={() => setFocusValue(null)}
            >
              <Pressable
                style={[
                  styles.button,
                  focusValue === "crypto" && styles.buttonFocused,
                  selectedPayment === "crypto" && styles.buttonSelected,
                ]}
                onPress={() => setSelectedPayment("crypto")}
              >
                <Text style={[
                  styles.buttonText,
                  (focusValue === "crypto" || selectedPayment === "crypto") && styles.buttonTextFocused
                ]}>
                  Pay with crypto
                </Text>
              </Pressable>
            </TVFocusGuideView>
          </View>
        </View>

        {selectedPayment && (
          <View style={styles.qrSection}>
            <View style={styles.qrContainer}>
              <QRCode
                value={getQRUrl()}
                size={200 * scale}
                backgroundColor="transparent"
                color="white"
              />
            </View>
            {selectedPayment === "crypto" && (
              <Text style={styles.cryptoNote}>
                Note: We only accept USDC payments at this time.
              </Text>
            )}
          </View>
        )}
      </View>
    </TVFocusGuideView>
  );
}

const usePaymentStyles = function () {
  const scale = useScale();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#151718",
      padding: 40 * scale,
    },
    content: {
      flex: 1,
      alignItems: "center",
      gap: 32 * scale,
    },
    imageContainer: {
      width: 200 * scale,
      height: 300 * scale,
      borderRadius: 12 * scale,
      overflow: "hidden",
      marginTop: 40 * scale,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    title: {
      fontSize: 24 * scale,
      color: "white",
      fontWeight: "600",
      textAlign: "center",
    },
    subtitle: {
      fontSize: 20 * scale,
      color: "white",
      fontWeight: "500",
      marginBottom: 16 * scale,
    },
    paymentSection: {
      alignItems: "center",
      gap: 16 * scale,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: 16 * scale,
    },
    button: {
      paddingHorizontal: 32 * scale,
      paddingVertical: 16 * scale,
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: 8 * scale,
      minWidth: 200 * scale,
    },
    buttonFocused: {
      backgroundColor: "rgba(255,255,255,0.2)",
      transform: [{ scale: 1.04 }],
    },
    buttonSelected: {
      backgroundColor: "white",
    },
    buttonText: {
      color: "white",
      fontSize: 16 * scale,
      textAlign: "center",
      fontWeight: "500",
    },
    buttonTextFocused: {
      color: "#151718",
    },
    qrSection: {
      alignItems: "center",
      gap: 16 * scale,
    },
    qrContainer: {
      padding: 24 * scale,
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: 16 * scale,
    },
    cryptoNote: {
      color: "rgba(255,255,255,0.7)",
      fontSize: 14 * scale,
      textAlign: "center",
    },
  });
};
