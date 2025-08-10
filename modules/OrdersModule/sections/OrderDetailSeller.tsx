import { OrderWithDetails } from "@/types/order";
import React, { useState } from "react";
import {
  Pressable,
  Text,
  View,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { ArrowLeft, Info, Ticket, User } from "lucide-react-native";
import { formatDate, formatTime } from "@/lib/utils";
import { Grid, GridItem } from "@/components/ui/grid";
import { Button, ButtonText } from "@/components/ui/button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ProgressTimeline } from "../elements/ProgressTimeline";
import { Image } from "@/components/ui/image";

export const OrderDetailSeller = ({
  order,
  setDetailOrder,
}: {
  order: OrderWithDetails<"buyer">;
  setDetailOrder: (order: OrderWithDetails<"buyer"> | null) => void;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmOrder = async () => {
    Alert.alert(
      "Confirm Order",
      `Are you sure you want to confirm this order from ${order.profiles.full_name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            setIsProcessing(true);
            try {
              // Here you would typically call your API to update order status
              Alert.alert("Success", "Order has been confirmed!");
              // Update local state or refetch orders
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to confirm order. Please try again."
              );
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleRejectOrder = async () => {
    Alert.alert(
      "Reject Order",
      `Are you sure you want to reject this order from ${order.profiles.full_name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            setIsProcessing(true);
            try {
              // Here you would typically call your API to update order status
              Alert.alert("Order Rejected", "The order has been rejected.");
              setDetailOrder(null); // Go back to list
            } catch (error) {
              Alert.alert("Error", "Failed to reject order. Please try again.");
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleMarkAsCompleted = async () => {
    Alert.alert(
      "Mark as Completed",
      "Mark this order as completed? This will allow the customer to download their ticket.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Complete",
          onPress: async () => {
            setIsProcessing(true);
            try {
              // Here you would typically call your API to update order status to "confirmed"
              Alert.alert("Success", "Order marked as completed!");
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to complete order. Please try again."
              );
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <VStack space="lg">
      <Pressable onPress={() => setDetailOrder(null)}>
        <HStack className="items-center" space="lg">
          <Icon as={ArrowLeft} size={"lg"} color="#464646" />
          <Text className="text-xl font-poppins-semibold text-[#464646] dark:text-white">
            {order.ticket.name}
          </Text>
        </HStack>
      </Pressable>

      <VStack className="bg-white rounded-xl p-4 shadow-xl" space="xs">
        <Text className="text-base font-bold italic text-[#FEA481] mb-2">
          Order Summary
        </Text>
        <ProgressTimeline order={order} />
      </VStack>

      <Text className="text-xl font-poppins-semibold text-center text-[#464646] mb-2">
        Order Details
      </Text>

      <VStack className="bg-white rounded-xl p-4 shadow-xl" space="xs">
        <Text className="text-base font-bold italic text-[#FEA481]">
          Tiket telah diamankan untuk
        </Text>
        <HStack space="lg" className="items-center justify-center">
          <Image
            source={require("@/assets/images/Profile.png")}
            className="w-[106px] h-[106px] rounded-full"
            alt="profile"
          />
          <VStack space="xs">
            <Text className="text-lg font-poppins-bold text-[#464646]">
              {order.profiles.full_name}
            </Text>
            <Button className="bg-[#7C7C7C] rounded-full px-4 py-1.5 w-[80%]">
              <Text className="text-base text-white font-poppins-semibold text-center">
                Chat Seller
              </Text>
            </Button>
          </VStack>
        </HStack>
      </VStack>

      {/* Customer Information */}
      <VStack className="bg-white rounded-xl p-4 shadow-xl" space="xs">
        <Text className="text-base font-bold italic text-[#FEA481]">
          Pembayaran Tiket sudah dilakukan!
        </Text>
        <HStack space="lg" className="items-center justify-center">
          <Icon as={Ticket} size={"xl"} color="#5994FB" className="w-20 h-20" />
          <VStack space="sm">
            <Text className="text-lg font-poppins-bold text-[#464646]">
              {order.price
                ? `Rp ${order.price.toLocaleString()}`
                : "Price not available"}
            </Text>
            <Text className="text-sm text-[#7C7C7C]">
              Sudah Masuk ke Tiketin
            </Text>
          </VStack>
        </HStack>
      </VStack>

      {/* Order Management Actions */}
      {order.status === "processing" && (
        <VStack className="bg-white rounded-xl p-4 shadow-xl" space="md">
          <Text className="text-base font-bold italic text-[#FEA481] text-center">
            Order Awaiting Your Confirmation
          </Text>
          <Text className="text-sm text-gray-600 text-center mb-2">
            Review the order details and confirm or reject this purchase.
          </Text>

          <Grid _extra={{ className: "grid-cols-2" }} className="gap-3">
            <GridItem _extra={{ className: "flex-1" }}>
              <Button
                action="negative"
                onPress={handleRejectOrder}
                disabled={isProcessing}
                className="flex-row items-center justify-center"
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <FontAwesome
                      name="times"
                      size={14}
                      color="white"
                      className="mr-2"
                    />
                    <ButtonText className="font-poppins-semibold ml-1">
                      Reject
                    </ButtonText>
                  </>
                )}
              </Button>
            </GridItem>
            <GridItem _extra={{ className: "flex-1" }}>
              <Button
                className="bg-green-500 flex-row items-center justify-center"
                onPress={handleConfirmOrder}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <FontAwesome
                      name="check"
                      size={14}
                      color="white"
                      className="mr-2"
                    />
                    <ButtonText className="font-poppins-semibold text-white ml-1">
                      Confirm
                    </ButtonText>
                  </>
                )}
              </Button>
            </GridItem>
          </Grid>
        </VStack>
      )}

      {order.status === "confirmed" && (
        <VStack
          className="bg-[#F0F0F1] border border-dashed border-primary-500 rounded-xl p-4 shadow-xl"
          space="xs"
        >
          <HStack space="md" className="items-center">
            <Icon as={Info} size={"lg"} color="#5994FB" />
            <Text className="text-base font-bold italic text-primary-500">
              Pembayaran Tiket sudah dilakukan!
            </Text>
          </HStack>
          <Text className="text-sm font-bold text-[#7C7C7C]">
            50% dari Tiket sudah masuk ke rekening kamu dan 50% sisanya akan
            dikirimkan setelah dikonfirmasi buyer maksimal H+1 dari
            berlansungnya acara
          </Text>
        </VStack>
      )}

      {order.status === "declined" && (
        <VStack
          className="bg-white rounded-xl p-4 shadow-xl border border-red-500"
          space="md"
        >
          <Text className="text-base font-bold italic text-red-600 text-center">
            ❌ Order Declined
          </Text>
          <Text className="text-sm text-gray-600 text-center">
            This order has been declined and cannot be processed further.
          </Text>

          <HStack className="justify-center items-center gap-2 py-2">
            <FontAwesome name="times-circle" size={24} color="#EF4444" />
            <Text className="text-red-600 font-poppins-semibold">
              Order Declined
            </Text>
          </HStack>

          <Text className="text-xs text-gray-500 text-center mt-2">
            Customer has been notified about the decline.
          </Text>
        </VStack>
      )}

      {order.status === "confirmed" && (
        <VStack
          className="bg-[#F0F0F1] rounded-xl p-4 shadow-xl border border-dashed border-green-500"
          space="md"
        >
          <Text className="text-base font-bold italic text-green-600 text-center">
            ✅ Order Completed Successfully
          </Text>
          <Text className="text-sm text-gray-600 text-center">
            This order has been completed. The customer can now download their
            ticket.
          </Text>

          <HStack className="justify-center items-center gap-2 py-2">
            <FontAwesome name="check-circle" size={24} color="#10B981" />
            <Text className="text-green-600 font-poppins-semibold">
              Transaction Complete
            </Text>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
};
