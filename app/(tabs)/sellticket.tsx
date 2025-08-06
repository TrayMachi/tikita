import React from "react";
import { ScrollView } from "react-native";
import { Text, View } from "@/components/Themed";

export default function SellTicketScreen() {
  return (
    <ScrollView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 items-center justify-center px-4 py-8">
        <Text className="text-3xl font-heading text-typography-900 dark:text-typography-50 mb-2">
          Sell Ticket
        </Text>
        <Text className="text-base font-body text-typography-700 dark:text-typography-200 text-center mb-8">
          List your tickets for sale and reach potential buyers
        </Text>
      </View>
    </ScrollView>
  );
}
