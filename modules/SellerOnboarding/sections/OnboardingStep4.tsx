import React from "react";
import { View, Text } from "@/components/Themed";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { OnboardingStepProps } from "@/types/seller";

export default function OnboardingStep4({
  onNext,
  onPrevious,
  formData,
}: OnboardingStepProps) {
  return (
    <View className="flex-1 px-6 py-8">
      <View className="flex-1 justify-center items-center space-y-8">
        {/* Success Icon */}
        <View className="bg-success-100 dark:bg-success-900 p-6 rounded-full">
          <FontAwesome
            name="check-circle"
            size={64}
            className="text-success-600 dark:text-success-400"
          />
        </View>

        {/* Progress Bar */}
        <View className="w-full bg-background-200 dark:bg-background-700 rounded-full h-2">
          <View className="bg-success-500 h-2 rounded-full w-full" />
        </View>

        {/* Title */}
        <Text className="text-3xl font-heading text-center text-typography-900 dark:text-typography-50">
          Congratulations!
        </Text>

        {/* Description */}
        <Text className="text-base font-body text-center text-typography-700 dark:text-typography-200 leading-6 max-w-sm">
          Your seller application has been submitted successfully. We'll review
          your documents and notify you once verified.
        </Text>

        {/* Application Summary */}
        <Box className="bg-background-50 dark:bg-background-900 p-6 rounded-lg border border-outline-200 dark:border-outline-700 w-full">
          <Text className="text-lg font-semibold text-typography-900 dark:text-typography-50 mb-4 text-center">
            Application Summary
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-typography-600 dark:text-typography-300">
                Full Name:
              </Text>
              <Text className="text-sm font-semibold text-typography-900 dark:text-typography-50 flex-1 text-right">
                {formData.nama}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-typography-600 dark:text-typography-300">
                NIK:
              </Text>
              <Text className="text-sm font-mono text-typography-900 dark:text-typography-50">
                {formData.NIK}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-typography-600 dark:text-typography-300">
                KTP Photo:
              </Text>
              <View className="flex-row items-center space-x-1">
                <FontAwesome
                  name="check"
                  size={14}
                  className="text-success-500"
                />
                <Text className="text-sm text-success-500">Uploaded</Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-typography-600 dark:text-typography-300">
                Selfie with KTP:
              </Text>
              <View className="flex-row items-center space-x-1">
                <FontAwesome
                  name="check"
                  size={14}
                  className="text-success-500"
                />
                <Text className="text-sm text-success-500">Uploaded</Text>
              </View>
            </View>
          </View>
        </Box>

        {/* Next Steps */}
        <Box className="bg-info-50 dark:bg-info-900 p-4 rounded-lg border border-info-200 dark:border-info-700 w-full">
          <Text className="text-lg font-semibold text-info-900 dark:text-info-100 mb-3 text-center">
            What's Next?
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-start space-x-3">
              <FontAwesome
                name="clock-o"
                size={16}
                className="text-info-600 mt-1"
              />
              <Text className="text-sm text-info-700 dark:text-info-200 flex-1">
                Our team will review your documents within 1-3 business days
              </Text>
            </View>

            <View className="flex-row items-start space-x-3">
              <FontAwesome
                name="bell"
                size={16}
                className="text-info-600 mt-1"
              />
              <Text className="text-sm text-info-700 dark:text-info-200 flex-1">
                You'll receive a notification once your account is verified
              </Text>
            </View>

            <View className="flex-row items-start space-x-3">
              <FontAwesome
                name="ticket"
                size={16}
                className="text-info-600 mt-1"
              />
              <Text className="text-sm text-info-700 dark:text-info-200 flex-1">
                Once verified, you can start listing tickets for sale
              </Text>
            </View>
          </View>
        </Box>
      </View>

      {/* Navigation Buttons */}
      <View className="flex-row space-x-4">
        <Button variant="outline" onPress={onPrevious} className="flex-1 py-4">
          <ButtonText className="text-primary-500">Back</ButtonText>
        </Button>

        <Button onPress={onNext}>
          <ButtonText className="text-white font-semibold">
            Complete Registration
          </ButtonText>
        </Button>
      </View>
    </View>
  );
}
