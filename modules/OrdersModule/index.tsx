import React from "react";
import OrdersContentSection from "./sections/OrdersContentSection";
import { ScrollView } from "react-native";
import { LinearGradient } from "@/components/ui/LinearGradient";

export default function OrdersModule() {
  return (
    <LinearGradient colors={["#5994FB", "#355895"]} className="flex-1">
      <ScrollView className="flex-1">
        <OrdersContentSection />
      </ScrollView>
    </LinearGradient>
  );
}
