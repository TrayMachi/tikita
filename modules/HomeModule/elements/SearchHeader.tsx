import React from "react";
import { View, Text, Pressable } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { Search, ShoppingCart, Bell, MessageSquareMore } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";

interface SearchHeaderProps {
  onSearchChange?: (text: string) => void;
  searchValue?: string;
  cartCount?: number;
  notificationCount?: number;
}

export default function SearchHeader({
  onSearchChange,
  searchValue = "",
  cartCount = 0,
  notificationCount = 0,
}: SearchHeaderProps) {
  return (
    <View className="pt-6 bg-transparent">
      <HStack space="sm" className="items-center bg-transparent">
        {/* Search Input */}
        <View className="flex-1 relative">
          <Input
            variant="outline"
            size="md"
            className="bg-white border-gray-200  rounded-full"
          >
            <InputField
              placeholder="Search for an event"
              value={searchValue}
              onChangeText={onSearchChange}
              className="pl-10"
            />
          </Input>
          <View className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search size={18} color="#6b7280" />
          </View>
        </View>

        {/* Cart Icon */}
        <Pressable className="relative p-2 bg-black/30 rounded-full">
          <ShoppingCart size={24} color="#ffff" />
          {cartCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {cartCount > 9 ? "9+" : cartCount}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Notification Icon */}
        <Pressable className="relative p-2 bg-black/30 rounded-full">
          <MessageSquareMore size={24} color="#ffff" />
          {notificationCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {notificationCount > 9 ? "9+" : notificationCount}
              </Text>
            </View>
          )}
        </Pressable>
      </HStack>
    </View>
  );
}
