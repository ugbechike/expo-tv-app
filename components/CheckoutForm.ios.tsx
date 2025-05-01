import {
  Alert,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { Fragment, useEffect, useState } from "react";
import * as Linking from "expo-linking";
import { router } from "expo-router";

async function fetchPaymentSheetParams(amount: number): Promise<{
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
}> {
  return fetch("/api/payment-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  }).then((res) => res.json());
}

export default function CheckoutForm({ amount, handleMobilePay }: { amount: number, handleMobilePay: () => void }) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isLoading, setIsLoading] = useState(false);
  const styles = useCheckoutFormStyles();

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams(amount);

    const { error } = await initPaymentSheet({
      merchantDisplayName: "TVOS App",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,

      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Test User",
        email: "test@test.com",
        phone: "888-888-8888",
      },

      returnURL: Linking.createURL("stripe-redirect"),

      //Enable app pay
      applePay: {
        merchantCountryCode: "US",
      },
    });

    if (!error) {
      console.error(error);
      setIsLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      // console.error(error);
      if (error.code === "Canceled") {
        // router.back();
        console.warn(error);
      }
    } else {
      console.log("Payment sheet presented");
      Alert.alert("Payment successful", "Thank you for your purchase");
      // update user data with the purchased movie
      handleMobilePay();
    }
  };

  const handleIntents = async () => {
    await initializePaymentSheet();
    await openPaymentSheet();
  }

  useEffect(() => {
    handleIntents();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={initializePaymentSheet}
      >
        <Text style={styles.buttonText}>Initialize Payment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={openPaymentSheet}
      >
        <Text style={styles.buttonText}>Open Payment Sheet</Text>
      </TouchableOpacity>
    </View>
  );
}

const useCheckoutFormStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      paddingHorizontal: 16,
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 10,
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "black",
    },
    buttonText: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
};
