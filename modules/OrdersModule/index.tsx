import React from "react";
import OrdersContentSection from "./sections/OrdersContentSection";
import { ScrollView } from "react-native";

export default function OrdersModule() {
  return (
    <ScrollView className="flex-1 bg-background-0 dark:bg-background-950">
      <OrdersContentSection />
    </ScrollView>
  );
}
