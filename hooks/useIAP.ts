import { useCallback, useState } from 'react';
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const isTVOS = Platform.OS === 'ios' && Constants.expoConfig?.ios?.bundleIdentifier?.includes('tvos');

export function useIAP() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseProduct = useCallback(async (productId: string) => {
    if (!isTVOS) {
      throw new Error('In-app purchases are only available on TV platforms');
    }

    try {
      setIsLoading(true);
      setError(null);

      const { customerInfo, productIdentifier } = await Purchases.purchaseProduct(productId);
      
      if (customerInfo.entitlements.active[productId]) {
        return {
          success: true,
          customerInfo,
          productIdentifier
        };
      } else {
        throw new Error('Purchase was not successful');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred during purchase');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProducts = useCallback(async () => {
    if (!isTVOS) {
      return [];
    }

    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current?.availablePackages || [];
    } catch (e) {
      console.error('Error fetching products:', e);
      return [];
    }
  }, []);

  return {
    purchaseProduct,
    getProducts,
    isLoading,
    error
  };
} 