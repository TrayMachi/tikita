import React from "react";
import ContentSection from "./sections/ContentSection";
import { ScrollView } from "react-native";

export default function ForYouModule() {
  return (
    <ScrollView className="flex-1 bg-background-0 dark:bg-background-950">
      <ContentSection />
    </ScrollView>
  );
}
