import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { checkSellerStatus } from "@/services/sellerService";
import type { Seller } from "@/types/seller";
import LoadingState from "./elements/LoadingState";
import ErrorState from "./elements/ErrorState";
import SignInRequiredState from "./elements/SignInRequiredState";
import SellerDashboard from "./sections/SellerDashboard";

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

  // Always show seller dashboard with seller status
  return <SellerDashboard seller={seller} />;
}
