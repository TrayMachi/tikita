import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { checkSellerStatus } from "@/services/sellerService";
import type { Seller } from "@/types/seller";
import LoadingState from "./elements/LoadingState";
import ErrorState from "./elements/ErrorState";
import SignInRequiredState from "./elements/SignInRequiredState";
import SellerDashboard from "./sections/SellerDashboard";
import SellerOnboarding from "./sections/SellerOnboarding";

export default function SellTicketModule() {
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
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={checkUserSellerStatus} />;
  }

  // Show authentication required state
  if (!user) {
    return <SignInRequiredState />;
  }

  // Show seller dashboard if user is already a seller
  if (seller) {
    return <SellerDashboard seller={seller} />;
  }

  // Show onboarding if user is not a seller yet
  return <SellerOnboarding onComplete={handleOnboardingComplete} />;
}
