import React from "react";
import { Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import { Box } from "@/components/ui/box";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function ReferralSection() {
  return (
    <View className="bg-white dark:bg-gray-800 p-4 rounded-lg">
      <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Your Referral Code
      </Text>
      <Text className="text-sm text-gray-600 mb-3">
        Ajak temanmu download Tiketin & dapatkan diskon sampai 10%! 🎉
      </Text>
      <View className="flex-row items-center gap-x-3">
        <Box className="flex-1 bg-yellow-500 px-4 py-3 rounded-lg">
          <Text className="text-white font-bold text-center">
            TIKETIN_ELLENHSD
          </Text>
        </Box>
        <Pressable className="bg-yellow-500 p-3 rounded-lg">
          <FontAwesome name="share" size={16} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
