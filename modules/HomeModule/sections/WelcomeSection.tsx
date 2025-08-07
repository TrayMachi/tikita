import React from "react";
import { Text, View } from "@/components/Themed";

export default function WelcomeSection() {
  return (
    <View className="flex-1 items-center justify-center px-4 py-8">
      <Text className="text-3xl font-heading text-typography-900 dark:text-typography-50 mb-2">
        Welcome to Tikita
      </Text>
      <Text className="text-base font-body text-typography-700 dark:text-typography-200 text-center mb-8">
        Your ticket marketplace is ready to go
      </Text>
    </View>
  );
}
