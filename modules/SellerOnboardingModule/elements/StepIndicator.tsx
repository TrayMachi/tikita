import { HStack } from "@/components/ui/hstack";
import { View } from "react-native";
import { Text } from "react-native";

export default function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <HStack className="items-center justify-center">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <HStack key={stepNumber} className="items-center">
            {/* Connector Line */}
            <View
              className={`w-12 h-0.5 ${
                isActive
                  ? "bg-primary-500"
                  : isCompleted
                  ? "bg-primary-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
            {/* Step Circle */}
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                isActive
                  ? "bg-primary-500"
                  : isCompleted
                  ? "bg-primary-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  isActive || isCompleted
                    ? "text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {stepNumber}
              </Text>
            </View>
            {index === totalSteps - 1 && (
              <View
                className={`w-12 h-0.5 ${
                  isCompleted
                    ? "bg-primary-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            )}
          </HStack>
        );
      })}
    </HStack>
  );
}
