import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { formatPrice } from "@/lib/utils";
import { getTicketById } from "@/services/ticketService";
import { TicketDB } from "@/types/ticket";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, Text, View } from "react-native";
import { Header } from "./sections/Header";
import { Form, FormData } from "./sections/Form";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/services/orderService";

export const BuyTicketModule = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<TicketDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    email: "",
    nomorHP: "",
    nomorKartuIdentitas: "",
    metodePembayaran: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = React.useRef<{ validateForm: () => boolean }>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) {
        console.log("No ticket ID provided");
        setError("No ticket ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const ticketData = await getTicketById(id);

        if (!ticketData) {
          setError("Ticket not found");
        } else {
          setTicket(ticketData);
        }
      } catch (err) {
        setError("Failed to load ticket details");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

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

  const handleBuyTicket = async (ticket: TicketDB) => {
    const isValid = formRef.current?.validateForm();
    if (!isValid) {
      return;
    }

    if (!user) {
      console.log("User is null");
      Alert.alert(
        "Authentication Required",
        "Silakan login terlebih dahulu untuk melanjutkan pemesanan",
        [{ text: "OK" }]
      );
      return;
    }

    if (!user.id) {
      console.log("User exists but no ID:", user);
      Alert.alert(
        "Authentication Error",
        "ID pengguna tidak ditemukan. Silakan login ulang.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!ticket) {
      console.log("Ticket is null");
      Alert.alert("Data Ticket Error", "Data tiket tidak ditemukan.", [
        { text: "OK" },
      ]);
      return;
    }

    if (
      !ticket.id ||
      !ticket.seller_id ||
      ticket.price === undefined ||
      ticket.price === null
    ) {
      console.log("Ticket missing required fields:", {
        id: ticket.id,
        seller_id: ticket.seller_id,
        price: ticket.price,
      });
      Alert.alert(
        "Data Ticket Error",
        "Data tiket tidak lengkap. Silakan coba lagi.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNo = `${new Date().getTime()}`;

      console.log("Creating order with data:", {
        sellerId: ticket.seller_id,
        buyerId: user.id,
        ticketId: ticket.id,
        no: orderNo,
        metodePembayaran: formData.metodePembayaran,
        nama: formData.nama,
        email: formData.email,
        nomorHP: formData.nomorHP,
        nomorKartuIdentitas: formData.nomorKartuIdentitas,
        price: ticket.price,
        status: "processing",
      });

      const order = await createOrder({
        sellerId: ticket.seller_id,
        buyerId: user.id,
        ticketId: ticket.id,
        no: orderNo,
        metodePembayaran: formData.metodePembayaran,
        nama: formData.nama,
        email: formData.email,
        nomorHP: formData.nomorHP,
        nomorKartuIdentitas: formData.nomorKartuIdentitas,
        price: ticket.price,
        status: "processing",
      });

      console.log("Order created successfully:", order);

      if (!order?.id) {
        throw new Error("Order creation failed - no order ID returned");
      }

      Alert.alert(
        "Pemesanan Berhasil!",
        "Tiket berhasil dipesan.",
        [
          {
            text: "OK",
            onPress: () => {
              router.push(`/payment/${order.id}`);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error purchasing ticket:", error);

      let errorMessage =
        "Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.";

      if (error instanceof Error) {
        if (error.message.includes("User not found")) {
          errorMessage = "Sesi login telah berakhir. Silakan login kembali.";
        } else if (error.message.includes("Order creation failed")) {
          errorMessage =
            "Gagal membuat pesanan. Silakan coba beberapa saat lagi.";
        } else if (error.message.includes("Network")) {
          errorMessage = "Koneksi internet bermasalah. Periksa koneksi Anda.";
        }
      }

      Alert.alert("Pemesanan Gagal", errorMessage, [{ text: "OK" }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 ">
      <ScrollView>
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Pesanan Tiket",
            headerBackVisible: true,
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "600",
            },
            headerBackButtonDisplayMode: "minimal",
            headerTitleAlign: "center",
          }}
        />
        <Header ticket={ticket} />
        <Form
          ref={formRef}
          ticket={ticket}
          formData={formData}
          setFormData={setFormData}
        />
      </ScrollView>
      <VStack
        space="md"
        className="px-6 pb-8 pt-4 border-t shadow-lg bg-white border-outline-200 dark:border-outline-700"
      >
        <HStack className="items-center justify-between">
          <VStack space="xs">
            <Text className="text-[#7C7C7C] dark:text-typography-50 font-inter-medium text-sm">
              Harga Tiket
            </Text>
            <Text className="text-primary-500 font-poppins-semibold text-xl">
              {formatPrice(ticket.price)}
            </Text>
          </VStack>
          <Button
            onPress={() => {
              if (ticket) {
                handleBuyTicket(ticket);
              } else {
                Alert.alert(
                  "Error",
                  "Data tiket tidak tersedia. Silakan refresh halaman.",
                  [{ text: "OK" }]
                );
              }
            }}
            size="xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <HStack space="sm" className="items-center">
                <Spinner size="small" color="white" />
                <ButtonText className="font-semibold">Memproses...</ButtonText>
              </HStack>
            ) : (
              <ButtonText className="font-semibold">Bayar</ButtonText>
            )}
          </Button>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
};
