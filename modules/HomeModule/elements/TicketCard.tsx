import { View, Text, Image, Pressable } from "react-native";
import { Calendar, MapPin, Zap } from "lucide-react-native";
import { TicketDB } from "@/types/ticket";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";

interface TicketCardProps {
  ticket: TicketDB;
  onPress?: () => void;
}

export default function TicketCard({ ticket, onPress }: TicketCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Pressable onPress={onPress}>
      <View className="bg-white shadow-lg rounded-xl min-w-[200px]">
        <Image
          source={{
            uri:
              ticket.thumbnail ||
              "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=200&fit=crop",
          }}
          className="w-full h-32 object-cover rounded-t-xl"
          alt="bruno"
        />
        <VStack className="gap-2 px-4 pt-4">
          <Text className="text-[#464646] font-poppins-bold text-lg mb-1">
            {ticket.name}
          </Text>
          <HStack className="text-white font-bold text-lg justify-between">
            <Text className="text-[#464646] text-sm">
              {formatDate(ticket.date)}
            </Text>
            <Text className="text-[#464646] text-sm">
              {ticket.city}
            </Text>
          </HStack>
          <Text className="text-[#464646] font-poppins-semibold text-sm pb-4">
            {formatPrice(ticket.price)}
          </Text>
        </VStack>
      </View>
    </Pressable>
  );
}
