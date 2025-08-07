import React from "react";
import WelcomeSection from "./sections/WelcomeSection";
import FontDemoSection from "./sections/FontDemoSection";
import { ScrollView } from "react-native";

export default function HomeModule() {
  return (
    <ScrollView className="flex-1 bg-background-0 dark:bg-background-950">
      <WelcomeSection />
      <FontDemoSection />
    </ScrollView>
  );
}
