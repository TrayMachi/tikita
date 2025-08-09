import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import {
  Music,
  Theater,
  Dumbbell,
  Users,
  Film,
  Gamepad2,
  MapPin,
  Building,
} from "lucide-react-native";

interface CategoryItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface CategorySectionProps {
  onCategoryPress?: (category: string) => void;
}

const categories: CategoryItem[] = [
  {
    id: "konser",
    name: "Konser",
    icon: <Music size={24} color="#8B5CF6" />,
    color: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    id: "expo-pameran",
    name: "Expo Pameran",
    icon: <Building size={24} color="#3B82F6" />,
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "olahraga",
    name: "Olahraga",
    icon: <Dumbbell size={24} color="#10B981" />,
    color: "bg-green-100 dark:bg-green-900/30",
  },
  {
    id: "seminar",
    name: "Seminar",
    icon: <Users size={24} color="#F59E0B" />,
    color: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    id: "seni-pertunjukan",
    name: "Seni & Pertunjukan",
    icon: <Theater size={24} color="#EF4444" />,
    color: "bg-red-100 dark:bg-red-900/30",
  },
  {
    id: "film",
    name: "Film",
    icon: <Film size={24} color="#6366F1" />,
    color: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    id: "tempat-rekreasi",
    name: "Tempat Rekreasi",
    icon: <MapPin size={24} color="#14B8A6" />,
    color: "bg-teal-100 dark:bg-teal-900/30",
  },
  {
    id: "akomodasi",
    name: "Akomodasi",
    icon: <Building size={24} color="#F97316" />,
    color: "bg-orange-100 dark:bg-orange-900/30",
  },
];

export default function CategorySection({
  onCategoryPress,
}: CategorySectionProps) {
  return (
    <View className="mb-6">
      <View className="px-4">
        <Text className="text-2xl -translate-y-4 font-poppins-bold text-gray-900 dark:text-white">
          Kategori Event
        </Text>
      </View>

      <View className="px-4">
        <View className="flex-row flex-wrap justify-between">
          {categories.map((category, index) => (
            <Pressable
              key={category.id}
              onPress={() => onCategoryPress?.(category.id)}
              className={`w-[22%] mb-4 items-center`}
            >
              {/* Icon Container */}
              <View
                className={`w-16 h-16 rounded-2xl items-center justify-center mb-2 ${category.color}`}
              >
                {category.icon}
              </View>

              {/* Category Name */}
              <Text
                className="text-xs text-center text-gray-700 dark:text-gray-300 font-medium leading-tight"
                numberOfLines={2}
              >
                {category.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
