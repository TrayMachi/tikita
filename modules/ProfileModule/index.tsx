import React from "react";
import ProfileHeaderSection from "./sections/ProfileHeaderSection";
import LevelProgressSection from "./sections/LevelProgressSection";
import BenefitsSection from "./sections/BenefitsSection";
import ActivitySummarySection from "./sections/ActivitySummarySection";
import ReferralSection from "./sections/ReferralSection";
import HelpSection from "./sections/HelpSection";
import LogoutSection from "./sections/LogoutSection";
import { ScrollView, View } from "react-native";

export default function ProfileModule() {
  return (
    <ScrollView className="flex-1 bg-background-0 dark:bg-background-950">
      <ProfileHeaderSection />
      <View className="px-4 py-4 space-y-6">
        <LevelProgressSection />
        <BenefitsSection />
        <ActivitySummarySection />
        <ReferralSection />
        <HelpSection />
        <LogoutSection />
      </View>
    </ScrollView>
  );
}
