import { useCallback } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { router } from 'expo-router';

const isTVOS = Platform.OS === 'ios' && Constants.expoConfig?.ios?.bundleIdentifier?.includes('tvos');

export function usePayment() {
  const handlePayment = useCallback(async (amount: number, movieId: string) => {
    if (isTVOS) {
      // For tvOS, we'll use a different payment approach
      // This could be in-app purchases or a web-based payment flow
      router.push({
        pathname: "/payment/[id]",
        params: { 
          id: movieId,
          amount,
          platform: 'tvos'
        }
      });
    } else {
      // For mobile platforms, use Stripe
      router.push({
        pathname: "/payment/[id]",
        params: { 
          id: movieId,
          amount,
          platform: 'mobile'
        }
      });
    }
  }, []);

  return {
    handlePayment,
    isTVOS
  };
} 