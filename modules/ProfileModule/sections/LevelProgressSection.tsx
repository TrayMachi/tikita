import React from "react";
import { Text, View } from "@/components/Themed";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";

export default function LevelProgressSection() {
  return (
    <View className="bg-white dark:bg-gray-800 p-4 rounded-lg">
      <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Level Progress
      </Text>
      <Progress value={33} size="md" orientation="horizontal">
        <ProgressFilledTrack className="bg-yellow-500" />
      </Progress>
      <View className="flex-row justify-between">
        <Text className="text-sm text-yellow-600 font-medium">50%</Text>
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          Silver
        </Text>
      </View>
    </View>
  );
}
