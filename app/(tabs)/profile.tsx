import React from "react";
import { ScrollView, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 pt-4 pb-6">
        <Text className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-6">
          Profile
        </Text>

        {/* Profile Avatar and Info */}
        <View className="items-center">
          <View className="relative mb-4">
            <View className="w-24 h-24 bg-blue-400 rounded-full items-center justify-center">
              <View className="w-16 h-16 bg-yellow-400 rounded-full items-center justify-center">
                <FontAwesome name="user" size={32} color="#8B4513" />
              </View>
            </View>
            {/* Badge */}
            <View className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full items-center justify-center border-2 border-blue-400">
              <FontAwesome name="star" size={16} color="#FFD700" />
            </View>
          </View>

          <View className="flex-row items-center mb-2">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mr-2">
              Ellen Husada
            </Text>
            <FontAwesome name="pencil" size={16} color="#6B7280" />
          </View>

          <View className="bg-gray-400 px-3 py-1 rounded-full">
            <Text className="text-white text-sm font-medium">Silver</Text>
          </View>
        </View>
      </View>

      <View className="px-4 py-4 space-y-6">
        {/* Level Progress */}
        <View className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Level Progress
          </Text>
          <View className="mb-2">
            <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <View className="h-full w-1/3 bg-yellow-500 rounded-full" />
            </View>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-yellow-600 font-medium">33%</Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Gold
            </Text>
          </View>
        </View>

        {/* Silver Member Benefits */}
        <View className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Your <Text className="text-gray-500">Silver Member</Text> Benefit
          </Text>
          <View className="flex-row space-x-3">
            <View className="flex-1 bg-yellow-100 p-4 rounded-lg">
              <Text className="text-2xl font-bold text-gray-900 mb-1">7%</Text>
              <Text className="text-sm text-gray-600">Silver Discount</Text>
            </View>
            <View className="flex-1 bg-blue-100 p-4 rounded-lg">
              <Text className="text-lg font-bold text-gray-900 mb-1">
                Rp101.900
              </Text>
              <Text className="text-sm text-gray-600">Total Saved</Text>
            </View>
          </View>
        </View>

        {/* Activity Summary */}
        <View className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Activity Summary
          </Text>
          <View className="flex-row space-x-3">
            <View className="flex-1 bg-red-100 p-4 rounded-lg items-center">
              <FontAwesome name="heart" size={20} color="#EF4444" />
              <Text className="text-2xl font-bold text-gray-900 mt-2">7</Text>
              <Text className="text-sm text-gray-600">Wishlist</Text>
            </View>
            <View className="flex-1 bg-orange-100 p-4 rounded-lg items-center">
              <FontAwesome name="ticket" size={20} color="#F97316" />
              <Text className="text-2xl font-bold text-gray-900 mt-2">5</Text>
              <Text className="text-sm text-gray-600">Ticket Dibeli</Text>
            </View>
            <View className="flex-1 bg-yellow-100 p-4 rounded-lg items-center">
              <FontAwesome name="money" size={20} color="#F59E0B" />
              <Text className="text-sm font-bold text-gray-900 mt-2">
                Rp1.200.500
              </Text>
              <Text className="text-xs text-gray-600 text-center">
                Penghasilan
              </Text>
            </View>
          </View>
        </View>

        {/* Referral Code */}
        <View className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Your Referral Code
          </Text>
          <Text className="text-sm text-gray-600 mb-3">
            Ajak temanmu download Tiketin & dapatkan diskon sampai 10%! 🎉
          </Text>
          <View className="flex-row items-center space-x-3">
            <View className="flex-1 bg-yellow-500 px-4 py-3 rounded-lg">
              <Text className="text-white font-bold text-center">
                TIKETIN_ELLENHSD
              </Text>
            </View>
            <Pressable className="bg-yellow-500 p-3 rounded-lg">
              <FontAwesome name="share" size={16} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Need Help */}
        <View className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Need Help?
              </Text>
              <Text className="text-sm text-gray-600">
                Tanya atau Buat Laporan pada CS kami!
              </Text>
            </View>
            <Pressable className="bg-blue-500 px-4 py-2 rounded-lg">
              <Text className="text-white font-medium text-sm">
                Chat Customer Service
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
