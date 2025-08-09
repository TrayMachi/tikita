import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { TicketDB } from "@/types/ticket";
import {
  Armchair,
  Building2,
  Calendar,
  Clock,
  Ticket,
} from "lucide-react-native";
import React, { useState } from "react";
import { Text } from "react-native";
import { Image } from "@/components/ui/image";
import { formatDate, formatPrice, formatTime } from "@/lib/utils";
import { LinearGradient } from "@/components/ui/LinearGradient";
import { Checkbox } from "@/components/ui/Checkbox";

export const Header = ({ ticket }: { ticket: TicketDB }) => {
  const [selected, setSelected] = useState<boolean>(false);
  return (
    <VStack space="md">
      <HStack space="sm" className="justify-center py-6 bg-primary-500">
        <Icon as={Ticket} size="md" className="text-white" />
        <Text className="font-poppins-medium text-base text-white text-center">
          Tiket berhasil disimpan, selesaikan pesanan dalam{"\n"}
          <Text className="font-poppins-bold">23:58:00</Text>
        </Text>
      </HStack>
      <VStack space="xl" className="py-4 px-6 bg-white shadow-lg">
        <HStack space="xl" className="items-center">
          <Image
            source={{
              uri: ticket.thumbnail || "",
            }}
            className="w-40 h-30 aspect-[4/3] rounded-xl"
            alt={ticket.name}
          />
          <VStack space="xs">
            <Text className="font-poppins-semibold text-xl text-[#464646]">
              {ticket.name}
            </Text>
            <HStack space="sm" className="items-center">
              <Icon as={Calendar} size="sm" className="text-primary-500" />
              <Text className="font-inter-medium text-sm text-[#7C7C7C]">
                {formatDate(ticket.date)}
              </Text>
            </HStack>
            <HStack space="sm" className="items-center">
              <Icon as={Clock} size="sm" className="text-primary-500" />
              <Text className="font-inter-medium text-sm text-[#7C7C7C]">
                {formatTime(ticket.time)}
              </Text>
            </HStack>
            <HStack space="sm" className="items-center">
              <Icon as={Armchair} size="sm" className="text-primary-500" />
              <Text className="font-inter-medium text-sm text-[#7C7C7C]">
                {ticket.seat_type}
              </Text>
            </HStack>
            <HStack space="sm" className="items-center">
              <Icon as={Building2} size="sm" className="text-primary-500" />
              <Text className="font-inter-medium text-sm text-[#7C7C7C]">
                {`${ticket.location} - ${ticket.city}`}
              </Text>
            </HStack>
            <Text className="font-poppins-bold text-xl text-primary-500">
              {formatPrice(ticket.price)}
            </Text>
          </VStack>
        </HStack>
        <HStack space="md" className="p-4 rounded-xl bg-background-100">
          <Checkbox
            isChecked={selected}
            onToggle={() => setSelected(!selected)}
            size="md"
            disabled={false}
          />
          <VStack>
            <HStack space="sm">
              <Text className="font-poppins-medium text-lg text-[#464646]">
                Garansi Tiket
              </Text>
              <LinearGradient
                className="rounded-full rounded-bl-none items-center py-1"
                colors={["#FD6885", "#FE9274", "#FFBB16"]}
                start={[0, 1]}
                end={[1, 0]}
              >
                <Text className="text-white font-poppins-medium text-xs px-2">
                  Rekomendasi
                </Text>
              </LinearGradient>
            </HStack>
            <Text className="text-sm text-[#FD6885] underline">
              SK & Ketentuan
            </Text>
            <Text className="text-xs text-[#7C7C7C]">
              Lindungi uangmu dari risiko tiket tidak valid atau masalah
              lainnya{"\n"}yang mungkin terjadi setelah pembelian.
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </VStack>
  );
};
