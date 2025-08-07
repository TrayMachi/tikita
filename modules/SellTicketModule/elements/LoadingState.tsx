import React from "react";
import { ActivityIndicator } from "react-native";
import { View, Text } from "@/components/Themed";

export default function LoadingState() {
  return (
    <View className="flex-1 items-center justify-center bg-background-0 dark:bg-background-950">
      <ActivityIndicator size="large" color="#007AFF" />
      <Text className="text-typography-600 dark:text-typography-300 mt-4">
        Loading...
      </Text>
    </View>
  );
}
