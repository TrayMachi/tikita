import React, { useState } from "react";
import { ScrollView, Alert } from "react-native";
import { View, Text } from "@/components/Themed";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { Image } from "@/components/ui/image";
import type { OnboardingStepProps } from "@/types/seller";

export default function OnboardingStep3({
  onNext,
  onPrevious,
  formData,
  updateFormData,
}: OnboardingStepProps) {
  const [isUploadingSelfie, setIsUploadingSelfie] = useState(false);

  const pickSelfieImage = async () => {
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

      setIsUploadingSelfie(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // For now, we'll store the local URI
        // In production, you'd upload to Supabase storage here
        updateFormData({ linkSelfieKtp: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    } finally {
      setIsUploadingSelfie(false);
    }
  };

  const takeSelfiePhoto = async () => {
    try {
      // Request camera permission
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission required",
          "Please allow access to your camera"
        );
        return;
      }

      setIsUploadingSelfie(true);

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        updateFormData({ linkSelfieKtp: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    } finally {
      setIsUploadingSelfie(false);
    }
  };

  const canProceed = () => {
    return formData.linkSelfieKtp.length > 0;
  };

  return (
    <ScrollView className="flex-1 px-6 py-4">
      <View className="space-y-6">
        {/* Header */}
        <View className="items-center space-y-2">
          <Text className="text-2xl font-heading text-center text-typography-900 dark:text-typography-50">
            Verification Photo
          </Text>
          <Text className="text-sm text-center text-typography-600 dark:text-typography-300">
            Step 3 of 4
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="w-full bg-background-200 dark:bg-background-700 rounded-full h-2">
          <View className="bg-primary-500 h-2 rounded-full w-3/4" />
        </View>

        {/* Instructions */}
        <Box className="bg-info-50 dark:bg-info-900 p-4 rounded-lg border border-info-200 dark:border-info-700">
          <View className="flex-row items-start space-x-3">
            <FontAwesome
              name="info-circle"
              size={20}
              className="text-info-600 mt-1"
            />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-info-900 dark:text-info-100 mb-2">
                Selfie with KTP Instructions:
              </Text>
              <View className="space-y-1">
                <Text className="text-sm text-info-700 dark:text-info-200">
                  • Hold your KTP next to your face
                </Text>
                <Text className="text-sm text-info-700 dark:text-info-200">
                  • Make sure both your face and KTP are clearly visible
                </Text>
                <Text className="text-sm text-info-700 dark:text-info-200">
                  • Ensure good lighting for clear photo
                </Text>
                <Text className="text-sm text-info-700 dark:text-info-200">
                  • Keep your face neutral and look at the camera
                </Text>
              </View>
            </View>
          </View>
        </Box>

        {/* Example Image */}
        <Box className="bg-background-50 dark:bg-background-900 p-4 rounded-lg border border-outline-200 dark:border-outline-700">
          <Text className="text-sm font-semibold text-typography-900 dark:text-typography-50 mb-3 text-center">
            Example of correct selfie:
          </Text>

          <View className="items-center">
            <View className="w-32 h-40 bg-background-200 dark:bg-background-700 rounded-lg items-center justify-center">
              <FontAwesome
                name="user"
                size={32}
                className="text-typography-400"
              />
              <Text className="text-xs text-typography-400 mt-2">Example</Text>
            </View>
          </View>
        </Box>

        {/* Selfie Photo Upload */}
        <Box className="space-y-3">
          <Text className="text-lg font-semibold text-typography-900 dark:text-typography-50">
            Selfie with KTP
          </Text>

          {formData.linkSelfieKtp ? (
            <View className="space-y-3">
              <Image
                source={{ uri: formData.linkSelfieKtp }}
                className="w-full h-64 rounded-lg"
                alt="Selfie with KTP Preview"
              />

              <View className="flex-row space-x-3">
                <Button
                  variant="outline"
                  onPress={takeSelfiePhoto}
                  disabled={isUploadingSelfie}
                  className="flex-1 py-3"
                >
                  <View className="flex-row items-center space-x-2">
                    <FontAwesome name="camera" size={16} />
                    <ButtonText className="text-primary-500">Retake</ButtonText>
                  </View>
                </Button>

                <Button
                  variant="outline"
                  onPress={pickSelfieImage}
                  disabled={isUploadingSelfie}
                  className="flex-1 py-3"
                >
                  <View className="flex-row items-center space-x-2">
                    <FontAwesome name="photo" size={16} />
                    <ButtonText className="text-primary-500">
                      Gallery
                    </ButtonText>
                  </View>
                </Button>
              </View>
            </View>
          ) : (
            <View className="space-y-3">
              <Button
                variant="outline"
                onPress={takeSelfiePhoto}
                disabled={isUploadingSelfie}
                className="w-full py-8 border-dashed border-2"
              >
                <View className="items-center space-y-2">
                  <FontAwesome
                    name={isUploadingSelfie ? "spinner" : "camera"}
                    size={24}
                    className="text-primary-500"
                  />
                  <ButtonText className="text-primary-500">
                    {isUploadingSelfie
                      ? "Processing..."
                      : "Take Selfie with KTP"}
                  </ButtonText>
                </View>
              </Button>

              <Text className="text-center text-typography-400">or</Text>

              <Button
                variant="outline"
                onPress={pickSelfieImage}
                disabled={isUploadingSelfie}
                className="w-full py-4"
              >
                <View className="flex-row items-center justify-center space-x-2">
                  <FontAwesome
                    name="photo"
                    size={20}
                    className="text-primary-500"
                  />
                  <ButtonText className="text-primary-500">
                    Choose from Gallery
                  </ButtonText>
                </View>
              </Button>
            </View>
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
