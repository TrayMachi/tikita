import React, { useState } from "react";
import { ScrollView, Alert, Text, Pressable } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { FormInput } from "@/components/ui/FormInput";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { Image } from "@/components/ui/image";
import type { OnboardingStepProps } from "@/types/seller";
import { checkNIKAvailability } from "@/services/sellerService";
import { AddIcon, CircleIcon, Icon, RepeatIcon } from "@/components/ui/icon";

export default function OnboardingStep2({
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
        updateFormData({ linkKtp: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    } finally {
      setIsUploadingKtp(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-background-950">
      <VStack className="px-6 py-6" space="lg">
        {/* Description */}
        <VStack className="items-center" space="sm">
          <Text className="text-base text-center text-typography-600 dark:text-typography-300">
            Masukkan informasi identitas Anda sesuai dengan KTP untuk
            verifikasi.
          </Text>
        </VStack>

        {/* NIK Input */}
        <VStack space="sm">
          <FormInput
            label="NIK (Nomor Induk Kependudukan)"
            placeholder="Masukkan NIK 16 digit"
            value={formData.NIK}
            onChangeText={handleNikChange}
            keyboardType="numeric"
            maxLength={16}
            error={nikError}
          />

          {isCheckingNik && (
            <HStack className="items-center ml-1" space="sm">
              <FontAwesome
                name="spinner"
                size={16}
                className="text-primary-500"
              />
              <Text className="text-sm text-primary-500">
                Memeriksa ketersediaan NIK...
              </Text>
            </HStack>
          )}

          {formData.NIK.length === 16 && !nikError && !isCheckingNik && (
            <HStack className="items-center ml-1" space="sm">
              <FontAwesome
                name="check-circle"
                size={16}
                className="text-success-500"
              />
              <Text className="text-sm text-success-500">NIK tersedia</Text>
            </HStack>
          )}
        </VStack>

        {/* Full Name Input */}
        <VStack space="xs">
          <FormInput
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap Anda"
            value={formData.nama}
            onChangeText={(nama) => updateFormData({ nama })}
          />
          <Text className="text-sm text-typography-600 dark:text-typography-300 ml-1">
            Sesuai dengan yang tertera di KTP
          </Text>
        </VStack>

        {/* KTP Photo Upload */}
        <VStack space="sm">
          <Text className="text-lg font-semibold text-[#5A5A5A] dark:text-typography-50">
            Foto KTP <Text className="text-error-500">*</Text>
          </Text>

          {formData.linkKtp ? (
            <VStack space="md">
              <Image
                source={{ uri: formData.linkKtp }}
                className="w-full h-48 rounded-lg border border-outline-200"
                alt="KTP Preview"
              />

              <Pressable
                onPress={pickKtpImage}
                disabled={isUploadingKtp}
                className="w-full py-8 border-dashed border-2 border-primary-300 rounded-xl"
              >
                <VStack className="items-center" space="sm">
                  <Icon as={AddIcon} size="xl" className="text-primary-500 bg-[#B6D0FD] rounded-full p-2" />
                  <Text className="text-primary-500 font-medium">
                    {isUploadingKtp ? "Mengunggah..." : "Ganti Foto"}
                  </Text>
                  <Text className="text-sm text-typography-500">
                    Ketuk untuk mengambil atau memilih foto
                  </Text>
                </VStack>
              </Pressable>
            </VStack>
          ) : (
            <Pressable
              onPress={pickKtpImage}
              disabled={isUploadingKtp}
              className="w-full py-8 border-dashed border-2 border-primary-300 rounded-xl"
            >
              <VStack className="items-center" space="sm">
                <Icon as={AddIcon} size="xl" className="text-primary-500 bg-[#B6D0FD] rounded-full p-2" />
                <Text className="text-primary-500 font-medium">
                  {isUploadingKtp ? "Mengunggah..." : "Unggah Foto KTP Kamu"}
                </Text>
                <Text className="text-sm text-typography-500">
                  Ketuk untuk mengambil atau memilih foto
                </Text>
              </VStack>
            </Pressable>
          )}
        </VStack>
      </VStack>
    </ScrollView>
  );
}
