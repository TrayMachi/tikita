import React, { useState } from "react";
import { Alert } from "react-native";
import { View } from "@/components/Themed";
import { useAuth } from "@/contexts/AuthContext";
import { createSeller, uploadSellerImage } from "@/services/sellerService";
import type { SellerFormData, SellerOnboardingState } from "@/types/seller";
import OnboardingStep1 from "./OnboardingStep1";
import OnboardingStep2 from "./OnboardingStep2";
import OnboardingStep3 from "./OnboardingStep3";
import OnboardingStep4 from "./OnboardingStep4";

interface SellerOnboardingProps {
  onComplete: () => void;
}

export default function SellerOnboarding({
  onComplete,
}: SellerOnboardingProps) {
  const { user } = useAuth();
  const [state, setState] = useState<SellerOnboardingState>({
    currentStep: 1,
    formData: {
      NIK: "",
      nama: "",
      linkKtp: "",
      linkSelfieKtp: "",
    },
    isSubmitting: false,
    errors: {},
  });

  const updateFormData = (data: Partial<SellerFormData>) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, ...data },
      errors: {
        ...prev.errors,
        ...Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: "" }), {}),
      },
    }));
  };

  const nextStep = () => {
    setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const previousStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1),
    }));
  };

  const handleComplete = async () => {
    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      // Upload images to Supabase Storage
      let ktpUrl = state.formData.linkKtp;
      let selfieUrl = state.formData.linkSelfieKtp;

      // In production, you'd upload the actual images here
      // For now, we'll use the local URIs as placeholders
      // You would need to implement proper file upload logic

      const finalFormData: SellerFormData = {
        ...state.formData,
        linkKtp: ktpUrl,
        linkSelfieKtp: selfieUrl,
      };

      // Create seller record
      await createSeller(user.id, finalFormData);

      // Call onComplete to refresh the parent component
      onComplete();

      Alert.alert(
        "Success",
        "Your seller application has been submitted successfully! We'll review your documents and notify you once verified.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error creating seller:", error);

      // Show specific error message if available
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit your application. Please try again.";

      Alert.alert("Error", errorMessage, [{ text: "OK" }]);
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const renderStep = () => {
    const stepProps = {
      formData: state.formData,
      updateFormData,
      onNext: state.currentStep === 4 ? handleComplete : nextStep,
      onPrevious: state.currentStep > 1 ? previousStep : undefined,
    };

    switch (state.currentStep) {
      case 1:
        return <OnboardingStep1 {...stepProps} />;
      case 2:
        return <OnboardingStep2 {...stepProps} />;
      case 3:
        return <OnboardingStep3 {...stepProps} />;
      case 4:
        return <OnboardingStep4 {...stepProps} />;
      default:
        return <OnboardingStep1 {...stepProps} />;
    }
  };

  return (
    <View className="flex-1 bg-background-0 dark:bg-background-950">
      {renderStep()}
    </View>
  );
}
