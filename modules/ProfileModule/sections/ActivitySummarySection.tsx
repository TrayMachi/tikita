import React from "react";
import { Text, View } from "@/components/Themed";
import { Box } from "@/components/ui/box";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function ActivitySummarySection() {
  return (
    <View className="bg-white dark:bg-gray-800 p-4 rounded-lg">
      <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Activity Summary
      </Text>
      <View className="flex-row gap-x-3">
        <Box className="flex-1 bg-red-100 p-4 rounded-lg items-center">
          <FontAwesome name="heart" size={20} color="#EF4444" />
          <Text className="text-2xl font-bold text-gray-900 mt-2">10</Text>
          <Text className="text-sm text-gray-600">Wishlist</Text>
        </Box>
        <Box className="flex-1 bg-orange-100 p-4 rounded-lg items-center">
          <FontAwesome name="ticket" size={20} color="#F97316" />
          <Text className="text-2xl font-bold text-gray-900 mt-2">10</Text>
          <Text className="text-sm text-gray-600">Ticket Dibeli</Text>
        </Box>
        <Box className="flex-1 bg-yellow-100 p-4 rounded-lg items-center">
          <FontAwesome name="money" size={20} color="#F59E0B" />
          <Text className="text-sm font-bold text-gray-900 mt-2">
            Rp 10.000.000
          </Text>
          <Text className="text-xs text-gray-600 text-center">Penghasilan</Text>
        </Box>
      </View>
    </View>
  );
}
