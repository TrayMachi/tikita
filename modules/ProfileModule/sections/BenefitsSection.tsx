import React from "react";
import { Text, View } from "@/components/Themed";
import { Box } from "@/components/ui/box";

export default function BenefitsSection() {
  return (
    <View className="bg-white dark:bg-gray-800 p-4 rounded-lg">
      <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Silver Member
      </Text>
      <View className="flex-row gap-x-3">
        <Box className="flex-1 bg-yellow-100 p-4 rounded-lg">
          <Text className="text-2xl font-bold text-gray-900 mb-1">10%</Text>
          <Text className="text-sm text-gray-600">Silver Discount</Text>
        </Box>
        <Box className="flex-1 bg-blue-100 p-4 rounded-lg">
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            Rp 100.000
          </Text>
          <Text className="text-sm text-gray-600">Total Saved</Text>
        </Box>
      </View>
    </View>
  );
}
