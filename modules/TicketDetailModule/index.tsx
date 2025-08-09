import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { LinearGradient } from "@/components/ui/LinearGradient";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { getTicketById } from "@/services/ticketService";
import { TicketDB } from "@/types/ticket";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Icon } from "@/components/ui/icon";
import {
    ArrowLeft,
    Share2,
    ShoppingCart
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    ImageBackground,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from "react-native";
import TicketDetailBottomSheet, {
    TicketDetailBottomSheetRef,
} from "./elements/TicketDetailBottomSheet";
import { formatPrice } from "@/lib/utils";


export default function TicketDetailModule() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bottom sheet ref
  const bottomSheetRef = useRef<TicketDetailBottomSheetRef>(null);

  useEffect(() => {
    console.log("TicketDetailModule mounted with ID:", id);

    const fetchTicket = async () => {
      if (!id) {
        console.log("No ticket ID provided");
        setError("No ticket ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching ticket with ID:", id);
        const ticketData = await getTicketById(id);

        if (!ticketData) {
          console.log("Ticket not found for ID:", id);
          setError("Ticket not found");
        } else {
          console.log("Ticket loaded successfully:", ticketData.name);
          setTicket(ticketData);
          setTimeout(() => {
            bottomSheetRef.current?.present(ticketData);
          }, 200);
        }
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError("Failed to load ticket details");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleBuyTicket = (ticket: TicketDB) => {
    console.log("Buy ticket:", ticket.id);
    // Navigate to payment screen or show payment modal
    // router.push(`/payment/${ticket.id}`);
  };


  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Spinner size="large" />
          <Text className="mt-4 text-gray-600">Loading ticket details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !ticket) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-xl font-bold text-gray-900 mb-2">
            {error || "Ticket not found"}
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            The ticket you're looking for doesn't exist or has been removed.
          </Text>
          <Button onPress={() => router.back()} variant="outline">
            <ButtonText>Go Back</ButtonText>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        <View className="h-[50vh]">
          <ImageBackground
            source={{
              uri:
                ticket.thumbnail ||
                "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=400&fit=crop",
            }}
            className="flex-1"
            resizeMode="cover"
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
              className="flex-1"
            >
              {/* Header Controls */}
              <View className="flex-row justify-between items-start pt-12 px-4">
                <Pressable
                  onPress={() => router.back()}
                  className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
                >
                  <ArrowLeft size={20} color="white" />
                </Pressable>

                <Pressable className="w-10 h-10 bg-black/30 rounded-full items-center justify-center">
                  <Share2 size={20} color="white" />
                </Pressable>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
      </ScrollView>

      {/* Bottom Sheet for Details */}
      <TicketDetailBottomSheet
        ref={bottomSheetRef}
        onBuyTicket={handleBuyTicket}
        onClose={() => {}}
      />

      <VStack
        space="md"
        className="px-6 pb-8 pt-4 border-t shadow-lg bg-white border-outline-200 dark:border-outline-700"
      >
        <VStack space="xs">
          <Text className="text-[#7C7C7C] dark:text-typography-50 font-inter-medium text-sm">
            Harga Tiket
          </Text>
          <Text className="text-[#464646] font-poppins-semibold text-xl">
            {formatPrice(ticket.price)}
          </Text>
        </VStack>
        <HStack space="sm" className="items-center">
          <Pressable className="p-2 border border-primary-500 rounded-full items-center justify-center">
            <Icon as={ShoppingCart} size="md" className="text-primary-500" />
          </Pressable>

          <Button onPress={() => handleBuyTicket(ticket)} className="flex-1">
            <ButtonText className="font-semibold">Beli Tiket</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
}
