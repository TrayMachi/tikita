import React from "react";
import { View, Text } from "react-native";
import { FontClasses } from "@/constants/Fonts";

interface FontDemoProps {
  title?: string;
}

/**
 * FontDemo component to showcase Inter and Poppins fonts
 * This component demonstrates the different font weights and families available
 */
export default function FontDemo({ title = "Font Demo" }: FontDemoProps) {
  return (
    <View className="p-4 space-y-4">
      <Text
        className={`text-2xl ${FontClasses.heading} text-typography-900 dark:text-typography-50`}
      >
        {title}
      </Text>

      {/* Inter Font Family */}
      <View className="space-y-2">
        <Text
          className={`text-lg ${FontClasses.interSemibold} text-primary-600`}
        >
          Inter Font Family (Default)
        </Text>
        <Text
          className={`text-base ${FontClasses.inter} text-typography-800 dark:text-typography-100`}
        >
          Inter Regular - This is the default font for body text
        </Text>
        <Text
          className={`text-base ${FontClasses.interMedium} text-typography-800 dark:text-typography-100`}
        >
          Inter Medium - Used for emphasis and highlights
        </Text>
        <Text
          className={`text-base ${FontClasses.interSemibold} text-typography-900 dark:text-typography-50`}
        >
          Inter SemiBold - Perfect for headings and titles
        </Text>
        <Text
          className={`text-base ${FontClasses.interBold} text-typography-900 dark:text-typography-50`}
        >
          Inter Bold - For strong emphasis and important text
        </Text>
      </View>

      {/* Poppins Font Family */}
      <View className="space-y-2">
        <Text
          className={`text-lg ${FontClasses.poppinsSemibold} text-secondary-600`}
        >
          Poppins Font Family (Alternative)
        </Text>
        <Text
          className={`text-base ${FontClasses.poppins} text-typography-800 dark:text-typography-100`}
        >
          Poppins Regular - Clean and modern alternative font
        </Text>
        <Text
          className={`text-base ${FontClasses.poppinsMedium} text-typography-800 dark:text-typography-100`}
        >
          Poppins Medium - Slightly bolder for emphasis
        </Text>
        <Text
          className={`text-base ${FontClasses.poppinsSemibold} text-typography-900 dark:text-typography-50`}
        >
          Poppins SemiBold - Great for section headings
        </Text>
        <Text
          className={`text-base ${FontClasses.poppinsBold} text-typography-900 dark:text-typography-50`}
        >
          Poppins Bold - Strong and attention-grabbing
        </Text>
      </View>

      {/* Usage Examples */}
      <View className="space-y-2 bg-background-50 dark:bg-background-900 p-4 rounded-lg">
        <Text
          className={`text-lg ${FontClasses.heading} text-typography-900 dark:text-typography-50`}
        >
          Usage Examples
        </Text>
        <Text
          className={`text-sm ${FontClasses.body} text-typography-700 dark:text-typography-200`}
        >
          • Use font-inter or font-body for regular text
        </Text>
        <Text
          className={`text-sm ${FontClasses.body} text-typography-700 dark:text-typography-200`}
        >
          • Use font-inter-semibold or font-heading for titles
        </Text>
        <Text
          className={`text-sm ${FontClasses.body} text-typography-700 dark:text-typography-200`}
        >
          • Use font-poppins-* classes for alternative styling
        </Text>
        <Text
          className={`text-sm ${FontClasses.body} text-typography-700 dark:text-typography-200`}
        >
          • All fonts support dark mode automatically
        </Text>
      </View>
    </View>
  );
}

/**
 * Named export for utility usage
 */
export const FontSample = ({
  fontClass,
  text,
}: {
  fontClass: string;
  text: string;
}) => (
  <Text className={`${fontClass} text-typography-900 dark:text-typography-50`}>
    {text}
  </Text>
);
