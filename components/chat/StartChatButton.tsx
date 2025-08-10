import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { TicketDB } from "@/types/ticket";
import { createBargainChat, getUserChats } from "@/services/bargainService";
import { useAuth } from "@/contexts/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface StartChatButtonProps {
  ticket: TicketDB;
  variant?: "solid" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function StartChatButton({
  ticket,
  variant = "solid",
  size = "md",
  disabled = false,
}: StartChatButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    if (!user) {
      Alert.alert(
        "Login Required",
        "Anda harus login terlebih dahulu untuk memulai negosiasi",
        [
          { text: "Batal", style: "cancel" },
          { text: "Login", onPress: () => router.push("/auth/login") },
        ]
      );
      return;
    }

    if (user.id === ticket.seller_id) {
      Alert.alert(
        "Info",
        "Anda tidak dapat bernegosiasi dengan tiket Anda sendiri"
      );
      return;
    }

    if (ticket.sold) {
      Alert.alert("Info", "Tiket ini sudah terjual");
      return;
    }

    try {
      setLoading(true);

      // Check if chat already exists
      const userChats = await getUserChats(user.id);
      const existingChat = userChats.find(
        (chat) => chat.ticket_id === ticket.id && chat.buyer_id === user.id
      );

      if (existingChat) {
        // Navigate to existing chat
        router.push(`/penawaran/${existingChat.id}`);
        return;
      }

      // Create new chat
      const newChat = await createBargainChat(
        ticket.id,
        user.id,
        ticket.seller_id
      );

      // Navigate to the new chat
      router.push(`/penawaran/${newChat.id}`);
    } catch (error: any) {
      console.error("Error starting chat:", error);

      if (error.message?.includes("already exists")) {
        Alert.alert("Info", "Chat untuk tiket ini sudah ada");
      } else {
        Alert.alert("Error", "Gagal memulai chat. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled
        className={`${
          variant === "solid" ? "bg-primary-500" : "border-primary-500"
        } opacity-70`}
      >
        <HStack space="sm" className="items-center">
          <Spinner size="small" />
          <ButtonText
            className={variant === "solid" ? "text-white" : "text-primary-500"}
          >
            Memulai Chat...
          </ButtonText>
        </HStack>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      className={variant === "solid" ? "bg-primary-500" : "border-primary-500"}
      onPress={handleStartChat}
    >
      <HStack space="sm" className="items-center">
        <FontAwesome
          name="comments"
          size={16}
          color={variant === "solid" ? "white" : "#3B82F6"}
        />
        <ButtonText
          className={variant === "solid" ? "text-white" : "text-primary-500"}
        >
          Tawar Harga
        </ButtonText>
      </HStack>
    </Button>
  );
}
