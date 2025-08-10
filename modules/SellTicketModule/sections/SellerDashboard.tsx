import React, { useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Text } from "react-native";
import { Center } from "@/components/ui/center";
import { Icon, AddIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Grid, GridItem } from "@/components/ui/grid";
import { LinearGradient } from "@/components/ui/LinearGradient";
import { getTicketBySellerId } from "@/services/ticketService";
import { TicketDB } from "@/types/ticket";
import { formatDate, formatPrice } from "@/lib/utils";

interface SellerDashboardProps {
  seller?: any; // Optional - null means user is not a seller yet
}

export default function SellerDashboard({ seller }: SellerDashboardProps) {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketDB[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTickets = async () => {
    const tickets = await getTicketBySellerId(seller.id);
    setTickets(tickets);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTickets();
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (seller) {
      fetchTickets();
    }
  }, [seller]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      className="flex-1 bg-white dark:bg-background-950"
    >
      <VStack className="px-4 py-6" space="lg">
        {/* Header with Tikita Branding */}
        <VStack space="md">
          <VStack>
            <Text className="text-2xl font-bold text-typography-900 dark:text-typography-50 mb-1">
              Jual Tiketmu di <Text className="text-orange-500">ti</Text>
              <Text className="text-blue-500">ki</Text>
              <Text className="text-orange-500">ta</Text>
            </Text>
            <Text className="text-sm text-typography-600 dark:text-typography-300">
              Kamu punya tiket yang batal dipakai?
            </Text>
            <Text className="text-sm text-typography-600 dark:text-typography-300">
              Tikita bisa ubah tiketmu jadi cuan dan pastiin kamu{" "}
              <Text className="text-primary-500">#TiketJadiUang!</Text>
            </Text>
          </VStack>
        </VStack>

        <VStack>
          <Box className="bg-primary-500 px-4 py-2 rounded-t-xl">
            <HStack className="items-center justify-between" space="sm">
              <HStack className="items-center gap-2">
                <View className="bg-red-600 w-2 h-2 rounded-full"></View>
                <Text className="text-white font-poppins-medium text-lg">
                  Hot Opportunity
                </Text>
              </HStack>
              <HStack>
                <LinearGradient
                  className="rounded-full rounded-bl-none items-center py-1"
                  colors={["#FD6885", "#FE9274", "#FFBB16"]}
                  start={[0, 1]}
                  end={[1, 0]}
                >
                  <Text className="text-white font-poppins-medium text-xs px-2">
                    AI Recommendation
                  </Text>
                </LinearGradient>
              </HStack>
            </HStack>
          </Box>
          <Box className="bg-white rounded-b-xl border border-outline-200 shadow-lg">
            {/* Event Details */}
            <VStack className="p-4" space="md">
              <Text className="text-xl font-poppins-medium text-[typography-900] dark:text-typography-50">
                NIKI: Buzz World Tour Jakarta
              </Text>
              <Text className="text-sm text-typography-600 dark:text-typography-300">
                Tiket ini memiliki permintaan tinggi dengan perkiraan hantutan,
                Citra market berpotensi untuk dijual tiket yang tepat untuk
                mendapat keuntungan maksimal.
              </Text>

              {/* Statistics */}
              <HStack space="md">
                <Card className="flex-1 bg-blue-50 dark:bg-blue-900 p-3 rounded-lg items-center">
                  <Text className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                    891
                  </Text>
                  <Text className="text-xs text-blue-600 dark:text-blue-300">
                    Pencari
                  </Text>
                </Card>

                <Card className="flex-1 bg-blue-50 dark:bg-blue-900 p-3 rounded-lg items-center">
                  <Text className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                    &lt;10
                  </Text>
                  <Text className="text-xs text-blue-600 dark:text-blue-300">
                    Seller
                  </Text>
                </Card>

                <Card className="flex-1 bg-blue-50 dark:bg-blue-900 p-3 rounded-lg items-center">
                  <Text className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                    85%
                  </Text>
                  <Text className="text-xs text-blue-600 dark:text-blue-300">
                    Match Rate
                  </Text>
                </Card>
              </HStack>

              {/* Countdown Timer */}
              <VStack className="items-center">
                <Text className="text-sm text-typography-600 dark:text-typography-300 mb-2">
                  Event Dimulai Dalam
                </Text>
                <HStack space="sm">
                  <Card className="bg-blue-500 px-3 py-2 rounded-lg min-w-[40px] items-center">
                    <Text className="text-white font-bold text-lg">96</Text>
                    <Text className="text-white text-xs">Hari</Text>
                  </Card>
                  <Card className="bg-blue-500 px-3 py-2 rounded-lg min-w-[40px] items-center">
                    <Text className="text-white font-bold text-lg">09</Text>
                    <Text className="text-white text-xs">Jam</Text>
                  </Card>
                  <Card className="bg-blue-500 px-3 py-2 rounded-lg min-w-[40px] items-center">
                    <Text className="text-white font-bold text-lg">15</Text>
                    <Text className="text-white text-xs">Menit</Text>
                  </Card>
                </HStack>
              </VStack>

              {/* Sell Ticket Button */}
              <Pressable
                onPress={() => {
                  if (seller) {
                    router.push("/seller/addticket");
                  } else {
                    router.push("/seller/onboarding");
                  }
                }}
              >
                <LinearGradient
                  className="rounded-lg items-center py-2"
                  colors={["#FD6885", "#FE9274", "#FFBB16"]}
                  start={[0, 1]}
                  end={[1, 0]}
                >
                  <Text className="text-white font-poppins-medium text-lg">
                    Jual Tiket Sekarang
                  </Text>
                </LinearGradient>
              </Pressable>
            </VStack>
          </Box>
        </VStack>

        {/* Additional Info - Show register prompt for non-sellers */}
        {!seller && (
          <Center>
            <Text className="text-sm text-[#464646] dark:text-typography-300">
              Belum Punya Akun Seller?{" "}
              <Text
                className="text-blue-500 font-semibold italic"
                onPress={() => router.push("/seller/onboarding")}
              >
                Daftar Sebagai Seller
              </Text>
            </Text>
          </Center>
        )}

        {/* Ticket Anda Section */}
        <VStack space="md">
          <Text className="text-xl font-poppins-semibold text-typography-900 dark:text-typography-50">
            Tiket Anda
          </Text>

          <Grid
            className="gap-4"
            _extra={{
              className: "grid-cols-2",
            }}
          >
            {tickets.map((ticket) => (
              <GridItem
                key={ticket.id}
                className="bg-white shadow-lg rounded-xl"
                _extra={{
                  className: "flex-1",
                }}
              >
                <Image
                  source={{
                    uri: ticket.thumbnail || "https://via.placeholder.com/150",
                  }}
                  className="w-full h-32 object-cover rounded-t-xl"
                  alt={ticket.name}
                />
                <VStack className="gap-2 p-4">
                  <Text className="text-[#464646] font-poppins-bold text-lg mb-1">
                    {ticket.name}
                  </Text>
                  <HStack className="text-white font-bold text-lg justify-between">
                    <Text className="text-[#464646] text-sm">
                      {formatDate(ticket.date)}
                    </Text>
                    <Text className="text-[#464646] text-sm">2 Ticket</Text>
                  </HStack>
                  <Text className="text-[#464646] font-poppins-semibold text-sm pb-4">
                    {formatPrice(ticket.price)}
                  </Text>
                </VStack>
              </GridItem>
            ))}

            <GridItem
              _extra={{
                className: "",
              }}
            >
              <Card
                className="bg-blue-50 dark:bg-background-800 rounded-xl flex-1 min-h-[140px] items-center justify-center border-2 border-dashed border-primary-500"
                onTouchEnd={() => {
                  if (seller) {
                    router.push("/seller/addticket");
                  } else {
                    router.push("/seller/onboarding");
                  }
                }}
              >
                <VStack className="items-center" space="sm">
                  <Icon as={AddIcon} size="xl" className="text-primary-500" />
                  <Text className="text-[#464646] text-sm text-center">
                    Tambah Tiket
                  </Text>
                </VStack>
              </Card>
            </GridItem>
          </Grid>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
