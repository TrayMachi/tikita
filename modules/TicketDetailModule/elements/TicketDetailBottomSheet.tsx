import { LinearGradient } from "@/components/ui/LinearGradient";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Grid, GridItem } from "@/components/ui/grid";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { formatDate, formatPrice, formatTime } from "@/lib/utils";
import { TicketDB } from "@/types/ticket";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Building2, MapPin, ShoppingCart } from "lucide-react-native";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Pressable, Text, View } from "react-native";
import SeatingPlan from "./SeatingPlan";

export interface TicketDetailBottomSheetRef {
  present: (ticket: TicketDB) => void;
  dismiss: () => void;
}

interface TicketDetailBottomSheetProps {
  onClose: () => void;
  onBuyTicket?: (ticket: TicketDB) => void;
}

const TicketDetailBottomSheet = forwardRef<
  TicketDetailBottomSheetRef,
  TicketDetailBottomSheetProps
>(({ onClose, onBuyTicket }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedTicket, setSelectedTicket] = React.useState<TicketDB | null>(
    null
  );

  // Calculate snap points - start at 30% and expand to 85%
  const snapPoints = useMemo(() => ["55%"], []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose?.();
      }
    },
    [onClose]
  );

  useImperativeHandle(ref, () => ({
    present: (ticket: TicketDB) => {
      setSelectedTicket(ticket);
      bottomSheetRef.current?.snapToIndex(0);
    },
    dismiss: () => {
      bottomSheetRef.current?.close();
    },
  }));

  if (!selectedTicket) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={selectedTicket ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={false}
      backgroundStyle={{ backgroundColor: "#FFFFFF" }}
      handleIndicatorStyle={{ backgroundColor: "#E5E7EB" }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Content */}
        <View className="p-4">
          {/* Title and Price */}
          <View className="flex-row justify-between items-end mb-4">
            <View className="flex-1">
              <Text className="text-3xl font-poppins-bold text-[#464646] mb-1">
                {selectedTicket.name}
              </Text>
              <Text className="text-xl font-poppins-semibold text-primary-500">
                {formatPrice(selectedTicket.price)}
              </Text>
            </View>

            <View className="items-end relative">
              <Button size="sm">
                <ButtonText className="text-white text-xs">
                  Ajukan Penawaran
                </ButtonText>
              </Button>
              <LinearGradient
                className="rounded-full rounded-bl-none items-center py-1 absolute -top-5 right-0"
                colors={["#FD6885", "#FE9274", "#FFBB16"]}
                start={[0, 1]}
                end={[1, 0]}
              >
                <Text className="text-white font-poppins-medium text-xs px-2">
                  Chat Penjual
                </Text>
              </LinearGradient>
            </View>
          </View>

          <VStack className="space-y-4">
            {/* Event Details */}
            <VStack space="sm">
              <HStack className="items-center" space="md">
                <Icon as={Building2} size="md" className="text-primary-500" />
                <Text className="text-base text-[#464646]">
                  {selectedTicket.city}
                </Text>
              </HStack>
              <HStack className="items-center" space="md">
                <Icon as={MapPin} size="md" className="text-primary-500" />
                <Text className="text-base text-[#464646]">
                  {selectedTicket.location}
                </Text>
              </HStack>

              <Box className="bg-[#D9D9D9] rounded-xl px-4 py-2">
                <Text className="text-sm text-gray-500">Tanggal</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {formatDate(selectedTicket.date)}
                </Text>
              </Box>

              <Grid
                className="gap-4 flex-1"
                _extra={{
                  className: "grid-cols-2",
                }}
              >
                <GridItem
                  _extra={{
                    className: "flex-1",
                  }}
                >
                  <Box className="bg-[#D9D9D9] rounded-xl px-4 py-2">
                    <Text className="text-sm text-gray-500">Waktu</Text>
                    <Text className="text-sm font-medium text-gray-900">
                      {formatTime(selectedTicket.time)} WIB
                    </Text>
                  </Box>
                </GridItem>
                <GridItem
                  _extra={{
                    className: "flex-1",
                  }}
                >
                  <Box className="bg-[#D9D9D9] rounded-xl px-4 py-2">
                    <Text className="text-sm text-gray-500">Seat</Text>
                    <Text className="text-sm font-medium text-gray-900">
                      {selectedTicket.seat_type?.toUpperCase()}
                    </Text>
                  </Box>
                </GridItem>
              </Grid>
            </VStack>

            {/* Seating Plan */}
            <View className="mt-6">
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Seating Plan
              </Text>
              <SeatingPlan />
            </View>
          </VStack>

          {/* Bottom Spacing */}
          <View className="h-24" />
        </View>
      </BottomSheetScrollView>

      {/* Fixed Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <HStack className="items-center space-x-3">
          <Pressable className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center">
            <ShoppingCart size={20} color="#374151" />
          </Pressable>

          <Button
            className="flex-1 bg-blue-600 h-12"
            onPress={() => onBuyTicket?.(selectedTicket)}
          >
            <ButtonText className="text-white font-bold text-lg">
              Beli Tiket
            </ButtonText>
          </Button>
        </HStack>
      </View>
    </BottomSheet>
  );
});

TicketDetailBottomSheet.displayName = "TicketDetailBottomSheet";

export default TicketDetailBottomSheet;