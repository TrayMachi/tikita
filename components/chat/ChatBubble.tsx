import React from "react";
import { View, Text } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Badge, BadgeText } from "@/components/ui/badge";
import { BargainMessage } from "@/types/bargain";

interface ChatBubbleProps {
  message: BargainMessage;
  isOwn: boolean;
  onAcceptOffer?: (price: number) => void;
  onRejectOffer?: () => void;
  onCounterOffer?: (price: number) => void;
}

export function ChatBubble({
  message,
  isOwn,
  onAcceptOffer,
  onRejectOffer,
  onCounterOffer,
}: ChatBubbleProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderOfferMessage = () => {
    if (!message.offer_price) return null;

    return (
      <VStack space="sm" className="mt-2">
        <Box className="bg-primary-50 dark:bg-primary-900 p-3 rounded-lg border border-primary-200 dark:border-primary-800">
          <HStack space="sm" className="items-center">
            <Badge variant="solid" className="bg-primary-500">
              <BadgeText className="text-white text-xs">
                {message.message_type === "offer"
                  ? "PENAWARAN"
                  : message.message_type === "counter_offer"
                  ? "TAWAR BALIK"
                  : "PENAWARAN"}
              </BadgeText>
            </Badge>
            <Text className="text-primary-700 dark:text-primary-300 font-semibold text-lg">
              {formatPrice(message.offer_price)}
            </Text>
          </HStack>
        </Box>

        {!isOwn && message.message_type === "offer" && (
          <HStack space="sm" className="mt-2">
            <Button
              size="sm"
              variant="solid"
              className="bg-success-500 flex-1"
              onPress={() => onAcceptOffer?.(message.offer_price!)}
            >
              <ButtonText className="text-white text-sm">Terima</ButtonText>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-error-500 flex-1"
              onPress={() => onRejectOffer?.()}
            >
              <ButtonText className="text-error-500 text-sm">Tolak</ButtonText>
            </Button>
          </HStack>
        )}

        {!isOwn && message.message_type === "counter_offer" && (
          <Button
            size="sm"
            variant="outline"
            className="border-primary-500 mt-2"
            onPress={() => onCounterOffer?.(message.offer_price!)}
          >
            <ButtonText className="text-primary-500 text-sm">
              Tawar Balik
            </ButtonText>
          </Button>
        )}
      </VStack>
    );
  };

  const renderSystemMessage = () => {
    if (message.message_type !== "system") return null;

    return (
      <Box className="mx-auto my-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
        <Text className="text-gray-600 dark:text-gray-400 text-sm text-center">
          {message.content}
        </Text>
      </Box>
    );
  };

  const renderStatusMessage = () => {
    if (!["accept", "reject"].includes(message.message_type)) return null;

    const isAccept = message.message_type === "accept";

    return (
      <Box
        className={`mx-auto my-2 px-4 py-2 rounded-full ${
          isAccept
            ? "bg-success-100 dark:bg-success-900"
            : "bg-error-100 dark:bg-error-900"
        }`}
      >
        <HStack space="sm" className="items-center">
          <Badge
            variant="solid"
            className={isAccept ? "bg-success-500" : "bg-error-500"}
          >
            <BadgeText className="text-white text-xs">
              {isAccept ? "DITERIMA" : "DITOLAK"}
            </BadgeText>
          </Badge>
          {message.offer_price && (
            <Text
              className={`font-semibold ${
                isAccept
                  ? "text-success-700 dark:text-success-300"
                  : "text-error-700 dark:text-error-300"
              }`}
            >
              {formatPrice(message.offer_price)}
            </Text>
          )}
        </HStack>
      </Box>
    );
  };

  if (message.message_type === "system") {
    return renderSystemMessage();
  }

  if (["accept", "reject"].includes(message.message_type)) {
    return renderStatusMessage();
  }

  return (
    <HStack
      space="sm"
      className={`mb-4 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      <Box
        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
          isOwn
            ? "bg-primary-500 rounded-br-md"
            : "bg-gray-200 dark:bg-gray-700 rounded-bl-md"
        }`}
      >
        <VStack space="xs">
          {message.content && (
            <Text
              className={`${
                isOwn ? "text-white" : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {message.content}
            </Text>
          )}

          {renderOfferMessage()}

          <Text
            className={`text-xs mt-1 ${
              isOwn ? "text-primary-100" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {new Date(message.created_at).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </VStack>
      </Box>
    </HStack>
  );
}
