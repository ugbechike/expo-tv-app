import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";
import QRCode from "react-native-qrcode-svg";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TVFocusGuideView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useScale } from "@/hooks/useScale";
import { router, useLocalSearchParams } from "expo-router";
import { Tab } from "@/components/Tab";
import { usePayment } from "@/hooks/api/usePayment";
import { useGetMovieDetails } from "@/hooks/api/useGetMovieDetails";

const tabs = [
  { id: "fiat", title: "Pay with Card" },
  { id: "crypto", title: "Pay with Crypto" },
];

export default function Payment() {
  const [activeTab, setActiveTab] = useState("fiat");
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const styles = usePaymentStyles();
  const { id } = useLocalSearchParams();
  const { data: payment } = usePayment();
  const { data: movieDetails } = useGetMovieDetails(Number(id));

  console.log('======',{payment});

  const qrData = JSON.stringify({
    type: "payment",
    url: "myapp.com/t2",
    code: 12344,
  });

  return (
    <ImageBackground
      source={{
        uri: `https://image.tmdb.org/t/p/w500${movieDetails?.poster_path}`,
      }}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.headerText}>Choose a payment method</Text>

            <Tab
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={tabs}
            />

            <View style={styles.mainContent}>
              {activeTab === "fiat" ? (
                <View style={styles.fiatContent}>
                  <View style={styles.rightSection}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>1</Text>
                    </View>

                    <View style={styles.qrContainer}>
                      <Text style={styles.stepText}>
                        Use your phone or tablet's camera and point to this
                        code, or go to myapp.com/t2
                      </Text>
                      <QRCode
                        value={qrData}
                        size={350}
                        backgroundColor="transparent"
                        color="white"
                      />
                    </View>
                  </View>
                  {/* Here should be in between with OR */}
                  <View style={styles.orContainer}>
                    <Text style={styles.orText}>OR</Text>
                  </View>
                  <View style={styles.leftSection}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>2</Text>
                    </View>
                    <View>
                      <Text style={styles.stepText}>
                        Stripe card payment will go here...
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.remoteContent}>
                  <View style={styles.qrContainer}>
                    <Text style={styles.stepText}>
                      Pay with Crypto, use your wallet to pay. Scan the QR code
                      to continue purchase.
                    </Text>
                    <QRCode
                      value={qrData}
                      size={350}
                      backgroundColor="transparent"
                      color="white"
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const usePaymentStyles = () => {
  const scale = useScale();
  return StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    gradient: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: 40,
      paddingVertical: 40,
    },
    content: {
      flex: 1,
      width: "100%",
      gap: 20,
    },
    headerText: {
      fontSize: 42,
      fontWeight: "bold",
      color: "white",
      // marginBottom: 40,
      textAlign: "center",
    },
    mainContent: {
      flex: 1,
      width: "100%",
    },
    fiatContent: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    stepNumber: {
      backgroundColor: "rgba(255,255,255,0.6)",
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      width: 20 * scale,
      height: 20 * scale,
    },
    stepNumberText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
    leftSection: {
      flex: 1,
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "center",
      gap: 20,
    },
    rightSection: {
      flex: 1,
      alignItems: "baseline",
      flexDirection: "row",
      justifyContent: "center",
    },
    stepText: {
      color: "white",
      fontSize: 24,
      marginBottom: 30,
      maxWidth: 500,
    },
    qrContainer: {
      alignItems: "center",
      padding: 20,
    },
    remoteContent: {
      flex: 1,
      width: "100%",
      maxWidth: 500,
      marginHorizontal: "auto",
      marginTop: 40,
    },
    button: {
      height: 60,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontSize: 24,
      fontWeight: "bold",
    },
    orContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    orText: {
      color: "white",
      fontSize: 24,
      fontWeight: "bold",
    },
  });
};
