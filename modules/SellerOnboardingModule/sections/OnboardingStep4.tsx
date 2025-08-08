import React from "react";
import { View, Text } from "react-native";
import { Box } from "@/components/ui/box";
import type { OnboardingStepProps } from "@/types/seller";
import { Bell, Check, CheckCircle, Clock, Ticket } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";

export default function OnboardingStep4({
  formData,
}: OnboardingStepProps) {
  return (
    <VStack className="px-6 py-8" space="md">
      {/* Success Icon */}
      <View className="bg-success-100 dark:bg-success-900 p-6 rounded-full">
        <Icon as={CheckCircle} size="xl" className="text-success-600" />
      </View>

      {/* Description */}
      <Text className="text-base font-body text-center text-[#5A5A5A] leading-6 max-w-sm">
        Selamat! Aplikasi seller Anda telah berhasil dikirim! Kami akan
        meninjau dokumen Anda dan memberi tahu setelah diverifikasi.
      </Text>

      {/* Application Summary */}
      <Box className="bg-white p-6 rounded-xl w-full shadow-md my-4">
        <Text className="text-lg font-poppins-semibold mb-4 text-center">
          Ringkasan Formulir
        </Text>

        <VStack space="sm">
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-[#5A5A5A]">
              Full Name:
            </Text>
            <Text className="text-sm font-semibold text-typography-900 dark:text-typography-50 flex-1 text-right">
              {formData.nama}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-[#5A5A5A]">
              NIK:
            </Text>
            <Text className="text-sm font-mono text-typography-900 dark:text-typography-50">
              {formData.NIK}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-[#5A5A5A]">
              KTP Photo:
            </Text>
            <HStack className="items-center" space="sm">
              <Text className="text-sm text-success-500">Uploaded</Text>
              <Icon as={Check} size="sm" className="text-success-500" />
            </HStack>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-[#5A5A5A]">
              Selfie with KTP:
            </Text>
            <HStack className="items-center" space="sm">
              <Text className="text-sm text-success-500">Uploaded</Text>
              <Icon as={Check} size="sm" className="text-success-500" />
            </HStack>
          </View>
        </VStack>
      </Box>

      {/* Next Steps */}
      <Box className="bg-primary-50 p-4 rounded-xl w-full">
        <Text className="text-lg font-poppins-semibold mb-3 text-center">
          Apa Selanjutnya?
        </Text>

        <VStack className="space-y-3">
          <HStack className="items-center" space="sm">
            <Icon as={Clock} size="sm" className="text-primary-500" />
            <Text className="text-sm text-primary-500 flex-1">
              Tim kami akan meninjau dokumen Anda dalam 1-3 hari kerja
            </Text>
          </HStack>

          <HStack className="items-center" space="sm">
            <Icon as={Bell} size="sm" className="text-primary-500" />
            <Text className="text-sm text-primary-500 flex-1">
              Anda akan menerima notifikasi setelah akun Anda diverifikasi
            </Text>
          </HStack>

          <HStack className="items-center" space="sm">
            <Icon as={Ticket} size="sm" className="text-primary-500" />
            <Text className="text-sm text-primary-500 flex-1">
              Setelah diverifikasi, Anda dapat memulai menjual tiket
            </Text>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
}
