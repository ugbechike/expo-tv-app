import { useSignin, useSignup } from "@/hooks/api/useSignin";
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  ImageBackground,
  Linking,
} from "react-native";
import { useState, useEffect, Fragment } from "react";
import QRCode from "react-native-qrcode-svg";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TVFocusGuideView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useScale } from "@/hooks/useScale";
import { router } from "expo-router";

// @TODO Clean code
export default function Auth() {
  const { mutate: signin, isPending: isSigningIn, error: signinError } = useSignin();
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(false);
  const { 
    mutate: signup, 
    isPending: isSigningUp, 
    error: signupError 
  } = useSignup({
    onPollingStart: () => setIsWaitingForConfirmation(true),
    onPollingEnd: () => setIsWaitingForConfirmation(false),
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"phone" | "remote">("phone");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [focusedButton, setFocusedButton] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const styles = useAuthStyles();
  console.log(signinError);
  const [intent, setIntent] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    // Generate a random 8-digit code
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    setVerificationCode(code.slice(0, 4) + "-" + code.slice(4));
  }, []);

  const handleSignup = () => {
    // Reset waiting state in case of previous attempt timeout
    setIsWaitingForConfirmation(false); 
    signup({ email, password });
  };

  const handleSignin = () => {
    signin({ email, password });
  };

  const handleAuth = () => {
    if (intent === "signup") {
      handleSignup();
    } else {
      handleSignin();
    }
  };

  const qrData = JSON.stringify({
    type: 'auth',
    url: 'myapp.com/t2',
    code: verificationCode
  });

  const getButtonText = () => {
    if (isWaitingForConfirmation) return "Waiting for confirmation...";
    if (isSigningUp) return "Sending confirmation email...";
    if (isSigningIn) return "Signing in...";
    if (intent === "signup") return "Sign Up";
    return "Sign In";
  };

  const title = Platform.isTVOS ? "Choose how to sign in" : "Sign in";

  return (
    <ImageBackground
      source={{
        uri: "https://cdn.mos.cms.futurecdn.net/rDJegQJaCyGaYysj2g5XWY.jpg",
      }}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.headerText}>{title}</Text>

            {Platform.isTVOS && <View style={styles.tabContainer}>
              <View style={styles.tabWrapper}>
                <TVFocusGuideView
                  style={styles.tab}
                  onFocus={() => setActiveTab("phone")}
                >
                  <Pressable
                    style={[
                      styles.tabButton,
                      {
                        backgroundColor:
                          activeTab === "phone" ? "white" : "transparent",
                        borderColor:
                          activeTab === "phone"
                            ? colors.tint
                            : "rgba(255,255,255,0.3)",
                      },
                    ]}
                    onPress={() => setActiveTab("phone")}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        { color: activeTab === "phone" ? "black" : "white" },
                      ]}
                    >
                      Use phone
                    </Text>
                  </Pressable>
                </TVFocusGuideView>

                <TVFocusGuideView
                  style={styles.tab}
                  onFocus={() => setActiveTab("remote")}
                >
                  <Pressable
                    style={[
                      styles.tabButton,
                      {
                        backgroundColor:
                          activeTab === "remote" ? "white" : "transparent",
                        borderColor:
                          activeTab === "remote"
                            ? colors.tint
                            : "rgba(255,255,255,0.3)",
                      },
                    ]}
                    onPress={() => setActiveTab("remote")}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        { color: activeTab === "remote" ? "black" : "white" },
                      ]}
                    >
                      Use remote
                    </Text>
                  </Pressable>
                </TVFocusGuideView>
              </View>
            </View>}

            <View style={styles.mainContent}>
             {Platform.isTVOS ? <Fragment>
              {activeTab === "phone" ? (
                <View style={styles.phoneContent}>
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
                  <View style={styles.leftSection}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>2</Text>
                    </View>
                    <View>
                      <Text style={styles.stepText}>
                        Confirm this code on your phone or tablet
                      </Text>
                      <Text style={styles.verificationCode}>
                        {verificationCode}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.remoteContent}>
                  <View style={styles.form}>
                    <TVFocusGuideView
                      style={styles.inputContainer}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput(null)}
                    >
                      <TextInput
                        style={[
                          styles.input,
                          {
                            color: "black",
                            borderWidth: 1,
                            borderColor:
                              focusedInput === "email"
                                ? "green"
                                : "rgba(255,255,255,0.3)",
                            backgroundColor: "white",
                          },
                        ]}
                        placeholder="Email"
                        placeholderTextColor="black"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />
                    </TVFocusGuideView>

                    <TVFocusGuideView
                      style={styles.inputContainer}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                    >
                      <TextInput
                        style={[
                          styles.input,
                          {
                            color: "black",
                            borderWidth: 1,
                            borderColor:
                              focusedInput === "password"
                                ? "green"
                                : "rgba(255,255,255,0.3)",
                            backgroundColor: "white",
                          },
                        ]}
                        placeholder="Password"
                        placeholderTextColor="black"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                      />
                    </TVFocusGuideView>

                    <TVFocusGuideView
                      style={styles.buttonContainer}
                      onFocus={() => setFocusedButton("login")}
                      onBlur={() => setFocusedButton(null)}
                    >
                      <Pressable
                        style={[
                          styles.button,
                          {
                            backgroundColor:
                              focusedButton === "login"
                                ? colors.tint
                                : "rgba(255,255,255,0.1)",
                            transform: [
                              { scale: focusedButton === "login" ? 1.05 : 1 },
                            ],
                          },
                        ]}
                        onPress={handleAuth}
                        disabled={isSigningUp || isWaitingForConfirmation}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            {
                              color:
                                focusedButton === "login" ? "black" : "white",
                            },
                          ]}
                        >
                          {getButtonText()}
                        </Text>
                      </Pressable>
                    </TVFocusGuideView>

                    <TVFocusGuideView
                      style={styles.buttonContainer}
                      onFocus={() => setFocusedButton("intent")}
                      onBlur={() => setFocusedButton(null)}
                    >
                      <Pressable
                        onPress={() => setIntent(intent === "signup" ? "signin" : "signup")}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            { 
                              color:
                                focusedButton === "intent" ? "blue" : "white",
                            },
                          ]}
                        >
                          {intent === "signup" ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                        </Text>
                      </Pressable>
                    </TVFocusGuideView>

                    {(signupError || signinError) && (
                      <Text style={styles.errorText}>
                        {signupError?.message || signinError?.message || 'An error occurred'}
                      </Text>
                    )}
                  </View>
                </View>
              )}
              </Fragment> : <Fragment>
              <View style={styles.remoteContent}>
                  <View style={styles.form}>
                    <TVFocusGuideView
                      style={styles.inputContainer}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput(null)}
                    >
                      <TextInput
                        style={[
                          styles.input,
                          {
                            color: "black",
                            borderWidth: 1,
                            borderColor:
                              focusedInput === "email"
                                ? "green"
                                : "rgba(255,255,255,0.3)",
                            backgroundColor: "white",
                          },
                        ]}
                        placeholder="Email"
                        placeholderTextColor="black"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />
                    </TVFocusGuideView>

                    <TVFocusGuideView
                      style={styles.inputContainer}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                    >
                      <TextInput
                        style={[
                          styles.input,
                          {
                            color: "black",
                            borderWidth: 1,
                            borderColor:
                              focusedInput === "password"
                                ? "green"
                                : "rgba(255,255,255,0.3)",
                            backgroundColor: "white",
                          },
                        ]}
                        placeholder="Password"
                        placeholderTextColor="black"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                      />
                    </TVFocusGuideView>

                    <TVFocusGuideView
                      style={styles.buttonContainer}
                      onFocus={() => setFocusedButton("login")}
                      onBlur={() => setFocusedButton(null)}
                    >
                      <Pressable
                        style={[
                          styles.button,
                          {
                            backgroundColor:
                              focusedButton === "login"
                                ? colors.tint
                                : "rgba(255,255,255,0.1)",
                            transform: [
                              { scale: focusedButton === "login" ? 1.05 : 1 },
                            ],
                          },
                        ]}
                        onPress={handleAuth}
                        disabled={isSigningUp || isWaitingForConfirmation}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            {
                              color:
                                focusedButton === "login" ? "black" : "white",
                            },
                          ]}
                        >
                          {getButtonText()}
                        </Text>
                      </Pressable>
                    </TVFocusGuideView>

                    <TVFocusGuideView
                      style={styles.buttonContainer}
                      onFocus={() => setFocusedButton("intent")}
                      onBlur={() => setFocusedButton(null)}
                    >
                      <Pressable
                        onPress={() => setIntent(intent === "signup" ? "signin" : "signup")}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            { 
                              color:
                                focusedButton === "intent" ? "blue" : "white",
                            },
                          ]}
                        >
                          {intent === "signup" ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                        </Text>
                      </Pressable>
                    </TVFocusGuideView>

                    {(signupError || signinError) && (
                      <Text style={styles.errorText}>
                        {signupError?.message || signinError?.message || 'An error occurred'}
                      </Text>
                    )}
                  </View>
                </View>
              </Fragment>}
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const useAuthStyles = () => {
  const scale = useScale();
  const isIos = Platform.OS === 'ios' && !Platform.isTV;
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
      paddingVertical: 20,
    },
    content: {
      flex: 1,
      width: "100%",
      gap: 20,
      paddingTop: isIos ? 30 : 0,

    },
    headerText: {
      fontSize: isIos ? 26 : 42 * scale,
      fontWeight: "bold",
      color: "white",
      // marginBottom: 40,
      textAlign: "center",
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 40,
      width: "100%",
    },
    tabWrapper: {
      flexDirection: "row",
      width: isIos ? "100%" : "30%",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.5)",
      borderRadius: 50,
      padding: 4,
    },
    tab: {
      flex: 1,
    },
    tabButton: {
      height: 60,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    tabText: {
      fontSize: 24,
      fontWeight: "bold",
    },
    mainContent: {
      flex: 1,
      width: "100%",
    },
    phoneContent: {
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
    verificationCode: {
      color: "white",
      fontSize: 48,
      fontWeight: "bold",
      letterSpacing: 4,
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
    form: {
      width: "100%",
    },
    inputContainer: {
      marginBottom: 30,
    },
    input: {
      width: "100%",
      height: 60,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 20,
      fontSize: 18,
    },
    buttonContainer: {
      marginTop: 30,
    },
    button: {
      height: 60,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontSize: 20,
      fontWeight: "bold",
    },
    errorText: {
      color: 'red',
      marginTop: 15,
      textAlign: 'center',
      fontSize: 16 * scale, 
    },
  });
};
