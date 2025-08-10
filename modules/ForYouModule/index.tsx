import React, { useEffect, useState } from "react";
import ContentSection from "./sections/ContentSection";
import { Pressable, ScrollView, Text } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { useAuth } from "@/contexts/AuthContext";
import { Icon } from "@/components/ui/icon";
import { Search, ShoppingCart } from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import { Grid, GridItem } from "@/components/ui/grid";
import { getAllTickets } from "@/services/ticketService";
import { TicketDB } from "@/types/ticket";
import LoadingState from "../SellTicketModule/elements/LoadingState";

export default function ForYouModule() {
  const { user } = useAuth();
  const [page, setPage] = useState<"recommended" | "nearby">("recommended");
  const [tickets, setTickets] = useState<TicketDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTickets = async () => {
    try {
      setIsLoading(true);

      const allTicketsData = await getAllTickets(user?.id || undefined);

      setTickets(allTicketsData);
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadTickets();
    }
  }, [user?.id]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <ScrollView className="flex-1 bg-background-0">
      <VStack className="px-6 py-12" space="lg">
        <HStack className="justify-between">
          <Text className="text-2xl text-[#464646] font-poppins-bold">
            For {user?.user_metadata.username ?? "Guest"}
          </Text>
          <HStack space="md">
            <Icon as={Search} size="lg" className="text-primary-500 w-7 h-7" />
            <Icon
              as={ShoppingCart}
              size="lg"
              className="text-primary-500 w-7 h-7"
            />
          </HStack>
        </HStack>
        <HStack>
          <Grid _extra={{ className: "grid-cols-2" }}>
            <GridItem _extra={{ className: "flex-1" }}>
              <Pressable onPress={() => setPage("recommended")}>
                <Text
                  className={`text-lg text-center font-inter-medium border border-x-0 border-t-0 border-b-[4px] text-[#A1A1A1] ${
                    page === "recommended"
                      ? "border-b-primary-500 text-primary-500"
                      : "border-b-[#A1A1A1]"
                  }`}
                >
                  Recommended For you
                </Text>
              </Pressable>
            </GridItem>
            <GridItem _extra={{ className: "flex-1" }}>
              <Pressable onPress={() => setPage("nearby")}>
                <Text
                  className={`text-lg text-center font-inter-medium border border-x-0 border-t-0 border-b-[4px] text-[#A1A1A1] ${
                    page === "nearby"
                      ? "border-b-primary-500 text-primary-500"
                      : "border-b-[#A1A1A1]"
                  }`}
                >
                  Near You
                </Text>
              </Pressable>
            </GridItem>
          </Grid>
        </HStack>
        <ContentSection tickets={tickets} />
      </VStack>
    </ScrollView>
  );
}
