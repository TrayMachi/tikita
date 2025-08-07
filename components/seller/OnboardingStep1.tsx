import React from "react";
import { View, Text } from "@/components/Themed";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { OnboardingStepProps } from "@/types/seller";

export default function OnboardingStep1({ onNext }: OnboardingStepProps) {
  return (
    <View className="flex-1 px-6 py-8">
      <View className="flex-1 justify-center items-center space-y-8">
        {/* Icon */}
        <View className="bg-primary-100 dark:bg-primary-900 p-6 rounded-full">
          <FontAwesome
            name="id-card"
            size={48}
            className="text-primary-600 dark:text-primary-400"
          />
        </View>

        {/* Title */}
        <Text className="text-3xl font-heading text-center text-typography-900 dark:text-typography-50">
          Become a Seller
        </Text>

        {/* Description */}
        <Text className="text-base font-body text-center text-typography-700 dark:text-typography-200 leading-6 max-w-sm">
          To start selling tickets on Tikita, we need to verify your identity.
          Please prepare your KTP (Identity Card) for the next steps.
        </Text>

        {/* Requirements */}
        <Box className="bg-background-50 dark:bg-background-900 p-4 rounded-lg border border-outline-200 dark:border-outline-700 w-full">
          <Text className="text-lg font-semibold text-typography-900 dark:text-typography-50 mb-3">
            What you'll need:
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-center space-x-3">
              <FontAwesome
                name="check-circle"
                size={20}
                className="text-success-600"
              />
              <Text className="text-sm text-typography-700 dark:text-typography-200 flex-1">
                Clear photo of your KTP (Identity Card)
              </Text>
            </View>

            <View className="flex-row items-center space-x-3">
              <FontAwesome
                name="check-circle"
                size={20}
                className="text-success-600"
              />
              <Text className="text-sm text-typography-700 dark:text-typography-200 flex-1">
                Selfie photo holding your KTP
              </Text>
            </View>

            <View className="flex-row items-center space-x-3">
              <FontAwesome
                name="check-circle"
                size={20}
                className="text-success-600"
              />
              <Text className="text-sm text-typography-700 dark:text-typography-200 flex-1">
                Valid NIK (Identity Number)
              </Text>
            </View>
          </View>
        </Box>

        {/* Tips */}
        <Box className="bg-info-50 dark:bg-info-900 p-4 rounded-lg border border-info-200 dark:border-info-700 w-full">
          <View className="flex-row items-start space-x-3">
            <FontAwesome
              name="lightbulb-o"
              size={20}
              className="text-info-600 mt-1"
            />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-info-900 dark:text-info-100 mb-1">
                Tips for best results:
              </Text>
              <Text className="text-sm text-info-700 dark:text-info-200">
                Make sure photos are well-lit and all text on your KTP is
                clearly readable.
              </Text>
            </View>
          </View>
        </Box>
      </View>

      {/* Next Button */}
      <Button
        onPress={onNext}
        size="md"
      >
        <ButtonText>
          I'm Ready, Let's Start
        </ButtonText>
      </Button>
    </View>
  );
}
