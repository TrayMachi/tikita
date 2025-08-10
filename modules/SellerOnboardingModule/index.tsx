import React, { useState } from "react";
import { SafeAreaView, Alert, View, Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { createSeller } from "@/services/sellerService";
import type { SellerFormData, SellerOnboardingState } from "@/types/seller";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import OnboardingStep3 from "@/modules/SellerOnboardingModule/sections/OnboardingStep3";
import OnboardingStep4 from "@/modules/SellerOnboardingModule/sections/OnboardingStep4";
import { Center } from "@/components/ui/center";
import StepIndicator from "@/modules/SellerOnboardingModule/elements/StepIndicator";
import OnboardingStep1 from "./sections/OnboardingStep1";
import OnboardingStep2 from "./sections/OnboardingStep2";
import { HStack } from "@/components/ui/hstack";
import { Grid, GridItem } from "@/components/ui/grid";

function getStepTitle(step: number): string {
  switch (step) {
    case 1:
      return "Persiapan Dokumen";
    case 2:
      return "Verifikasi Identitas (e-KYC)";
    case 3:
      return "Upload Foto KTP";
    case 4:
      return "Pastikan Dokumen Kamu Sudah Benar";
    default:
      return "Langkah " + step;
  }
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
        return "Saya Siap";
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
    <SafeAreaView className="flex-1 bg-white">
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
          headerTitleAlign: "center",
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
        }}
      />

      <VStack className="flex-1 my-7">
        <StepIndicator currentStep={state.currentStep} totalSteps={4} />
        <VStack className="items-center mt-4">
          <Text className="text-sm text-typography-600 dark:text-typography-400 font-poppins-medium">
            Tahap {state.currentStep}:
          </Text>
          <Text className="text-2xl text-primary-500 font-poppins-bold">
            {getStepTitle(state.currentStep)}
          </Text>
        </VStack>
        {/* Step Content */}
        <VStack className="flex-1">{renderStep()}</VStack>

        {/* Footer with Next button */}
        <VStack className="px-6 py-4 border-t bg-white shadow-lg border-outline-200 dark:border-outline-700">
          <Grid
            className="gap-2"
            _extra={{
              className: "grid-cols-2 bg-white",
            }}
          >
            <GridItem _extra={{ className: "flex-1 bg-white" }}>
              <Button onPress={handleBack} action="secondary" size="lg">
                <ButtonText className="text-white">Kembali</ButtonText>
              </Button>
            </GridItem>
            <GridItem _extra={{ className: "flex-1 bg-white" }}>
              <Button
                onPress={state.currentStep === 4 ? handleComplete : nextStep}
                disabled={!canProceed() || state.isSubmitting}
                size="lg"
              >
                <ButtonText className="font-semibold">
                  {getNextButtonText()}
                </ButtonText>
              </Button>
            </GridItem>
          </Grid>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
}
