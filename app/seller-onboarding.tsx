import React, { useState } from "react";
import { SafeAreaView, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { createSeller } from "@/services/sellerService";
import type { SellerFormData, SellerOnboardingState } from "@/types/seller";
import OnboardingHeader from "@/modules/SellTicketModule/components/OnboardingHeader";
import EnhancedOnboardingStep1 from "@/modules/SellTicketModule/sections/EnhancedOnboardingStep1";
import EnhancedOnboardingStep2 from "@/modules/SellTicketModule/sections/EnhancedOnboardingStep2";
import OnboardingStep3 from "@/modules/SellTicketModule/sections/OnboardingStep3";
import OnboardingStep4 from "@/modules/SellTicketModule/sections/OnboardingStep4";

export default function SellerOnboardingPage() {
  const router = useRouter();
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

  const handleBack = () => {
    if (state.currentStep > 1) {
      previousStep();
    } else {
      // Go back to the previous screen
      router.back();
    }
  };

  const handleComplete = async () => {
    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const finalFormData: SellerFormData = {
        ...state.formData,
        linkKtp: state.formData.linkKtp,
        linkSelfieKtp: state.formData.linkSelfieKtp,
      };

      await createSeller(user.id, finalFormData);

      Alert.alert(
        "Berhasil",
        "Aplikasi seller Anda telah berhasil dikirim! Kami akan meninjau dokumen Anda dan memberi tahu setelah diverifikasi.",
        [
          { 
            text: "OK", 
            onPress: () => router.replace("/(tabs)/sellticket")
          }
        ]
      );
    } catch (error) {
      console.error("Error creating seller:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal mengirim aplikasi. Silakan coba lagi.";

      Alert.alert("Error", errorMessage, [{ text: "OK" }]);
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const getNextButtonText = () => {
    switch (state.currentStep) {
      case 1:
        return "Saya Siap, Mari Mulai";
      case 4:
        return state.isSubmitting ? "Mengirim..." : "Kirim Aplikasi";
      default:
        return "Lanjutkan";
    }
  };

  const canProceed = () => {
    switch (state.currentStep) {
      case 1:
        return true;
      case 2:
        return (
          state.formData.NIK.length === 16 &&
          state.formData.nama.trim().length > 0 &&
          state.formData.linkKtp.length > 0
        );
      case 3:
        return state.formData.linkSelfieKtp.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    const stepProps = {
      formData: state.formData,
      updateFormData,
      onNext: () => {}, // We'll handle this in footer
      onPrevious: () => {}, // We'll handle this in header
      isSubmitting: state.isSubmitting,
    };

    switch (state.currentStep) {
      case 1:
        return <EnhancedOnboardingStep1 {...stepProps} />;
      case 2:
        return <EnhancedOnboardingStep2 {...stepProps} />;
      case 3:
        return <OnboardingStep3 {...stepProps} />;
      case 4:
        return <OnboardingStep4 {...stepProps} />;
      default:
        return <EnhancedOnboardingStep1 {...stepProps} />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-background-950">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <VStack className="flex-1">
        {/* Header with stepper and back button */}
        <OnboardingHeader
          currentStep={state.currentStep}
          totalSteps={4}
          title="Pendaftaran Seller"
          onBack={handleBack}
        />

        {/* Step Content */}
        <VStack className="flex-1">
          {renderStep()}
        </VStack>

        {/* Footer with Next button */}
        <VStack className="px-6 py-4 border-t border-outline-200 dark:border-outline-700 bg-white dark:bg-background-950">
          <Button
            onPress={state.currentStep === 4 ? handleComplete : nextStep}
            disabled={!canProceed() || state.isSubmitting}
            size="lg"
            action={canProceed() ? "primary" : "default"}
          >
            <ButtonText className="font-semibold">
              {getNextButtonText()}
            </ButtonText>
          </Button>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
}
