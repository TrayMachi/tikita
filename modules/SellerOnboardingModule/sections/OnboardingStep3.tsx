import React, { useState } from "react";
import { ScrollView, Alert, Pressable } from "react-native";
import { View, Text } from "react-native";
import { Camera } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import * as ImagePicker from "expo-image-picker";
import { Image } from "@/components/ui/image";
import type { OnboardingStepProps } from "@/types/seller";
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import { Center } from "@/components/ui/center";

export default function OnboardingStep3({
  formData,
  updateFormData,
}: OnboardingStepProps) {
  const [isUploadingSelfie, setIsUploadingSelfie] = useState(false);

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

  return (
    <ScrollView className="flex-1 px-6 py-4">
      <VStack className="gap-6">
        {/* Instructions */}
        <Box className="bg-primary-50 p-4 rounded-xl">
          <View className="flex-row items-start space-x-3">
            <View className="flex-1">
              <Text className="text-sm font-poppins-semibold text-black mb-2">
                Instruksi Selfie dengan KTP:
              </Text>
              <View className="space-y-1">
                <Text className="text-sm text-info-700 dark:text-info-200">
                  • Letakkan KTP di depan wajah Anda
                </Text>
                <Text className="text-sm text-info-700 dark:text-info-200">
                  • Pastikan wajah dan KTP terlihat jelas
                </Text>
                <Text className="text-sm text-info-700 dark:text-info-200">
                  • Pastikan cahaya cukup untuk foto yang jelas
                </Text>
                <Text className="text-sm text-info-700 dark:text-info-200">
                  • Pastikan wajah Anda netral dan tegak ke arah kamera
                </Text>
              </View>
            </View>
          </View>
        </Box>

        {/* Example Image */}
        <Center>
          <Image
            source={require("@/assets/images/SelfieKtp.png")}
            className="w-[134px] h-[158px] object-contain"
            alt="Selfie with KTP Preview"
          />
        </Center>

        {/* Selfie Photo Upload */}
        <Box className="space-y-3">
          <Text className="text-lg font-poppins-semibold text-typography-900 dark:text-typography-50">
            Selfie dengan KTP
          </Text>

          {formData.linkSelfieKtp ? (
            <VStack space="md">
              <Image
                source={{ uri: formData.linkSelfieKtp }}
                className="w-full h-48 rounded-lg border border-outline-200"
                alt="KTP Preview"
              />
              <Pressable
                onPress={takeSelfiePhoto}
                disabled={isUploadingSelfie}
                className="w-full py-8 border-dashed border-2 border-primary-300 rounded-xl"
              >
                <VStack className="items-center" space="sm">
                  <Box className="bg-[#B6D0FD] rounded-full p-2">
                    <Icon as={Camera} size="xl" className="text-primary-500" />
                  </Box>
                  <Text className="text-primary-500">
                    {isUploadingSelfie ? "Mengunggah..." : "Ambil Ulang"}
                  </Text>
                </VStack>
              </Pressable>
            </VStack>
          ) : (
            <Pressable
              onPress={takeSelfiePhoto}
              disabled={isUploadingSelfie}
              className="w-full py-8 border-dashed border-2 border-primary-300 rounded-xl"
            >
              <VStack className="items-center" space="sm">
                <Box className="bg-[#B6D0FD] rounded-full p-2">
                  <Icon as={Camera} size="xl" className="text-primary-500" />
                </Box>
                <Text className="text-primary-500">
                  {isUploadingSelfie
                    ? "Mengunggah..."
                    : "Ambil Selfie dengan KTP"}
                </Text>
              </VStack>
            </Pressable>
          )}
        </Box>
      </VStack>
    </ScrollView>
  );
}
