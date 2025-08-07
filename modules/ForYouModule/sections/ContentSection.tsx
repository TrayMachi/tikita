import React from "react";
import { Text, View } from "@/components/Themed";

export default function ContentSection() {
  return (
    <View className="flex-1 items-center justify-center px-4 py-8">
      <Text className="text-3xl font-heading text-typography-900 dark:text-typography-50 mb-2">
        For You
      </Text>
      <Text className="text-base font-body text-typography-700 dark:text-typography-200 text-center mb-8">
        Discover personalized content and recommendations
      </Text>
    </View>
  );
}
