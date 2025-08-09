import React from "react";
import { View, Text, ImageBackground, Pressable } from "react-native";
import { LinearGradient } from "@/components/ui/LinearGradient";
import { TicketDB } from "@/types/ticket";
import SearchHeader from "./SearchHeader";

interface HeroBannerProps {
  featuredEvent?: TicketDB;
  onPress?: () => void;
  searchValue: string;
  handleSearchChange: (text: string) => void;
}

export default function HeroBanner({
  featuredEvent,
  onPress,
  searchValue,
  handleSearchChange,
}: HeroBannerProps) {
  // Default banner if no featured event
  const defaultBanner = {
    name: "COLDPLAY",
    subtitle: "MUSIC of the SPHERES",
    tour: "WORLD TOUR",
    location: "H.E.R",
    thumbnail:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=400&fit=crop",
  };

  const imageSource = featuredEvent?.thumbnail
    ? { uri: featuredEvent.thumbnail }
    : { uri: defaultBanner.thumbnail };

  return (
    <Pressable onPress={onPress} className="mb-6">
      <View className="h-[35vh]">
        <ImageBackground
          source={imageSource}
          className="flex-1 bg-black"
          resizeMode="contain"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
            className="flex-1 justify-between p-6"
          >
            {/* Page Indicator Dots */}
            <SearchHeader
              searchValue={searchValue}
              onSearchChange={handleSearchChange}
              cartCount={0}
              notificationCount={0}
            />
            <View className="flex-row justify-center space-x-2 mt-4">
              <View className="w-2 h-2 bg-white rounded-full" />
              <View className="w-2 h-2 bg-white/40 rounded-full" />
              <View className="w-2 h-2 bg-white/40 rounded-full" />
              <View className="w-2 h-2 bg-white/40 rounded-full" />
            </View>
          </LinearGradient>
          <View className="absolute bottom-0 left-0 right-0 h-4 bg-gray-50 rounded-t-full" />
        </ImageBackground>
      </View>
    </Pressable>
  );
}
