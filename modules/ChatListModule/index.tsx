import React, { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ChatListItem } from "@/components/chat/ChatListItem";
import { BargainChatWithDetails } from "@/types/bargain";
import { getUserChats, getCurrentUserId } from "@/services/bargainService";
import { useAuth } from "@/contexts/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function ChatListModule() {
  const router = useRouter();
  const { user } = useAuth();
  const [chats, setChats] = useState<BargainChatWithDetails[]>([]);
  const [filteredChats, setFilteredChats] = useState<BargainChatWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "buying" | "selling">(
    "all"
  );

  const currentUserId = getCurrentUserId();

  const loadChats = useCallback(async () => {
    try {
      const userChats = await getUserChats(currentUserId);
      setChats(userChats);
      filterChats(userChats, activeTab, searchQuery);
    } catch (error) {
      console.error("Error loading chats:", error);
      Alert.alert("Error", "Gagal memuat daftar chat");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, activeTab, searchQuery]);

  const filterChats = useCallback(
    (
      chatList: BargainChatWithDetails[],
      tab: typeof activeTab,
      query: string
    ) => {
      let filtered = chatList;

      if (tab === "buying") {
        filtered = filtered.filter((chat) => chat.buyer_id === currentUserId);
      } else if (tab === "selling") {
        filtered = filtered.filter((chat) => chat.seller_id === currentUserId);
      }

      if (query.trim()) {
        const lowercaseQuery = query.toLowerCase();
        filtered = filtered.filter(
          (chat) =>
            chat.ticket.name.toLowerCase().includes(lowercaseQuery) ||
            chat.ticket.category.toLowerCase().includes(lowercaseQuery) ||
            chat.buyer.name.toLowerCase().includes(lowercaseQuery) ||
            chat.seller.name.toLowerCase().includes(lowercaseQuery)
        );
      }

      setFilteredChats(filtered);
    },
    [currentUserId]
  );

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    filterChats(chats, activeTab, searchQuery);
  }, [chats, activeTab, searchQuery, filterChats]);

  const handleChatPress = (chat: BargainChatWithDetails) => {
    router.push(`/penawaran/${chat.id}`);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const getTabButtonStyle = (tab: typeof activeTab) => {
    const isActive = activeTab === tab;
    return `flex-1 py-3 px-4 rounded-lg ${
      isActive ? "bg-primary-500" : "bg-gray-100 dark:bg-gray-800"
    }`;
  };

  const getTabTextStyle = (tab: typeof activeTab) => {
    const isActive = activeTab === tab;
    return `text-center font-medium ${
      isActive ? "text-white" : "text-gray-600 dark:text-gray-400"
    }`;
  };

  const renderEmptyState = () => {
    return (
      <Box className="flex-1 items-center justify-center px-6 py-12">
        <FontAwesome name="comments-o" size={64} color="#D1D5DB" />
        <Text className="text-gray-500 dark:text-gray-400 text-lg font-medium mt-4 text-center">
          {searchQuery.trim()
            ? "Tidak ada chat yang sesuai dengan pencarian"
            : "Belum ada chat"}
        </Text>
        <Text className="text-gray-400 dark:text-gray-500 text-sm mt-2 text-center">
          {searchQuery.trim()
            ? "Coba gunakan kata kunci lain"
            : "Chat akan muncul ketika Anda mulai bernegosiasi dengan penjual"}
        </Text>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box className="flex-1 bg-white dark:bg-gray-900">
        <Stack.Screen
          options={{
            title: "Chat Negosiasi",
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

  return (
    <Box className="flex-1 bg-white dark:bg-gray-900">
      <Stack.Screen
        options={{
          title: "Chat Negosiasi",
          headerStyle: { backgroundColor: "#ffffff" },
          headerTintColor: "#000000",
        }}
      />

      <VStack space="md" className="flex-1">
        <Box className="px-4 pt-4">
          <Input variant="outline" className="border-gray-300">
            <InputField
              placeholder="Cari chat atau tiket..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              returnKeyType="search"
            />
          </Input>
        </Box>

        <Box className="flex-1">
          {filteredChats.length === 0 ? (
            renderEmptyState()
          ) : (
            <VStack space="xs">
              {filteredChats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  currentUserId={currentUserId}
                  onPress={() => handleChatPress(chat)}
                />
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
