import React from "react";
import { View, Text } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { OrderWithDetails } from "@/types/order";

interface ProgressTimelineProps {
  order: OrderWithDetails<"seller"> | OrderWithDetails<"buyer">;
}

export const ProgressTimeline = ({ order }: ProgressTimelineProps) => {
  const getOrderSteps = () => {
    // Handle declined status separately
    if (order.status === "declined") {
      const steps = [
        {
          id: 1,
          title: "Order Placed",
          description: "Your order has been placed",
          status: "completed" as const,
          icon: "shopping-bag" as const,
        },
        {
          id: 2,
          title: "Payment Confirmed",
          description: "Payment has been verified",
          status: "completed" as const,
          icon: "credit-card-alt" as const,
        },
        {
          id: 3,
          title: "Seller Confirmation",
          description: "Order declined by seller",
          status: "declined" as const,
          icon: "times-circle" as const,
        },
      ];
      return steps;
    }

    const steps = [
      {
        id: 1,
        title: "Order Placed",
        description: "Your order has been placed",
        status: "completed" as const,
        icon: "shopping-bag" as const,
      },
      {
        id: 2,
        title: "Payment Confirmed",
        description: "Payment has been verified",
        status:
          order.status === "processing" ||
          order.status === "received" ||
          order.status === "confirmed"
            ? ("completed" as const)
            : ("pending" as const),
        icon: "credit-card-alt" as const,
      },
      {
        id: 3,
        title: "Seller Confirmation",
        description: "Waiting for seller confirmation",
        status:
          order.status === "received" || order.status === "confirmed"
            ? ("completed" as const)
            : order.status === "processing"
            ? ("active" as const)
            : ("pending" as const),
        icon: "check-circle" as const,
      },
      {
        id: 4,
        title: "Ticket Ready",
        description: "Your ticket is ready for download",
        status:
          order.status === "confirmed"
            ? ("completed" as const)
            : order.status === "received"
            ? ("active" as const)
            : ("pending" as const),
        icon: "file-text" as const,
      },
    ];
    return steps;
  };

  const steps = getOrderSteps();

  return (
    <VStack className="px-2 py-4">
      {steps.map((step, index) => (
        <HStack key={step.id} className="relative">
          {/* Vertical Line */}
          {index < steps.length - 1 && (
            <View className="absolute left-6 top-12 w-1 h-16 bg-gray-200 rounded-full">
              <View
                className={`w-full rounded-full transition-all duration-300 ${
                  steps[index + 1]?.status === "completed" ||
                  steps[index + 1]?.status === "active"
                    ? "bg-primary-500"
                    : "bg-gray-200"
                }`}
                style={{
                  height:
                    steps[index + 1]?.status === "completed" ||
                    steps[index + 1]?.status === "active"
                      ? "100%"
                      : "0%",
                }}
              />
            </View>
          )}

          {/* Circle Icon */}
          <View className="relative z-10">
            <View
              className={`w-12 h-12 rounded-full border-3 items-center justify-center shadow-sm ${
                step.status === "completed"
                  ? "bg-green-500 border-green-500 shadow-green-200"
                  : step.status === "active"
                  ? "bg-primary-500 border-primary-500 shadow-primary-200"
                  : step.status === "declined"
                  ? "bg-red-500 border-red-500 shadow-red-200"
                  : "bg-white border-gray-300"
              }`}
            >
              {step.status === "completed" ? (
                <FontAwesome name="check" size={16} color="white" />
              ) : step.status === "declined" ? (
                <FontAwesome name="times" size={16} color="white" />
              ) : (
                <FontAwesome
                  name={step.icon}
                  size={16}
                  color={step.status === "active" ? "white" : "#9CA3AF"}
                />
              )}
            </View>

            {/* Pulsing animation for active step */}
            {step.status === "active" && (
              <View className="absolute inset-0 w-12 h-12 rounded-full bg-primary-500 opacity-20 animate-pulse" />
            )}
          </View>

          {/* Content */}
          <VStack className="flex-1 ml-4 pb-6">
            <Text
              className={`font-poppins-semibold text-base mb-1 ${
                step.status === "completed"
                  ? "text-green-700"
                  : step.status === "active"
                  ? "text-primary-600"
                  : step.status === "declined"
                  ? "text-red-700"
                  : "text-gray-400"
              }`}
            >
              {step.title}
            </Text>
            <Text
              className={`font-poppins-regular text-sm ${
                step.status === "completed" || step.status === "active"
                  ? "text-gray-600"
                  : step.status === "declined"
                  ? "text-red-600"
                  : "text-gray-400"
              }`}
            >
              {step.description}
            </Text>
            {step.status === "active" && (
              <View className="mt-2 flex-row items-center">
                <View className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse" />
                <Text className="text-primary-500 text-xs font-poppins-medium">
                  In Progress
                </Text>
              </View>
            )}
            {step.status === "completed" && (
              <View className="mt-1">
                <Text className="text-green-600 text-xs font-poppins-medium">
                  ✓ Completed
                </Text>
              </View>
            )}
            {step.status === "declined" && (
              <View className="mt-2 flex-row items-center">
                <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                <Text className="text-red-500 text-xs font-poppins-medium">
                  ✗ Declined
                </Text>
              </View>
            )}
          </VStack>
        </HStack>
      ))}
    </VStack>
  );
};
