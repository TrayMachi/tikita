import React from "react";
import { View, Text } from "@/components/Themed";

export default function SignInRequiredState() {
  return (
    <View className="flex-1 items-center justify-center px-4 bg-background-0 dark:bg-background-950">
      <Text className="text-2xl font-heading text-typography-900 dark:text-typography-50 mb-2">
        Sign in required
      </Text>
      <Text className="text-base text-typography-700 dark:text-typography-200 text-center">
        Please sign in to continue
      </Text>
    </View>
  );
}
