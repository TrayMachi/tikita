import React from "react";
import { FontFamilies } from "@/constants/Fonts";
import { View, Text } from "@/components/Themed";

export default function FontDemoSection() {
  return (
    <View className="p-4 space-y-4">
      <Text className="text-2xl font-heading text-typography-900 dark:text-typography-50">
        Font Test Demo
      </Text>

      {/* Test Inter fonts */}
      <View className="space-y-2">
        <Text className="text-lg font-inter-semibold text-primary-600">
          Inter Fonts (Google Fonts)
        </Text>

        <Text
          style={{ fontFamily: FontFamilies.inter.regular }}
          className="text-base text-typography-800 dark:text-typography-100"
        >
          Inter Regular - {FontFamilies.inter.regular}
        </Text>

        <Text
          style={{ fontFamily: FontFamilies.inter.medium }}
          className="text-base text-typography-800 dark:text-typography-100"
        >
          Inter Medium - {FontFamilies.inter.medium}
        </Text>

        <Text
          style={{ fontFamily: FontFamilies.inter.semibold }}
          className="text-base text-typography-900 dark:text-typography-50"
        >
          Inter SemiBold - {FontFamilies.inter.semibold}
        </Text>

        <Text
          style={{ fontFamily: FontFamilies.inter.bold }}
          className="text-base text-typography-900 dark:text-typography-50"
        >
          Inter Bold - {FontFamilies.inter.bold}
        </Text>
      </View>

      {/* Test Poppins fonts */}
      <View className="space-y-2">
        <Text className="text-lg font-poppins-semibold text-secondary-600">
          Poppins Fonts (Google Fonts)
        </Text>

        <Text
          style={{ fontFamily: FontFamilies.poppins.regular }}
          className="text-base text-typography-800 dark:text-typography-100"
        >
          Poppins Regular - {FontFamilies.poppins.regular}
        </Text>

        <Text
          style={{ fontFamily: FontFamilies.poppins.medium }}
          className="text-base text-typography-800 dark:text-typography-100"
        >
          Poppins Medium - {FontFamilies.poppins.medium}
        </Text>

        <Text
          style={{ fontFamily: FontFamilies.poppins.semibold }}
          className="text-base text-typography-900 dark:text-typography-50"
        >
          Poppins SemiBold - {FontFamilies.poppins.semibold}
        </Text>

        <Text
          style={{ fontFamily: FontFamilies.poppins.bold }}
          className="text-base text-typography-900 dark:text-typography-50"
        >
          Poppins Bold - {FontFamilies.poppins.bold}
        </Text>
      </View>

      {/* Test Tailwind classes */}
      <View className="space-y-2 bg-background-50 dark:bg-background-900 p-4 rounded-lg">
        <Text className="text-lg font-heading text-typography-900 dark:text-typography-50">
          Tailwind Font Classes Test
        </Text>

        <Text className="font-body text-sm text-typography-700 dark:text-typography-200">
          This text uses font-body (Inter Regular)
        </Text>

        <Text className="font-heading text-sm text-typography-700 dark:text-typography-200">
          This text uses font-heading (Inter SemiBold)
        </Text>

        <Text className="font-inter text-sm text-typography-700 dark:text-typography-200">
          This text uses font-inter
        </Text>

        <Text className="font-poppins text-sm text-typography-700 dark:text-typography-200">
          This text uses font-poppins
        </Text>

        <Text className="font-mono text-sm text-typography-700 dark:text-typography-200">
          This text uses font-mono (Space Mono)
        </Text>
      </View>
    </View>
  );
}
