import { OrderWithDetails } from "@/types/order";
import React, { useState } from "react";
import {
  Pressable,
  Text,
  Alert,
  Platform,
  ActivityIndicator,
  View,
} from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { ArrowLeft, User } from "lucide-react-native";
import { formatDate, formatTime } from "@/lib/utils";
import { Grid, GridItem } from "@/components/ui/grid";
import { Button, ButtonText } from "@/components/ui/button";
import * as Linking from "expo-linking";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ProgressTimeline } from "../elements/ProgressTimeline";

export const OrderDetail = ({
  order,
  setDetailOrder,
}: {
  order: OrderWithDetails<"seller">;
  setDetailOrder: (order: OrderWithDetails<"seller"> | null) => void;
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const StarRating = () => {
    return (
      <HStack className="justify-center items-center gap-1 py-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable
            key={star}
            onPress={() => setRating(star)}
            onPressIn={() => setHoverRating(star)}
            onPressOut={() => setHoverRating(0)}
            className="p-1"
            accessibilityRole="button"
            accessibilityLabel={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <FontAwesome
              name={star <= (hoverRating || rating) ? "star" : "star-o"}
              size={32}
              color={star <= (hoverRating || rating) ? "#FFD700" : "#D1D5DB"}
            />
          </Pressable>
        ))}
      </HStack>
    );
  };

  const getRatingText = () => {
    switch (rating) {
      case 1:
        return "Sangat Buruk";
      case 2:
        return "Buruk";
      case 3:
        return "Biasa";
      case 4:
        return "Bagus";
      case 5:
        return "Sangat Bagus";
      default:
        return "Berikan penilaian Anda";
    }
  };

  const handleDownloadTicket = async () => {
    if (!order.ticket.ticket_url) {
      Alert.alert("Error", "Ticket URL not available");
      return;
    }

    setIsDownloading(true);

    try {
      if (Platform.OS === "web") {
        window.open(order.ticket.ticket_url, "_blank");
      } else {
        const canOpen = await Linking.canOpenURL(order.ticket.ticket_url);

        if (canOpen) {
          const isDownloadable = /\.(pdf|jpg|jpeg|png|gif|doc|docx)$/i.test(
            order.ticket.ticket_url
          );

          if (isDownloadable) {
            const fileName = `ticket_${order.ticket.name.replace(
              /[^a-zA-Z0-9]/g,
              "_"
            )}.${order.ticket.ticket_url.split(".").pop()}`;
            const downloadPath = FileSystem.documentDirectory + fileName;

            const downloadResumable = FileSystem.createDownloadResumable(
              order.ticket.ticket_url,
              downloadPath,
              {}
            );

            const downloadResult = await downloadResumable.downloadAsync();

            if (downloadResult && downloadResult.uri) {
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(downloadResult.uri, {
                  mimeType: "application/pdf",
                  dialogTitle: "Download Ticket",
                });
              } else {
                Alert.alert("Success", "Ticket downloaded successfully!");
              }
            } else {
              throw new Error("Download failed");
            }
          } else {
            await Linking.openURL(order.ticket.ticket_url);
          }
        } else {
          Alert.alert("Error", "Cannot open ticket URL");
        }
      }
    } catch (error) {
      console.error("Error downloading ticket:", error);
      Alert.alert("Error", "Failed to download ticket. Please try again.");
    } finally {
      setIsDownloading(false);
    }
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
        Order Progression Detail
      </Text>
      <VStack className="bg-white rounded-xl p-4 shadow-xl" space="xs">
        <Text className="text-base font-bold italic text-[#FEA481]">
          Pembayaran telah dilakukan
        </Text>
        <Text className="text-lg font-poppins-bold text-[#464646]">
          {order.ticket.name}
        </Text>
        <Grid _extra={{ className: "grid-cols-2" }} className="gap-4">
          <GridItem _extra={{ className: "flex-1" }}>
            <VStack>
              <Text className="text-xs font-inter-medium text-[#7C7C7C]">
                Date
              </Text>
              <Text className="text-sm font-inter-medium text-[#464646]">
                {formatDate(order.ticket.date)}
              </Text>
            </VStack>
          </GridItem>
          <GridItem _extra={{ className: "flex-1" }}>
            <VStack>
              <Text className="text-xs font-inter-medium text-[#7C7C7C]">
                Location
              </Text>
              <Text className="text-sm font-inter-medium text-[#464646]">
                {order.ticket.location}, {order.ticket.city}
              </Text>
            </VStack>
          </GridItem>
          <GridItem _extra={{ className: "flex-1" }}>
            <VStack>
              <Text className="text-xs font-inter-medium text-[#7C7C7C]">
                Time
              </Text>
              <Text className="text-sm font-inter-medium text-[#464646]">
                {formatTime(order.ticket.time)}
              </Text>
            </VStack>
          </GridItem>
          <GridItem _extra={{ className: "flex-1" }}>
            <VStack>
              <Text className="text-xs font-inter-medium text-[#7C7C7C]">
                Seat
              </Text>
              <Text className="text-sm font-inter-medium text-[#464646]">
                {order.ticket.seat_type}
              </Text>
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
      {order.status === "received" && (
        <VStack
          className="bg-white rounded-xl p-4 shadow-xl relative"
          space="xs"
        >
          <Text className="text-base font-bold italic text-[#FEA481]">
            Pemesanan telah dikonfirmasi seller
          </Text>
          <HStack space="lg" className="items-center justify-center">
            <Icon as={User} size={"xl"} color="#949494" className="w-20" />
            <VStack space="sm">
              <Text className="text-lg font-poppins-bold text-[#464646]">
                {order.seller.nama}
              </Text>
              <Button className="bg-[#7C7C7C] rounded-full px-4 py-1.5 w-full">
                <Text className="text-base text-white font-poppins-semibold text-center">
                  Chat Seller
                </Text>
              </Button>
            </VStack>
          </HStack>
        </VStack>
      )}
      {order.status === "received" && (
        <VStack className="bg-white rounded-xl p-4 shadow-xl" space="xs">
          <Text className="text-base font-bold italic text-[#FEA481]">
            Selamat, tiket{" "}
            <Text className="text-[#767676] font-poppins-bold">
              {order.ticket.name}
            </Text>
            {"\n"}
            telah menjadi milikmu!
          </Text>
          <Text className="text-xs font-inter-medium text-[#7C7C7C] mb-2">
            Kami telah mengirimkan detail tiket ke gmail Anda.
          </Text>
          <Button
            onPress={handleDownloadTicket}
            disabled={isDownloading || !order.ticket.ticket_url}
            className={`rounded-lg px-4 py-3 flex-row items-center justify-center ${
              isDownloading || !order.ticket.ticket_url
                ? "bg-gray-400"
                : "bg-primary-500"
            }`}
          >
            {isDownloading ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="white"
                  className="mr-2"
                />
                <ButtonText className="text-white font-poppins-semibold">
                  Downloading...
                </ButtonText>
              </>
            ) : (
              <>
                <FontAwesome
                  name="download"
                  size={16}
                  color="white"
                  className="mr-2"
                />
                <ButtonText>Unduh Tiket</ButtonText>
              </>
            )}
          </Button>
          <Grid _extra={{ className: "grid-cols-2" }} className="gap-2">
            <GridItem _extra={{ className: "flex-1" }}>
              <Button action="negative">
                <ButtonText className="font-poppins-semibold">
                  Laporkan Tiket
                </ButtonText>
              </Button>
            </GridItem>
            <GridItem _extra={{ className: "flex-1" }}>
              <Button action="secondary">
                <ButtonText className="font-poppins-semibold text-white">
                  Konfirmasi
                </ButtonText>
              </Button>
            </GridItem>
          </Grid>
        </VStack>
      )}
      {order.status === "declined" && (
        <VStack
          className="bg-white rounded-xl p-4 shadow-xl border border-red-500"
          space="md"
        >
          <Text className="text-base font-bold italic text-red-600 text-center">
            ❌ Order Declined by Seller
          </Text>
          <Text className="text-sm text-gray-600 text-center">
            Unfortunately, this order has been declined by the seller.
          </Text>

          <HStack className="justify-center items-center gap-2 py-2">
            <FontAwesome name="times-circle" size={24} color="#EF4444" />
            <Text className="text-red-600 font-poppins-semibold">
              Order Declined
            </Text>
          </HStack>

          <Text className="text-xs text-gray-500 text-center mt-2">
            If you have any questions, please contact customer support.
          </Text>
        </VStack>
      )}
      {order.status === "confirmed" && (
        <VStack
          className="bg-white rounded-xl p-4 shadow-xl border border-primary-500"
          space="md"
        >
          <Text className="text-base font-bold italic text-[#FEA481] text-center">
            Beri Penilaian Toko{" "}
            <Text className="text-[#767676] font-poppins-bold">
              {order.seller.nama}
            </Text>
          </Text>

          <StarRating />

          <Text className="text-center text-[#464646] font-poppins-medium text-sm">
            {getRatingText()}
          </Text>
        </VStack>
      )}
    </VStack>
  );
};
