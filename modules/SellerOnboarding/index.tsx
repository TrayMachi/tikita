import React, { useState } from "react";
import { SafeAreaView, Alert, View, Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/Themed";
import { useAuth } from "@/contexts/AuthContext";
import { createSeller } from "@/services/sellerService";
import type { SellerFormData, SellerOnboardingState } from "@/types/seller";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import PageOnboardingStep1 from "@/modules/SellerOnboarding/sections/PageOnboardingStep1";
import PageOnboardingStep2 from "@/modules/SellerOnboarding/sections/PageOnboardingStep2";
import OnboardingStep3 from "@/modules/SellerOnboarding/sections/OnboardingStep3";
import OnboardingStep4 from "@/modules/SellerOnboarding/sections/OnboardingStep4";
import { Center } from "@/components/ui/center";

function getStepTitle(step: number): string {
  switch (step) {
    case 1:
      return "Persiapan Dokumen";
    case 2:
      return "Verifikasi Identitas (e-KYC)";
    case 3:
      return "Upload Foto KTP";
    case 4:
      return "Verifikasi Selfie";
    default:
      return "Langkah " + step;
  }
}

function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <HStack className="items-center justify-center" space="md">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <HStack key={stepNumber} className="items-center">
            {/* Step Circle */}
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                isActive
                  ? "bg-primary-500"
                  : isCompleted
                  ? "bg-primary-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  isActive || isCompleted
                    ? "text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {stepNumber}
              </Text>
            </View>

            {/* Connector Line */}
            {index < totalSteps - 1 && (
              <View
                className={`w-16 h-0.5 mx-2 ${
                  isCompleted
                    ? "bg-primary-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            )}
          </HStack>
        );
      })}
    </HStack>
  );
}

export default function SellerOnboardingModule() {
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
            onPress: () => router.replace("/(tabs)/sellticket"),
          },
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
        return <PageOnboardingStep1 {...stepProps} />;
      case 2:
        return <PageOnboardingStep2 {...stepProps} />;
      case 3:
        return <OnboardingStep3 {...stepProps} />;
      case 4:
        return <OnboardingStep4 {...stepProps} />;
      default:
        return <PageOnboardingStep1 {...stepProps} />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-background-950">
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Pendaftaran Seller",
          headerBackVisible: true,
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
          headerBackButtonDisplayMode: "minimal",
          headerRight: () => (
            <Pressable className="p-2 mr-2">
              <FontAwesome
                name="refresh"
                size={20}
                className="text-primary-500"
              />
            </Pressable>
          ),
          headerTitle: () => (
            <Center>
              <Text className="text-typography-900 dark:text-typography-50 font-poppins-semibold">
                Pendaftaran Seller
              </Text>
            </Center>
          ),
        }}
      />

      <VStack className="flex-1 my-7">
        <StepIndicator currentStep={state.currentStep} totalSteps={4} />
        <VStack className="items-center mt-2">
          <Text className="text-sm text-typography-600 dark:text-typography-400">
            Tahap {state.currentStep}:
          </Text>
          <Text className="text-base font-medium text-primary-500">
            {getStepTitle(state.currentStep)}
          </Text>
        </VStack>
        {/* Step Content */}
        <VStack className="flex-1">{renderStep()}</VStack>

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
