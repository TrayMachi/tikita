import React, { useState, useEffect } from "react";
import { ScrollView, RefreshControl } from "react-native";
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
  const [tickets, setTickets] = useState<TicketDB[]>([]);
  const [premiumTickets, setPremiumTickets] = useState<TicketDB[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  // Load tickets from database
  const loadTickets = async () => {
    try {
      setIsLoading(true);

      // Load all tickets and premium tickets in parallel
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

  // Initial load
  useEffect(() => {
    if (currentUserId !== null) {
      loadTickets();
    }
  }, [currentUserId]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTickets();
    setIsRefreshing(false);
  };

  // Handle search
  const handleSearchChange = async (text: string) => {
    setSearchValue(text);

    if (text.trim() === "") {
      // If search is empty, reload all tickets
      const allTicketsData = await getAllTickets(currentUserId || undefined);
      setTickets(allTicketsData);
    } else {
      // Search tickets
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

  // Handle category press
  const handleCategoryPress = (category: string) => {
    // You can implement category filtering here
    console.log("Category pressed:", category);
    // For now, just filter the existing tickets by category
    const filtered = tickets.filter(
      (ticket) => ticket.category.toLowerCase() === category.toLowerCase()
    );
    setTickets(filtered);
  };

  // Handle ticket press
  const handleTicketPress = (ticket: TicketDB) => {
    // Navigate to ticket detail
    console.log("Ticket pressed:", ticket.id);
    // Implement navigation to ticket detail screen
  };

  // Handle flash ticket see all
  const handleFlashTicketSeeAll = () => {
    console.log("See all flash tickets");
    // Implement navigation to flash tickets screen
  };

  // Get featured event (first ticket for now)
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
