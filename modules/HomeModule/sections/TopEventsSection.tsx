import React from "react";
import { View, Text, ScrollView } from "react-native";
import { TicketDB } from "@/types/ticket";
import { Star } from "lucide-react-native";
import TicketCard from "../elements/TicketCard";

interface TopEventsSectionProps {
  tickets: TicketDB[];
  onTicketPress?: (ticket: TicketDB) => void;
}

export default function TopEventsSection({
  tickets,
  onTicketPress,
}: TopEventsSectionProps) {
  if (tickets.length === 0) {
    return (
      <View className="px-4 mb-6">
        <Text className="text-2xl font-poppins-bold text-gray-900 dark:text-white mb-4">
          Top Event
        </Text>
        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 items-center">
          <Star size={48} color="#D1D5DB" />
          <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
            No events available at the moment
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-6">
      {/* Header */}
      <View className="px-4 mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-poppins-bold text-gray-900 dark:text-white">
          Top Event
        </Text>
      </View>

      {/* Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 32 }}
        className="mb-2"
        decelerationRate="fast"
        snapToInterval={200}
        snapToAlignment="start"
      >
        {tickets.map((ticket, index) => (
          <View
            key={ticket.id}
            className={index < tickets.length - 1 ? "mr-4" : ""}
          >
            <TicketCard
              ticket={ticket}
              onPress={() => onTicketPress?.(ticket)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
