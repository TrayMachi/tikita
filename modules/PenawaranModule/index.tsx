import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { TicketHeader } from "@/components/chat/TicketHeader";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/contexts/AuthContext";
import {
  acceptOffer,
  getChatById,
  getChatMessages,
  getCurrentUserId,
  rejectOffer,
  sendMessage,
} from "@/services/bargainService";
import { BargainChatWithDetails, BargainMessage } from "@/types/bargain";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function PenawaranModule() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chatId = id || "chat-1"; // Default to chat-1 if no ID provided
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  const [chat, setChat] = useState<BargainChatWithDetails | null>(null);
  const [messages, setMessages] = useState<BargainMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const currentUserId = getCurrentUserId();
  const isBuyer = chat?.buyer_id === currentUserId;
  const otherUser = isBuyer ? chat?.seller : chat?.buyer;

  const loadChatData = useCallback(async () => {
    if (!chatId) return;

    try {
      setLoading(true);
      const [chatData, messagesData] = await Promise.all([
        getChatById(chatId),
        getChatMessages(chatId),
      ]);

      if (!chatData) {
        Alert.alert("Error", "Chat tidak ditemukan");
        router.back();
        return;
      }

      setChat(chatData);
      setMessages(messagesData);
    } catch (error) {
      console.error("Error loading chat data:", error);
      Alert.alert("Error", "Gagal memuat data chat");
      router.back();
    } finally {
      setLoading(false);
    }
  }, [chatId, router]);

  useEffect(() => {
    loadChatData();
  }, [loadChatData]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!chat || sending) return;

    try {
      setSending(true);
      const newMessage = await sendMessage(chatId!, currentUserId, content);
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Gagal mengirim pesan");
    } finally {
      setSending(false);
    }
  };

  const handleSendOffer = async (offerPrice: number) => {
    if (!chat || sending) return;

    try {
      setSending(true);
      const newMessage = await sendMessage(
        chatId!,
        currentUserId,
        `Saya ingin menawar dengan harga ${new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(offerPrice)}`,
        "offer",
        offerPrice
      );
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Error sending offer:", error);
      Alert.alert("Error", "Gagal mengirim penawaran");
    } finally {
      setSending(false);
    }
  };

  const handleAcceptOffer = async (offerPrice: number) => {
    if (!chat || sending) return;

    Alert.alert(
      "Konfirmasi",
      `Anda akan menerima penawaran sebesar ${new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(offerPrice)}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Terima",
          onPress: async () => {
            try {
              setSending(true);
              const newMessage = await acceptOffer(
                chatId!,
                currentUserId,
                offerPrice
              );
              setMessages((prev) => [...prev, newMessage]);

              // Update chat status
              setChat((prev) =>
                prev
                  ? {
                      ...prev,
                      status: "accepted",
                      final_price: offerPrice,
                    }
                  : null
              );

              Alert.alert(
                "Penawaran Diterima!",
                "Penawaran telah diterima. Silakan lanjutkan ke proses pembayaran.",
                [{ text: "OK" }]
              );
            } catch (error) {
              console.error("Error accepting offer:", error);
              Alert.alert("Error", "Gagal menerima penawaran");
            } finally {
              setSending(false);
            }
          },
        },
      ]
    );
  };

  const handleRejectOffer = async () => {
    if (!chat || sending) return;

    Alert.alert("Konfirmasi", "Anda yakin ingin menolak penawaran ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Tolak",
        style: "destructive",
        onPress: async () => {
          try {
            setSending(true);
            const newMessage = await rejectOffer(chatId!, currentUserId);
            setMessages((prev) => [...prev, newMessage]);
          } catch (error) {
            console.error("Error rejecting offer:", error);
            Alert.alert("Error", "Gagal menolak penawaran");
          } finally {
            setSending(false);
          }
        },
      },
    ]);
  };

  const handleCounterOffer = async (originalPrice: number) => {
    // For this demo, we'll show a simple implementation
    // In a real app, you might want to show a modal with price input
    Alert.alert("Tawar Balik", "Fitur tawar balik akan segera hadir!", [
      { text: "OK" },
    ]);
  };

  const handleTicketPress = () => {
    if (chat?.ticket_id) {
      router.push(`/ticket/${chat.ticket_id}`);
    }
  };

  const renderMessage = ({ item }: { item: BargainMessage }) => (
    <ChatBubble
      message={item}
      isOwn={item.sender_id === currentUserId}
      onAcceptOffer={handleAcceptOffer}
      onRejectOffer={handleRejectOffer}
      onCounterOffer={handleCounterOffer}
    />
  );

  const renderEmptyState = () => (
    <Box className="flex-1 items-center justify-center px-6 py-12">
      <FontAwesome name="comments-o" size={64} color="#D1D5DB" />
      <Text className="text-gray-500 dark:text-gray-400 text-lg font-medium mt-4 text-center">
        Mulai percakapan
      </Text>
      <Text className="text-gray-400 dark:text-gray-500 text-sm mt-2 text-center">
        Kirim pesan atau buat penawaran untuk memulai negosiasi
      </Text>
    </Box>
  );

  if (loading) {
    return (
      <Box className="flex-1 bg-white dark:bg-gray-900">
        <Stack.Screen
          options={{
            title: "Loading...",
            headerStyle: { backgroundColor: "#ffffff" },
            headerTintColor: "#000000",
          }}
        />
        <Box className="flex-1 items-center justify-center">
          <Spinner size="large" />
          <Text className="text-gray-600 dark:text-gray-400 mt-4">
            Memuat chat...
          </Text>
        </Box>
      </Box>
    );
  }

  if (!chat) {
    return (
      <Box className="flex-1 bg-white dark:bg-gray-900">
        <Stack.Screen
          options={{
            title: "Chat",
            headerStyle: { backgroundColor: "#ffffff" },
            headerTintColor: "#000000",
          }}
        />
        <Box className="flex-1 items-center justify-center px-6">
          <FontAwesome name="exclamation-triangle" size={64} color="#EF4444" />
          <Text className="text-gray-900 dark:text-gray-100 text-lg font-medium mt-4 text-center">
            Chat tidak ditemukan
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center">
            Chat yang Anda cari tidak tersedia atau telah dihapus
          </Text>
          <Button
            variant="solid"
            className="bg-primary-500 mt-6"
            onPress={() => router.back()}
          >
            <ButtonText className="text-white">Kembali</ButtonText>
          </Button>
        </Box>
      </Box>
    );
  }

  const isInputDisabled =
    chat.status === "completed" || chat.status === "rejected";

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-gray-900"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ paddingBottom: Math.max(insets.bottom + 16, 16) }}
    >
      <Stack.Screen
        options={{
          title: otherUser?.name || "Chat",
          headerStyle: { backgroundColor: "#ffffff" },
          headerTintColor: "#000000",
        }}
      />

      <VStack space="xs" className="flex-1">
        {/* Ticket Header */}
        <TicketHeader
          ticket={chat.ticket as any}
          chat={chat}
          onTicketPress={handleTicketPress}
        />

        {/* Messages List */}
        <Box className="flex-1">
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={
              messages.length === 0
                ? { flexGrow: 1 }
                : { paddingHorizontal: 16, paddingVertical: 8 }
            }
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: false });
            }}
          />
        </Box>

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendOffer={handleSendOffer}
          currentPrice={chat.final_price || chat.ticket.price}
          disabled={isInputDisabled}
        />
      </VStack>
    </KeyboardAvoidingView>
  );
}
