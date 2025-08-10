import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { Badge, BadgeText } from "@/components/ui/badge";
import { BargainChatWithDetails } from "@/types/bargain";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface ChatListItemProps {
  chat: BargainChatWithDetails;
  currentUserId: string;
  onPress: () => void;
}

export function ChatListItem({
  chat,
  currentUserId,
  onPress,
}: ChatListItemProps) {
  const isBuyer = chat.buyer_id === currentUserId;
  const otherUser = isBuyer ? chat.seller : chat.buyer;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatLastMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Baru saja";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}j`;
    if (diffInDays < 7) return `${diffInDays}h`;

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getLastMessageText = () => {
    if (!chat.last_message) return "Belum ada pesan";

    const msg = chat.last_message;

    switch (msg.message_type) {
      case "offer":
        return `💰 Penawaran: ${formatPrice(msg.offer_price || 0)}`;
      case "counter_offer":
        return `💰 Tawar balik: ${formatPrice(msg.offer_price || 0)}`;
      case "accept":
        return "✅ Penawaran diterima";
      case "reject":
        return "❌ Penawaran ditolak";
      case "system":
        return msg.content;
      default:
        return msg.content || "Pesan baru";
    }
  };

  const getStatusColor = () => {
    switch (chat.status) {
      case "active":
        return "bg-blue-500";
      case "accepted":
        return "bg-success-500";
      case "rejected":
        return "bg-error-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = () => {
    switch (chat.status) {
      case "active":
        return "Aktif";
      case "accepted":
        return "Diterima";
      case "rejected":
        return "Ditolak";
      case "completed":
        return "Selesai";
      default:
        return "Tidak diketahui";
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Box className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
        <HStack space="md" className="items-start">
          {/* Ticket Image */}
          <Box className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
            {chat.ticket.thumbnail ? (
              <Image
                source={{ uri: chat.ticket.thumbnail }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <FontAwesome name="image" size={16} color="#9CA3AF" />
              </View>
            )}
          </Box>

          {/* Chat Content */}
          <VStack space="xs" className="flex-1">
            <HStack space="sm" className="items-start justify-between">
              <VStack space="xs" className="flex-1">
                <Text
                  className="text-gray-900 dark:text-gray-100 font-semibold text-base"
                  numberOfLines={1}
                >
                  {chat.ticket.name}
                </Text>
                <HStack space="sm" className="items-center">
                  <Text className="text-gray-600 dark:text-gray-400 text-sm">
                    {isBuyer ? "Dengan:" : "Dari:"} {otherUser.name}
                  </Text>
                  <Badge variant="solid" className={getStatusColor()}>
                    <BadgeText className="text-white text-xs">
                      {getStatusText()}
                    </BadgeText>
                  </Badge>
                </HStack>
              </VStack>

              <VStack space="xs" className="items-end">
                <Text className="text-gray-500 dark:text-gray-400 text-xs">
                  {chat.last_message
                    ? formatLastMessageTime(chat.last_message.created_at)
                    : ""}
                </Text>
                {chat.unread_count && chat.unread_count > 0 && (
                  <Badge
                    variant="solid"
                    className="bg-primary-500 min-w-[20px] h-5 rounded-full"
                  >
                    <BadgeText className="text-white text-xs">
                      {chat.unread_count > 99 ? "99+" : chat.unread_count}
                    </BadgeText>
                  </Badge>
                )}
              </VStack>
            </HStack>

            {/* Last Message */}
            <Text
              className="text-gray-600 dark:text-gray-400 text-sm mt-1"
              numberOfLines={1}
            >
              {getLastMessageText()}
            </Text>

            {/* Price Info */}
            <HStack space="sm" className="items-center justify-between mt-1">
              <HStack space="sm" className="items-center">
                <FontAwesome name="tag" size={12} color="#6B7280" />
                <Text className="text-gray-600 dark:text-gray-400 text-xs">
                  {chat.ticket.category}
                </Text>
              </HStack>

              <HStack space="sm" className="items-center">
                {chat.final_price && chat.status === "accepted" ? (
                  <VStack>
                    <Text className="text-gray-400 text-xs line-through">
                      {formatPrice(chat.ticket.price)}
                    </Text>
                    <Text className="text-success-600 dark:text-success-400 font-semibold text-sm">
                      {formatPrice(chat.final_price)}
                    </Text>
                  </VStack>
                ) : (
                  <Text className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                    {formatPrice(chat.ticket.price)}
                  </Text>
                )}
              </HStack>
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
}
