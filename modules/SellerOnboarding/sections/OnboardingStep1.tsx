import React from "react";
import { ScrollView } from "react-native";
import { View, Text } from "react-native";
import { Card } from "@/components/ui/card";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { OnboardingStepProps } from "@/types/seller";

export default function OnboardingStep1({}: OnboardingStepProps) {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-background-950">
      <VStack className="px-6 pt-3" space="lg">
        {/* Welcome Message */}
        <VStack className="items-center" space="md">
          <View className="bg-primary-100 dark:bg-primary-900 p-4 rounded-full">
            <FontAwesome
              name="id-card"
              size={48}
              color="#5994FB"
            />
          </View>

          <VStack className="items-center" space="sm">
            <Text className="text-xl font-poppins-semibold text-center text-typography-900 dark:text-typography-50">
              Daftar Sebagai Seller
            </Text>
            <Text className="text-base text-center text-[#464646] max-w-sm">
              Untuk mulai menjual tiket di Tikita, kami perlu memverifikasi
              identitas Anda terlebih dahulu.
            </Text>
          </VStack>
        </VStack>

        {/* Requirements Card */}
        <Card className="bg-white border border-[#5994FB70] p-5">
          <VStack space="md">
            <Text className="text-lg font-poppins-semibold text-typography-900 dark:text-typography-50">
              Yang Anda Butuhkan:
            </Text>

            <VStack space="sm">
              <HStack className="items-center" space="sm">
                <FontAwesome
                  name="check-circle"
                  size={20}
                  className="text-success-600"
                />
                <Text className="text-sm text-typography-700 dark:text-typography-200 flex-1">
                  Foto KTP yang jelas dan dapat dibaca
                </Text>
              </HStack>

              <HStack className="items-center" space="sm">
                <FontAwesome
                  name="check-circle"
                  size={20}
                  className="text-success-600"
                />
                <Text className="text-sm text-typography-700 dark:text-typography-200 flex-1">
                  Foto selfie dengan memegang KTP
                </Text>
              </HStack>

              <HStack className="items-center" space="sm">
                <FontAwesome
                  name="check-circle"
                  size={20}
                  className="text-success-600"
                />
                <Text className="text-sm text-typography-700 dark:text-typography-200 flex-1">
                  NIK (Nomor Induk Kependudukan) yang valid
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </Card>

        {/* Tips Card */}
        <Card className="bg-[#5994FB70] p-5">
          <HStack className="items-start" space="sm">
            <FontAwesome
              name="lightbulb-o"
              size={20}
              className="text-info-600 mt-1"
            />
            <VStack className="flex-1" space="sm">
              <Text className="text-sm font-poppins-semibold text-info-900 dark:text-info-100">
                Tips untuk hasil terbaik:
              </Text>
              <Text className="text-sm text-info-700 dark:text-info-200">
                Pastikan foto diambil dengan pencahayaan yang baik dan semua
                teks pada KTP terlihat jelas. Hindari bayangan atau pantulan.
              </Text>
            </VStack>
          </HStack>
        </Card>

        {/* Process Info */}
        <Card className="bg-[#FFC22E61] p-5">
          <HStack className="items-start" space="sm">
            <FontAwesome
              name="clock-o"
              size={20}
              className="text-warning-600 mt-1"
            />
            <VStack className="flex-1" space="sm">
              <Text className="text-sm font-poppins-semibold text-warning-900 dark:text-warning-100">
                Proses Verifikasi:
              </Text>
              <Text className="text-sm text-warning-700 dark:text-warning-200">
                Setelah dokumen Anda dikirim, tim kami akan melakukan verifikasi
                dalam 1-3 hari kerja. Anda akan mendapat notifikasi setelah akun
                diverifikasi.
              </Text>
            </VStack>
          </HStack>
        </Card>
      </VStack>
    </ScrollView>
  );
}
