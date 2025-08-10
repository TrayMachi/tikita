import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { formatDate, formatPrice } from "@/lib/utils";
import { getOrderById } from "@/services/orderService";
import { OrderDB } from "@/types/order";
import { TicketDB } from "@/types/ticket";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  Star,
  Ticket,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const PaymentModule = () => {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<(OrderDB & TicketDB) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hotels = [
    {
      id: "1",
      name: "Grand Hyatt Jakarta",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop",
      stars: 5,
      price: 1200000,
      distance: "0.5 km",
    },
    {
      id: "2",
      name: "Hotel Indonesia Kempinski",
      image:
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=200&fit=crop",
      stars: 5,
      price: 1500000,
      distance: "0.8 km",
    },
    {
      id: "3",
      name: "The Ritz-Carlton Jakarta",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop",
      stars: 5,
      price: 1800000,
      distance: "1.2 km",
    },
    {
      id: "4",
      name: "Mandarin Oriental Jakarta",
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=200&fit=crop",
      stars: 4,
      price: 950000,
      distance: "1.5 km",
    },
    {
      id: "5",
      name: "Shangri-La Hotel Jakarta",
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=200&fit=crop",
      stars: 4,
      price: 850000,
      distance: "2.1 km",
    },
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("No ticket ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const orderData = await getOrderById(id as string);
        if (orderData) {
          setOrder({ ...orderData.order, ...orderData.ticket });
        }
      } catch (err) {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Spinner size="large" />
          <Text className="mt-4 text-gray-600">Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-xl font-bold text-gray-900 mb-2">
            {error || "Ticket not found"}
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            The order you're looking for doesn't exist or has been removed.
          </Text>
          <Button onPress={() => router.replace("/(tabs)")} variant="outline">
            <ButtonText>Go Back</ButtonText>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 overflow-hidden">
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Pembayaran Berhasil",
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
          headerBackButtonDisplayMode: "minimal",
          headerTitleAlign: "center",
          headerLeft: () => (
            <Pressable
              onPress={() => router.replace("/(tabs)")}
              className="ml-4"
            >
              <Icon as={ArrowLeft} className="w-8 h-8" />
            </Pressable>
          ),
        }}
      />
      <View className="absolute -top-30 left-1/2 -translate-x-1/2 w-[130vw] h-[250px] bg-primary-500 rounded-b-full" />
      <Text className="text-lg font-poppins-bold text-white text-center pt-6">
        Pembayaran berhasil! Anda sudah berhasil membeli ticket. Tunggu
        konfirmasi seller selanjutnya
      </Text>
      <VStack
        space="md"
        className="p-6 pt-12 mx-8 my-6 mt-12 bg-white shadow-xl relative rounded-xl"
      >
        <View className="absolute top-0 left-[45%] bg-green-400 w-20 h-20 flex justify-center items-center rounded-full p-3 -translate-y-9 border-[8px] border-white z-10">
          <Icon as={Check} size="xl" className="text-white" />
        </View>
        <Text className="text-2xl font-poppins-semibold text-primary-500 text-center">
          {formatPrice(order.price)}
        </Text>
        <Text className="text-lg font-inter-medium text-[#7C7C7C] mb-2 text-center">
          Berhasil
        </Text>
        <Text className="text-2xl font-poppins-bold text-[#464646]">
          {order.name}
        </Text>
        <HStack className="justify-between my-1">
          <VStack space="md">
            <HStack space="md" className="items-center">
              <Icon as={Calendar} size="sm" className="text-primary-500" />
              <Text className="text-lg font-inter-medium text-[#7C7C7C]">
                {formatDate(order.date)}
              </Text>
            </HStack>
            <HStack space="md" className="items-center">
              <Icon as={Building2} size="sm" className="text-primary-500" />
              <Text className="text-lg font-inter-medium text-[#7C7C7C]">
                {`${order.location}, ${order.city}`}
              </Text>
            </HStack>
          </VStack>
          <HStack space="md" className="items-center">
            <Icon as={Ticket} size="sm" className="text-primary-500" />
            <Text className="text-lg font-inter-medium text-[#7C7C7C]">
              {order.ticket_type}
            </Text>
          </HStack>
        </HStack>
        <HStack className="justify-between border border-t-[#E0E0E0] border-b-0 border-x-0">
          <Text className="text-lg font-inter-medium text-[#7C7C7C]">
            Nama Peserta
          </Text>
          <Text className="text-lg font-inter-medium text-[#7C7C7C]">
            {order.nama}
          </Text>
        </HStack>
        <HStack className="justify-between border border-t-[#E0E0E0] border-b-0 border-x-0">
          <Text className="text-lg font-inter-medium text-[#7C7C7C]">
            Metode Pembayaran
          </Text>
          <Text className="text-lg font-inter-medium text-[#7C7C7C]">
            {order.method}
          </Text>
        </HStack>
        <HStack className="justify-between border border-t-[#E0E0E0] border-b-0 border-x-0">
          <Text className="text-lg font-inter-medium text-[#7C7C7C]">
            No. Transaksi
          </Text>
          <Text className="text-lg font-inter-medium text-[#7C7C7C]">
            {order.no}
          </Text>
        </HStack>
        <HStack className="justify-between border border-t-[#E0E0E0] border-b-0 border-x-0">
          <Text className="text-lg font-inter-medium text-[#7C7C7C]">
            Tanggal Pembayaran
          </Text>
          <Text className="text-lg font-inter-medium text-[#7C7C7C]">
            {formatDate(order.created_at)}
          </Text>
        </HStack>
      </VStack>
      <Text className="text-xl font-poppins-bold text-black px-6 mt-2 mb-4">
        Pilih Hotel terdekat dari venue-mu!
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 32 }}
        className="mb-4"
        decelerationRate="fast"
        snapToInterval={200}
        snapToAlignment="start"
      >
        {hotels.map((hotel, index) => {
          return (
            <View
              key={hotel.id}
              className={index < hotels.length - 1 ? "mr-4" : ""}
            >
              <View className="bg-white shadow-lg rounded-xl min-w-[200px]">
                <Image
                  source={{
                    uri: hotel.image,
                  }}
                  className="w-full h-32 object-cover rounded-t-xl"
                  alt={hotel.name}
                />
                <VStack className="gap-2 px-4 pt-4">
                  <Text className="text-[#464646] font-poppins-bold text-lg mb-1">
                    {hotel.name}
                  </Text>
                  <HStack className="items-center mb-1">
                    {Array.from({ length: hotel.stars }, (_, i) => (
                      <Icon
                        key={i}
                        as={Star}
                        size="xs"
                        className="text-yellow-400 fill-yellow-400 mr-1"
                      />
                    ))}
                    <Text className="text-[#464646] text-sm ml-1">
                      ({hotel.stars} stars)
                    </Text>
                  </HStack>
                  <HStack className="justify-between items-center">
                    <Text className="text-[#464646] font-poppins-semibold text-sm">
                      {formatPrice(hotel.price)}
                    </Text>
                    <Text className="text-[#7C7C7C] text-xs">
                      {hotel.distance}
                    </Text>
                  </HStack>
                  <View className="pb-4" />
                </VStack>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <Button className="mx-6 mb-6" style={{ paddingBottom: Math.max(insets.bottom + 16, 16) }}>
        <ButtonText>Lihat Hotel</ButtonText>
      </Button>
    </ScrollView>
  );
};
