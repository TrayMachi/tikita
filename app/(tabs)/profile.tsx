import React from "react";
import { ScrollView, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "@/components/ui/image";
import { Badge, BadgeText } from "@/components/ui/badge";
import { ProgressFilledTrack } from "@/components/ui/progress";
import { Progress } from "@/components/ui/progress";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { signOut, user } = useAuth();
  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 pt-4">
        <Text className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-6">
          Profile
        </Text>

        {/* Profile Avatar and Info */}
        <View className="items-center">
          <View className="relative">
            <Image
              source={require("@/assets/images/Profile.png")}
              className="w-[136px] h-[136px] rounded-full"
              alt="logo"
            />

            {/* Badge */}
            <Image
              source={require("@/assets/images/SilvBadge.webp")}
              className="w-[75px] h-[65px] absolute top-4 right-1"
              alt="logo"
            />
          </View>

          <View className="flex-row items-center mb-2">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mr-2">
              {user?.user_metadata.username}
            </Text>
            <FontAwesome name="pencil" size={16} color="#6B7280" />
          </View>

          <Badge size="md" variant="solid" action="muted">
            <BadgeText>Silver</BadgeText>
          </Badge>
        </View>
      </View>

      <View className="px-4 py-4 space-y-6">
        {/* Level Progress */}
        <View className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Level Progress
          </Text>
          <Progress value={40} size="md" orientation="horizontal">
            <ProgressFilledTrack className="bg-yellow-500" />
          </Progress>
          <View className="flex-row justify-between">
            <Text className="text-sm text-yellow-600 font-medium">39%</Text>
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
          <View className="flex-row gap-x-3">
            <Box className="flex-1 bg-yellow-100 p-4 rounded-lg">
              <Text className="text-2xl font-bold text-gray-900 mb-1">7%</Text>
              <Text className="text-sm text-gray-600">Silver Discount</Text>
            </Box>
            <Box className="flex-1 bg-blue-100 p-4 rounded-lg">
              <Text className="text-lg font-bold text-gray-900 mb-1">
                Rp101.900
              </Text>
              <Text className="text-sm text-gray-600">Total Saved</Text>
            </Box>
          </View>
        </View>

        {/* Activity Summary */}
        <View className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Activity Summary
          </Text>
          <View className="flex-row gap-x-3">
            <Box className="flex-1 bg-red-100 p-4 rounded-lg items-center">
              <FontAwesome name="heart" size={20} color="#EF4444" />
              <Text className="text-2xl font-bold text-gray-900 mt-2">7</Text>
              <Text className="text-sm text-gray-600">Wishlist</Text>
            </Box>
            <Box className="flex-1 bg-orange-100 p-4 rounded-lg items-center">
              <FontAwesome name="ticket" size={20} color="#F97316" />
              <Text className="text-2xl font-bold text-gray-900 mt-2">5</Text>
              <Text className="text-sm text-gray-600">Ticket Dibeli</Text>
            </Box>
            <Box className="flex-1 bg-yellow-100 p-4 rounded-lg items-center">
              <FontAwesome name="money" size={20} color="#F59E0B" />
              <Text className="text-sm font-bold text-gray-900 mt-2">
                Rp1.200.500
              </Text>
              <Text className="text-xs text-gray-600 text-center">
                Penghasilan
              </Text>
            </Box>
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
          <View className="flex-row items-center gap-x-3">
            <Box className="flex-1 bg-yellow-500 px-4 py-3 rounded-lg">
              <Text className="text-white font-bold text-center">
                TIKETIN_ELLENHSD
              </Text>
            </Box>
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
            <Button size="md">
              <ButtonText>Chat Customer Service</ButtonText>
            </Button>
          </View>
        </View>

        <View className="flex-row justify-between items-center px-4">
          <Button
            onPress={async () => {
              await signOut();
              router.navigate("/auth/login");
            }}
            variant="solid"
            action="negative"
            size="md"
          >
            <ButtonText>Logout</ButtonText>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
