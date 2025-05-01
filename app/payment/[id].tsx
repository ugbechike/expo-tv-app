import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  Platform,
} from "react-native";
import { useState, useEffect, Fragment } from "react";
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
import { supabase } from "@/lib/supabase";
import { useGetUser } from "@/hooks/api/useGetUser";
const CheckoutForm =
  Platform.OS === "ios" && !Platform.isTV
    ? require("@/components/CheckoutForm.ios").default
    : null;

const tabs = [
  { id: "fiat", title: "Pay with Card" },
  { id: "crypto", title: "Pay with Crypto" },
];

export default function Payment() {
  const [activeTab, setActiveTab] = useState("fiat");
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const styles = usePaymentStyles();
  const { id, intent: paramIntent } = useLocalSearchParams();
  const { data: payment } = usePayment();
  const { data: movieDetails } = useGetMovieDetails(Number(id));
  const [focused, setFocused] = useState<string | null>("paymentCard");
  const [txnProcessing, setTxnProcessing] = useState(false);
  const [intent, setIntent] = useState<string | null>(paramIntent as string);
  const { data: user } = useGetUser();
  const isIos = Platform.OS === "ios" && !Platform.isTV;
  const amount = intent === "watch_now" || intent === "watch_later" ? movieDetails?.rentPrice : movieDetails?.buyPrice;

  useEffect(() => {
    setIntent(paramIntent as string);
  }, [paramIntent]);

  const qrData = JSON.stringify({
    type: "payment",
    url: "myapp.com/t2",
    code: 12344,
  });

  const handlePay = async () => {
    setTxnProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Here if user intent was rent and watch now, then we should push to the rented movie player page - DONE
      // If user intent was rent and watch later, then we should push to the movie page - DONE
      // if user intent buy, buy doesn't watch now or later option, simply navigate to the purchased movie player page - DONE

      // we need to updateUser in superbase to add rentedMovies or purchasedMovies without overriding the existing ones

      const { data, error } = await supabase.auth.updateUser({
        data: {
          rentedMovies:
            intent === "watch_now" || intent === "watch_later"
              ? [...(user?.rentedMovies || []), movieDetails]
              : user?.rentedMovies || [],
          purchasedMovies:
            intent === "buy"
              ? [...(user?.purchasedMovies || []), movieDetails]
              : user?.purchasedMovies || [],
        },
      });

      setTxnProcessing(false);

      if (error) {
        console.error("Error updating user:", error);
        throw error;
      }

      if (intent === "watch_now") {
        router.navigate(`/player/${id}`);
        return;
      }

      router.push({
        pathname: "/collections",
        params: {
          intent: intent === "watch_later" ? "rent" : "purchased",
        },
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      setTxnProcessing(false);
    }
  };

  const resetIntentAndNavigate = () => {
    setIntent(null);
    router.back();
  };


  const handleMobilePay = async () => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          rentedMovies:
            intent === "watch_now" || intent === "watch_later"
              ? [...(user?.rentedMovies || []), movieDetails]
              : user?.rentedMovies || [],
          purchasedMovies:
            intent === "buy"
              ? [...(user?.purchasedMovies || []), movieDetails]
              : user?.purchasedMovies || [],
        },
      });

      if (error) {
        console.error("Error updating user:", error);
        throw error;
      }

      if (intent === "watch_now") {
        router.navigate(`/player/${id}`);
        return;
      }

      router.push({
        pathname: "/collections",
        params: {
          intent: intent === "watch_later" ? "rent" : "purchased",
        },
      });
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

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
          {intent === "rent" ? (
            <View style={styles.rentContainer}>
              <Text style={styles.rentText}>
                Renting {movieDetails?.title} for ${movieDetails?.rentPrice} for
                3 days
              </Text>
              <Text style={styles.rentSubText}>
                Note that Renting period will start once you start watching the
                movie.
              </Text>

              <TVFocusGuideView
                onFocus={() => setFocused("watchNowButton")}
                onBlur={() => setFocused(null)}
                style={styles.buttonContainer}
              >
                <Pressable
                  style={[
                    styles.button,
                    {
                      transform: [
                        { scale: focused === "watchNowButton" ? 1.05 : 1 },
                      ],
                      backgroundColor:
                        focused === "watchNowButton"
                          ? "white"
                          : isIos
                          ? "white"
                          : "black",
                    },
                  ]}
                  onPress={() => setIntent("watch_now")}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          focused === "watchNowButton"
                            ? "black"
                            : isIos
                            ? "black"
                            : "white",
                      },
                    ]}
                  >
                    Rent and watch now
                  </Text>
                </Pressable>
              </TVFocusGuideView>
              <TVFocusGuideView
                onFocus={() => setFocused("watchLaterButton")}
                onBlur={() => setFocused(null)}
                style={styles.buttonContainer}
              >
                <Pressable
                  style={[
                    styles.button,
                    {
                      transform: [
                        { scale: focused === "watchLaterButton" ? 1.05 : 1 },
                      ],
                      backgroundColor:
                        focused === "watchLaterButton"
                          ? "white"
                          : isIos
                          ? "white"
                          : "black",
                    },
                  ]}
                  onPress={() => setIntent("watch_later")}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          focused === "watchLaterButton"
                            ? "black"
                            : isIos
                            ? "black"
                            : "white",
                      },
                    ]}
                  >
                    Rent and watch later
                  </Text>
                </Pressable>
              </TVFocusGuideView>
              <TVFocusGuideView
                onFocus={() => setFocused("cancelButton")}
                onBlur={() => setFocused(null)}
                style={styles.buttonContainer}
              >
                <Pressable
                  style={[
                    styles.button,
                    {
                      transform: [
                        { scale: focused === "cancelButton" ? 1.05 : 1 },
                      ],
                      backgroundColor:
                        focused === "cancelButton"
                          ? "white"
                          : isIos
                          ? "white"
                          : "black",
                    },
                  ]}
                  onPress={resetIntentAndNavigate}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          focused === "cancelButton"
                            ? "black"
                            : isIos
                            ? "black"
                            : "white",
                      },
                    ]}
                  >
                    Cancel
                  </Text>
                </Pressable>
              </TVFocusGuideView>
            </View>
          ) : (
            <View style={styles.content}>
              <Text style={styles.headerText}>Choose a payment method</Text>

              <Tab
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
              />

              <View style={styles.mainContent}>
                {activeTab === "fiat" ? (
                  <Fragment>
                    {isIos ? (
                      <CheckoutForm 
                      amount={amount} 
                      handleMobilePay={handleMobilePay} 
                      />
                    ) : (
                      <TVFocusGuideView
                        style={styles.fiatContent}
                        onFocus={() => setFocused("payButton")}
                        onBlur={() => setFocused(null)}
                      >
                        <TVFocusGuideView style={styles.leftSection}>
                          <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>1</Text>
                          </View>
                          <View>
                            <Text style={styles.stepText}>
                              Continue with saved card ending with *2343
                            </Text>
                            <TVFocusGuideView
                              onFocus={() => setFocused("payButton")}
                              onBlur={() => setFocused(null)}
                            >
                              <Pressable
                                style={[
                                  styles.button,
                                  {
                                    transform: [
                                      {
                                        scale:
                                          focused === "payButton" ? 1.05 : 1,
                                      },
                                    ],
                                  },
                                ]}
                                onPress={handlePay}
                              >
                                <Text style={styles.buttonText}>
                                  {txnProcessing
                                    ? "Processing..."
                                    : `Pay $${movieDetails?.rentPrice}`}
                                </Text>
                              </Pressable>
                            </TVFocusGuideView>
                          </View>
                        </TVFocusGuideView>

                        {/* Here should be in between with OR */}
                        <TVFocusGuideView style={styles.orContainer}>
                          <Text style={styles.orText}>OR</Text>
                        </TVFocusGuideView>

                        <TVFocusGuideView style={styles.rightSection}>
                          <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>2</Text>
                          </View>

                          <View style={styles.qrContainer}>
                            <Text style={styles.stepText}>
                              Use your phone or tablet's camera and point to
                              this code, or go to myapp.com/t2
                            </Text>
                            <QRCode
                              value={qrData}
                              size={350}
                              backgroundColor="transparent"
                              color="white"
                            />
                            <Text style={[styles.stepText, { marginTop: 20 }]}>
                              Here you can add a new payment method.
                            </Text>
                          </View>
                        </TVFocusGuideView>
                      </TVFocusGuideView>
                    )}
                  </Fragment>
                ) : (
                  <View style={styles.remoteContent}>
                    <View style={styles.qrContainer}>
                      <Text style={styles.stepText}>
                        Pay with Crypto, use your wallet to pay. Scan the QR
                        code to continue purchase.
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
          )}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const usePaymentStyles = () => {
  const scale = useScale();
  const isIos = Platform.OS === "ios" && !Platform.isTV;
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
      paddingHorizontal: isIos ? 0 : 40,
      paddingVertical: 40,
    },
    content: {
      flex: 1,
      width: "100%",
      gap: 20,
      marginTop: isIos ? 20 : 0,
    },
    headerText: {
      fontSize: isIos ? 20 : 42,
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
      height: isIos ? 40 : 60,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isIos ? "white" : "white",
    },
    buttonText: {
      fontSize: isIos ? 16 : 24,
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
    rentContainer: {
      flex: 1,
      width: "100%",
      // gap: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    rentText: {
      color: "white",
      fontSize: isIos ? 16 : 24 * scale,
      fontWeight: "bold",
      textAlign: "center",
    },
    rentSubText: {
      color: "white",
      fontSize: 12 * scale,
      marginVertical: 20,
      textAlign: "center",
    },
    buttonContainer: {
      padding: 20,
      width: isIos ? "100%" : "20%",
    },
  });
};
