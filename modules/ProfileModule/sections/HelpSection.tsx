import React from "react";
import { Text, View } from "@/components/Themed";
import { Button, ButtonText } from "@/components/ui/button";

export default function HelpSection() {
  return (
    <View className="bg-white dark:bg-gray-800 p-4 rounded-lg">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Help
          </Text>
          <Text className="text-sm text-gray-600">
            Need assistance? Our support team is here to help.
          </Text>
        </View>
        <Button size="md">
          <ButtonText>Chat with CS</ButtonText>
        </Button>
      </View>
    </View>
  );
}
