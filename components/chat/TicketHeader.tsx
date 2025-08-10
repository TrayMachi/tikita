import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { Badge, BadgeText } from "@/components/ui/badge";
import { TicketDB } from "@/types/ticket";
import { BargainChat } from "@/types/bargain";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface TicketHeaderProps {
  ticket: TicketDB;
  chat: BargainChat;
  onTicketPress?: () => void;
}

export function TicketHeader({
  ticket,
  chat,
  onTicketPress,
}: TicketHeaderProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Tanggal belum ditentukan";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = () => {
    switch (chat.status) {
      case "active":
        return (
          <Badge variant="solid" className="bg-blue-500">
            <BadgeText className="text-white text-xs">Aktif</BadgeText>
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="solid" className="bg-success-500">
            <BadgeText className="text-white text-xs">Diterima</BadgeText>
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="solid" className="bg-error-500">
            <BadgeText className="text-white text-xs">Ditolak</BadgeText>
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="solid" className="bg-gray-500">
            <BadgeText className="text-white text-xs">Selesai</BadgeText>
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity onPress={onTicketPress} disabled={!onTicketPress}>
      <Box className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
        <HStack space="md" className="items-start">
          {/* Ticket Image */}
          <Box className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
            {ticket.thumbnail ? (
              <Image
                source={{ uri: ticket.thumbnail }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <FontAwesome name="image" size={24} color="#9CA3AF" />
              </View>
            )}
          </Box>

          {/* Ticket Details */}
          <VStack space="xs" className="flex-1">
            <HStack space="sm" className="items-start justify-between">
              <Text
                className="text-gray-900 dark:text-gray-100 font-semibold text-base flex-1"
                numberOfLines={2}
              >
                {ticket.name}
              </Text>
              {getStatusBadge()}
            </HStack>

            <VStack space="xs">
              <HStack space="sm" className="items-center">
                <FontAwesome name="map-marker" size={14} color="#6B7280" />
                <Text
                  className="text-gray-600 dark:text-gray-400 text-sm flex-1"
                  numberOfLines={1}
                >
                  {ticket.location}, {ticket.city}
                </Text>
              </HStack>

              <HStack space="sm" className="items-center">
                <FontAwesome name="calendar" size={14} color="#6B7280" />
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  {formatDate(ticket.date)}
                </Text>
              </HStack>

              <HStack space="sm" className="items-center justify-between">
                <HStack space="sm" className="items-center">
                  <FontAwesome name="tag" size={14} color="#6B7280" />
                  <Text className="text-gray-600 dark:text-gray-400 text-sm">
                    {ticket.category}
                  </Text>
                </HStack>

                <VStack space="xs" className="items-end">
                  {chat.final_price && chat.status === "accepted" ? (
                    <>
                      <Text className="text-gray-500 dark:text-gray-400 text-xs line-through">
                        {formatPrice(ticket.price)}
                      </Text>
                      <Text className="text-success-600 dark:text-success-400 font-bold text-sm">
                        {formatPrice(chat.final_price)}
                      </Text>
                    </>
                  ) : (
                    <Text className="text-primary-600 dark:text-primary-400 font-bold text-sm">
                      {formatPrice(ticket.price)}
                    </Text>
                  )}
                </VStack>
              </HStack>
            </VStack>
          </VStack>
        </HStack>

        {/* Show negotiation status if applicable */}
        {chat.status === "accepted" && chat.final_price && (
          <Box className="mt-3 p-3 bg-success-50 dark:bg-success-900 rounded-lg border border-success-200 dark:border-success-800">
            <HStack space="sm" className="items-center">
              <FontAwesome name="check-circle" size={16} color="#10B981" />
              <Text className="text-success-700 dark:text-success-300 text-sm font-medium">
                Penawaran diterima dengan harga {formatPrice(chat.final_price)}
              </Text>
            </HStack>
          </Box>
        )}

        {onTicketPress && (
          <HStack space="sm" className="items-center mt-2">
            <Text className="text-primary-500 text-sm">Lihat detail tiket</Text>
            <FontAwesome name="chevron-right" size={12} color="#3B82F6" />
          </HStack>
        )}
      </Box>
    </TouchableOpacity>
  );
}
