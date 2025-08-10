import React, { useEffect, useState } from "react";
import { Pressable, Text, View, ActivityIndicator } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { getOrdersBySellerId } from "@/services/orderService";
import { OrderWithDetails } from "@/types/order";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { formatDate, formatPrice } from "@/lib/utils";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { OrderDetailSeller } from "./OrderDetailSeller";

export const OrderToko = ({ sellerId }: { sellerId: string }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithDetails<"buyer">[]>([]);
  const [detailOrder, setDetailOrder] =
    useState<OrderWithDetails<"buyer"> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const orders = await getOrdersBySellerId(sellerId);
      setOrders(orders);
      setLoading(false);
    };
    fetchOrders();
  }, [sellerId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "received":
        return "bg-orange-100 text-orange-800";
      case "onBid":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return "clock-o";
      case "received":
        return "check-circle";
      case "onBid":
        return "gavel";
      case "confirmed":
        return "check-circle";
      case "declined":
        return "times-circle";
      default:
        return "question-circle";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "processing":
        return "Awaiting Confirmation";
      case "received":
        return "Confirmed";
      case "confirmed":
        return "Completed";
      case "onBid":
        return "On Auction";
      case "declined":
        return "Declined";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="text-gray-600 dark:text-gray-400 mt-3 font-poppins-medium">
          Loading orders...
        </Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <FontAwesome name="shopping-bag" size={64} color="#D1D5DB" />
        <Text className="text-xl font-poppins-bold text-gray-500 dark:text-gray-400 mt-4 mb-2">
          No Orders Yet
        </Text>
        <Text className="text-gray-400 dark:text-gray-500 text-center font-poppins-regular px-8">
          When customers purchase your tickets, they'll appear here
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-2xl font-poppins-bold text-gray-900 dark:text-white mb-6 text-center">
        Customer Orders
      </Text>
      <VStack space="lg">
        {detailOrder ? (
          <OrderDetailSeller
            order={detailOrder}
            setDetailOrder={setDetailOrder}
          />
        ) : (
          orders.map((order, index) => {
            return (
              <View
                key={`${order.id}-${order.ticket.id}`}
                className={index < orders.length - 1 ? "mr-4" : ""}
              >
                <Pressable
                  onPress={() => setDetailOrder(order)}
                  className="active:scale-98 transition-transform duration-150"
                  accessibilityRole="button"
                  accessibilityLabel={`Order from ${order.profiles.full_name}`}
                  accessibilityHint="Tap to view order details"
                >
                  <View className="bg-white shadow-lg rounded-xl min-w-[200px] relative">
                    <View
                      className={`absolute top-3 right-3 z-10 px-2 py-1 rounded-full flex-row items-center ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <FontAwesome
                        name={getStatusIcon(order.status)}
                        size={10}
                        className="mr-1"
                      />
                      <Text className="text-xs font-poppins-semibold ml-1">
                        {getStatusText(order.status)}
                      </Text>
                    </View>

                    <Image
                      source={{
                        uri:
                          order.ticket.thumbnail ||
                          "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=400&fit=crop",
                      }}
                      className="w-full h-32 object-cover rounded-t-xl"
                      alt={`${order.ticket.name} event thumbnail`}
                    />

                    <VStack className="gap-3 px-4 pt-4">
                      <Text
                        className="text-[#464646] font-poppins-bold text-lg leading-tight"
                        numberOfLines={2}
                      >
                        {order.ticket.name}
                      </Text>

                      {/* Date and Customer */}
                      <VStack className="gap-2">
                        <HStack className="items-center gap-2">
                          <FontAwesome name="calendar" size={14} color="#666" />
                          <Text className="text-[#464646] text-sm font-poppins-medium flex-1">
                            {formatDate(order.ticket.date)}
                          </Text>
                        </HStack>

                        <HStack className="items-center gap-2">
                          <FontAwesome name="user" size={14} color="#666" />
                          <Text
                            className="text-[#464646] text-sm font-poppins-medium flex-1"
                            numberOfLines={1}
                          >
                            Customer: {order.profiles.full_name}
                          </Text>
                        </HStack>
                      </VStack>

                      {/* Order Details */}
                      <View className="border-t border-gray-100 pt-3">
                        <HStack className="justify-between items-center">
                          <VStack className="gap-1">
                            <Text className="text-gray-500 text-xs font-poppins-regular uppercase tracking-wider">
                              Order #{order.no}
                            </Text>
                            <Text className="text-primary-500 font-poppins-bold text-lg">
                              {formatPrice(order.price)}
                            </Text>
                          </VStack>

                          <HStack className="items-center gap-2">
                            <Text className="text-gray-500 text-xs font-poppins-regular">
                              Manage Order
                            </Text>
                            <FontAwesome
                              name="chevron-right"
                              size={12}
                              color="#999"
                            />
                          </HStack>
                        </HStack>
                      </View>
                      <View className="pb-4" />
                    </VStack>
                  </View>
                </Pressable>
              </View>
            );
          })
        )}
      </VStack>
    </View>
  );
};
