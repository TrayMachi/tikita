import React from "react";
import { View, Text } from "@/components/Themed";

export default function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center px-4 bg-background-0 dark:bg-background-950">
      <Text className="text-xl font-heading text-error-600 mb-2">Error</Text>
      <Text className="text-base text-typography-700 dark:text-typography-200 text-center mb-4">
        {error}
      </Text>
      <Text className="text-primary-500 text-center" onPress={onRetry}>
        Retry
      </Text>
    </View>
  );
}
