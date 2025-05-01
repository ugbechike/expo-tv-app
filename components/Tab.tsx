import { useScale } from "@/hooks/useScale";
import React, { useState } from "react";
import {
  Pressable,
  Text,
  TVFocusGuideView,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: {
    id: string;
    title: string;
    icon?: React.ReactNode;
  }[];
}

export const Tab = ({ activeTab, setActiveTab, tabs }: TabProps) => {
  const styles = useTabStyles();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabWrapper}>
        {tabs.map((tab, index) => {
          return (
            <TVFocusGuideView
              style={styles.tab}
              onFocus={() => setActiveTab(tab.id)}
              key={index}
            >
              <Pressable
                style={[
                  styles.tabButton,
                  {
                    backgroundColor:
                      activeTab === tab.id ? "white" : "transparent",
                    borderColor:
                      activeTab === tab.id
                        ? colors.tint
                        : "rgba(255,255,255,0.3)",
                  },
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: activeTab === tab.id ? "black" : "white" },
                  ]}
                >
                  {tab.title}
                </Text>
              </Pressable>
            </TVFocusGuideView>
          );
        })}
      </View>
    </View>
  );
};

const useTabStyles = () => {
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
    },
    headerText: {
      fontSize: 42,
      fontWeight: "bold",
      color: "white",
      // marginBottom: 40,
      textAlign: "center",
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 40,
    },
    tabWrapper: {
      flexDirection: "row",
      width: isIos ? "80%" : "30%",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.5)",
      borderRadius: 50,
      padding: 4,
    },
    tab: {
      flex: 1,
    },
    tabButton: {
      height: isIos ? 40 : 60,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    tabText: {
      fontSize: isIos ? 18 : 24,
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
      fontSize: 24,
      fontWeight: "bold",
    },
    errorText: {
      color: "red",
      marginTop: 15,
      textAlign: "center",
      fontSize: 16 * scale,
    },
  });
};
