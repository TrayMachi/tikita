import React from "react";
import { Text, View } from "@/components/Themed";
import { Image } from "@/components/ui/image";
import { Badge, BadgeText } from "@/components/ui/badge";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileHeaderSection() {
  const { user } = useAuth();

  return (
    <View className="bg-white dark:bg-gray-800 pt-4">
      <Text className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-6">
        Profile
      </Text>

      <View className="items-center">
        <View className="relative">
          <Image
            source={require("@/assets/images/Profile.png")}
            className="w-[136px] h-[136px] rounded-full"
            alt="profile"
          />

          <Image
            source={require("@/assets/images/SilvBadge.webp")}
            className="w-[75px] h-[65px] absolute top-4 right-1"
            alt="badge"
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
  );
}
