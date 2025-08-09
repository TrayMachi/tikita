import React from "react";
import { View, Text } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

export default function SeatingPlan() {
  // Mock seating data based on the image
  const sections = [
    { name: "VIP", color: "bg-purple-500", price: "Rp1.500.000" },
    { name: "CAT 1", color: "bg-blue-500", price: "Rp1.200.000" },
    { name: "CAT 2", color: "bg-green-500", price: "Rp1.000.000" },
    { name: "CAT 3", color: "bg-yellow-500", price: "Rp800.000" },
    { name: "CAT 4", color: "bg-orange-500", price: "Rp600.000" },
    { name: "CAT 5", color: "bg-red-500", price: "Rp400.000" },
  ];

  return (
    <View className="bg-gray-50 rounded-xl p-4">
      {/* Stage */}
      <View className="bg-gray-800 rounded-lg p-3 mb-6">
        <Text className="text-white text-center text-sm font-bold">STAGE</Text>
      </View>

      {/* Seating Layout */}
      <View className="items-center mb-6">
        {/* VIP Section (Purple) */}
        <View className="bg-purple-500 rounded-lg w-32 h-16 mb-2 items-center justify-center">
          <Text className="text-white text-xs font-bold">VIP</Text>
        </View>

        {/* CAT 1 (Blue) */}
        <View className="bg-blue-500 rounded-lg w-40 h-16 mb-2 items-center justify-center">
          <Text className="text-white text-xs font-bold">CAT 1</Text>
        </View>

        {/* Middle sections */}
        <HStack className="mb-2" space="md">
          <View className="bg-green-500 rounded-lg w-24 h-12 items-center justify-center">
            <Text className="text-white text-xs font-bold">CAT 2</Text>
          </View>
          <View className="bg-yellow-500 rounded-lg w-32 h-12 items-center justify-center">
            <Text className="text-white text-xs font-bold">CAT 3</Text>
          </View>
          <View className="bg-green-500 rounded-lg w-24 h-12 items-center justify-center">
            <Text className="text-white text-xs font-bold">CAT 2</Text>
          </View>
        </HStack>

        {/* Back sections */}
        <HStack space="md">
          <View className="bg-orange-500 rounded-lg w-20 h-12 items-center justify-center">
            <Text className="text-white text-xs font-bold">CAT 4</Text>
          </View>
          <View className="bg-red-500 rounded-lg w-28 h-12 items-center justify-center">
            <Text className="text-white text-xs font-bold">CAT 5</Text>
          </View>
          <View className="bg-orange-500 rounded-lg w-20 h-12 items-center justify-center">
            <Text className="text-white text-xs font-bold">CAT 4</Text>
          </View>
        </HStack>
      </View>

      {/* Price Legend */}
      <View className="border-t border-gray-200 pt-4">
        <Text className="text-sm font-bold text-gray-900 mb-3">
          Harga Tiket
        </Text>
        <VStack space="sm">
          {sections.map((section, index) => (
            <HStack key={index} className="items-center justify-between">
              <HStack className="items-center">
                <View className={`w-4 h-4 rounded ${section.color} mr-2`} />
                <Text className="text-sm text-gray-700">{section.name}</Text>
              </HStack>
              <Text className="text-sm font-bold text-gray-900">
                {section.price}
              </Text>
            </HStack>
          ))}
        </VStack>
      </View>
    </View>
  );
}
