import { StripeProvider } from "@stripe/stripe-react-native";
import { ComponentProps } from "react";
import Constants from "expo-constants";
import * as Linking from 'expo-linking'

const marchantIdentifier = Constants.expoConfig?.plugins?.find(
  (p) => p[0] === "@stripe/stripe-react-native"
)?.[1]?.merchantIdentifier;

if (!marchantIdentifier) {
  throw new Error("merchantIdentifier is not set");
}


export default function ExpoStripeProvider(
  props: Omit<
    ComponentProps<typeof StripeProvider>,
    "publishableKey" | "merchantIdentifier"
  >
){
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier={marchantIdentifier}
      urlScheme={Linking.createURL("/")?.split(":")[0]}
      {...props}
    />
  );
};
