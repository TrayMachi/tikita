import React, { useState, useEffect } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";
import { TicketDB } from "@/types/ticket";
import {
  getAllTickets,
  getPremiumTickets,
  searchTickets,
} from "@/services/ticketService";
import HeroBanner from "./elements/HeroBanner";
import CategorySection from "./sections/CategorySection";
import FlashTicketSection from "./sections/FlashTicketSection";
import TopEventsSection from "./sections/TopEventsSection";

export default function HomeModule() {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketDB[]>([]);
  const [premiumTickets, setPremiumTickets] = useState<TicketDB[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const loadTickets = async () => {
    try {
      setIsLoading(true);

      const [allTicketsData, premiumTicketsData] = await Promise.all([
        getAllTickets(currentUserId || undefined),
        getPremiumTickets(currentUserId || undefined),
      ]);

      setTickets(allTicketsData);
      setPremiumTickets(premiumTicketsData);
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId !== null) {
      loadTickets();
    }
  }, [currentUserId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTickets();
    setIsRefreshing(false);
  };

  const handleSearchChange = async (text: string) => {
    setSearchValue(text);

    if (text.trim() === "") {
      const allTicketsData = await getAllTickets(currentUserId || undefined);
      setTickets(allTicketsData);
    } else {
      try {
        const searchResults = await searchTickets(
          text,
          currentUserId || undefined
        );
        setTickets(searchResults);
      } catch (error) {
        console.error("Error searching tickets:", error);
      }
    }
  };

  const handleCategoryPress = (category: string) => {
    const filtered = tickets.filter(
      (ticket) => ticket.category.toLowerCase() === category.toLowerCase()
    );
    setTickets(filtered);
  };

  const handleTicketPress = (ticket: TicketDB) => {
    router.push(`/ticket/${ticket.id}`);
  };

  const handleFlashTicketSeeAll = () => {
    console.log("See all flash tickets");
  };


  const featuredEvent = tickets.length > 0 ? tickets[0] : undefined;

  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <HeroBanner
        featuredEvent={featuredEvent}
        onPress={() => featuredEvent && handleTicketPress(featuredEvent)}
        searchValue={searchValue}
        handleSearchChange={handleSearchChange}
      />
      <CategorySection onCategoryPress={handleCategoryPress} />
      <FlashTicketSection
        tickets={premiumTickets}
        onTicketPress={handleTicketPress}
        onSeeAllPress={handleFlashTicketSeeAll}
      />
      <TopEventsSection tickets={tickets} onTicketPress={handleTicketPress} />
    </ScrollView>
  );
}
