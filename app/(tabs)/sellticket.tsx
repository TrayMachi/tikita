import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { View, Text } from "@/components/Themed";
import { useAuth } from "@/contexts/AuthContext";
import { checkSellerStatus } from "@/services/sellerService";
import type { Seller } from "@/types/seller";
import SellerOnboarding from "@/components/seller/SellerOnboarding";
import SellerDashboard from "@/components/seller/SellerDashboard";

export default function SellTicketScreen() {
  const { user, loading: authLoading } = useAuth();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkUserSellerStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const sellerData = await checkSellerStatus(user.id);
      setSeller(sellerData);
    } catch (err) {
      console.error("Error checking seller status:", err);
      setError("Failed to load seller information");
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    // Refresh seller status after onboarding completion
    checkUserSellerStatus();
  };

  useEffect(() => {
    if (!authLoading && user) {
      checkUserSellerStatus();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  // Show loading state
  if (authLoading || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0 dark:bg-background-950">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="text-typography-600 dark:text-typography-300 mt-4">
          Loading...
        </Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-4 bg-background-0 dark:bg-background-950">
        <Text className="text-xl font-heading text-error-600 mb-2">Error</Text>
        <Text className="text-base text-typography-700 dark:text-typography-200 text-center mb-4">
          {error}
        </Text>
        <Text
          className="text-primary-500 text-center"
          onPress={checkUserSellerStatus}
        >
          Tap to retry
        </Text>
      </View>
    );
  }

  // Show authentication required state
  if (!user) {
    return (
      <View className="flex-1 items-center justify-center px-4 bg-background-0 dark:bg-background-950">
        <Text className="text-2xl font-heading text-typography-900 dark:text-typography-50 mb-2">
          Sign In Required
        </Text>
        <Text className="text-base text-typography-700 dark:text-typography-200 text-center">
          Please sign in to access seller features
        </Text>
      </View>
    );
  }

  // Show seller dashboard if user is already a seller
  if (seller) {
    return <SellerDashboard seller={seller} />;
  }

  // Show onboarding if user is not a seller yet
  return <SellerOnboarding onComplete={handleOnboardingComplete} />;
}
