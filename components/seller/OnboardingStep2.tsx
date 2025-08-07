import React, { useState } from "react";
import { ScrollView, Alert } from "react-native";
import { View, Text } from "@/components/Themed";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Box } from "@/components/ui/box";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { Image } from "@/components/ui/image";
import type { OnboardingStepProps } from "@/types/seller";
import { checkNIKAvailability } from "@/services/sellerService";

export default function OnboardingStep2({
  onNext,
  onPrevious,
  formData,
  updateFormData,
}: OnboardingStepProps) {
  const [nikError, setNikError] = useState("");
  const [isCheckingNik, setIsCheckingNik] = useState(false);
  const [isUploadingKtp, setIsUploadingKtp] = useState(false);

  const handleNikChange = async (nik: string) => {
    updateFormData({ NIK: nik });
    setNikError("");

    // Validate NIK format (16 digits)
    if (nik.length === 16) {
      setIsCheckingNik(true);
      try {
        const isAvailable = await checkNIKAvailability(nik);
        if (!isAvailable) {
          setNikError("NIK sudah terdaftar sebagai seller");
        }
      } catch (error) {
        console.error("Error checking NIK:", error);
        setNikError("Gagal memverifikasi NIK");
      } finally {
        setIsCheckingNik(false);
      }
    } else if (nik.length > 0) {
      setNikError("NIK harus 16 digit");
    }
  };

  const pickKtpImage = async () => {
    try {
      // Request permission first
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission required",
          "Please allow access to your photo library"
        );
        return;
      }

      setIsUploadingKtp(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // For now, we'll store the local URI
        // In production, you'd upload to Supabase storage here
        updateFormData({ linkKtp: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    } finally {
      setIsUploadingKtp(false);
    }
  };

  const canProceed = () => {
    return (
      formData.NIK.length === 16 &&
      formData.nama.trim().length > 0 &&
      formData.linkKtp.length > 0 &&
      !nikError &&
      !isCheckingNik
    );
  };

  return (
    <ScrollView className="flex-1 px-6 py-4">
      <View className="space-y-6">
        {/* Header */}
        <View className="items-center space-y-2">
          <Text className="text-2xl font-heading text-center text-typography-900 dark:text-typography-50">
            Personal Information
          </Text>
          <Text className="text-sm text-center text-typography-600 dark:text-typography-300">
            Step 2 of 4
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="w-full bg-background-200 dark:bg-background-700 rounded-full h-2">
          <View className="bg-primary-500 h-2 rounded-full w-1/2" />
        </View>

        {/* NIK Input */}
        <Box className="space-y-3">
          <Text className="text-lg font-semibold text-typography-900 dark:text-typography-50">
            NIK (Nomor Induk Kependudukan)
          </Text>

          <Input
            variant="outline"
            size="lg"
            className={`${nikError ? "border-error-500" : ""}`}
          >
            <InputField
              placeholder="Enter your 16-digit NIK"
              value={formData.NIK}
              onChangeText={handleNikChange}
              keyboardType="numeric"
              maxLength={16}
            />
          </Input>

          {isCheckingNik && (
            <View className="flex-row items-center space-x-2">
              <FontAwesome
                name="spinner"
                size={16}
                className="text-primary-500"
              />
              <Text className="text-sm text-primary-500">
                Checking NIK availability...
              </Text>
            </View>
          )}

          {nikError && (
            <Text className="text-sm text-error-500">{nikError}</Text>
          )}

          {formData.NIK.length === 16 && !nikError && !isCheckingNik && (
            <View className="flex-row items-center space-x-2">
              <FontAwesome
                name="check-circle"
                size={16}
                className="text-success-500"
              />
              <Text className="text-sm text-success-500">NIK is available</Text>
            </View>
          )}
        </Box>

        {/* Full Name Input */}
        <Box className="space-y-3">
          <Text className="text-lg font-semibold text-typography-900 dark:text-typography-50">
            Full Name (as in KTP)
          </Text>

          <Input variant="outline" size="lg">
            <InputField
              placeholder="Enter your full name"
              value={formData.nama}
              onChangeText={(nama) => updateFormData({ nama })}
            />
          </Input>
        </Box>

        {/* KTP Photo Upload */}
        <Box className="space-y-3">
          <Text className="text-lg font-semibold text-typography-900 dark:text-typography-50">
            KTP Photo
          </Text>

          <Text className="text-sm text-typography-600 dark:text-typography-300">
            Take a clear photo of your KTP. Make sure all text is readable.
          </Text>

          {formData.linkKtp ? (
            <View className="space-y-3">
              <Image
                source={{ uri: formData.linkKtp }}
                className="w-full h-48 rounded-lg"
                alt="KTP Preview"
              />

              <Button
                variant="outline"
                onPress={pickKtpImage}
                disabled={isUploadingKtp}
                className="w-full py-3"
              >
                <ButtonText className="text-primary-500">
                  {isUploadingKtp ? "Uploading..." : "Change Photo"}
                </ButtonText>
              </Button>
            </View>
          ) : (
            <Button
              variant="outline"
              onPress={pickKtpImage}
              disabled={isUploadingKtp}
              className="w-full py-8 border-dashed border-2"
            >
              <View className="items-center space-y-2">
                <FontAwesome
                  name={isUploadingKtp ? "spinner" : "camera"}
                  size={24}
                  className="text-primary-500"
                />
                <ButtonText className="text-primary-500">
                  {isUploadingKtp ? "Uploading..." : "Upload KTP Photo"}
                </ButtonText>
              </View>
            </Button>
          )}
        </Box>

        {/* Navigation Buttons */}
        <View className="flex-row space-x-4 pt-4">
          <Button
            variant="outline"
            onPress={onPrevious}
            className="flex-1 py-4"
          >
            <ButtonText className="text-primary-500">Back</ButtonText>
          </Button>

          <Button
            onPress={onNext}
            disabled={!canProceed()}
            className={`flex-1 py-4 ${
              canProceed()
                ? "bg-primary-500 hover:bg-primary-600"
                : "bg-background-300 dark:bg-background-600"
            }`}
          >
            <ButtonText
              className={canProceed() ? "text-white" : "text-typography-400"}
            >
              Next
            </ButtonText>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
