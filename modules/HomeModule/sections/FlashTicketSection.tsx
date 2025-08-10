import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { TicketDB } from "@/types/ticket";
import { Zap } from "lucide-react-native";
import TicketCard from "../elements/TicketCard";

interface FlashTicketSectionProps {
  tickets: TicketDB[];
  onTicketPress?: (ticket: TicketDB) => void;
  onSeeAllPress?: () => void;
}

export default function FlashTicketSection({
  tickets,
  onTicketPress,
  onSeeAllPress,
}: FlashTicketSectionProps) {
  if (tickets.length === 0) {
    return null;
  }

  return (
    <View className="mb-6">
      {/* Header */}
      <View className="px-4 mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Zap size={20} color="#EAB308" />
          <Text className="text-2xl font-poppins-bold text-gray-900 dark:text-white ml-2">
            Flash Ticket
          </Text>
        </View>

        <Pressable onPress={onSeeAllPress}>
          <Text className="text-sm text-purple-600 dark:text-purple-400 font-medium">
            See All
          </Text>
        </Pressable>
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
        {tickets.map((ticket, index) => {
          if (ticket.sold) {
            return null;
          }

          return (
            <View
              key={ticket.id}
              className={index < tickets.length - 1 ? "mr-4" : ""}
            >
              <TicketCard
                ticket={ticket}
                onPress={() => onTicketPress?.(ticket)}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
