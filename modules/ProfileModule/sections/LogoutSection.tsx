import React from "react";
import { View } from "@/components/Themed";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";

export default function LogoutSection() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.navigate("/auth/login");
  };

  return (
    <View className="flex-row justify-between items-center px-4">
      <Button 
        onPress={handleLogout}
        variant="solid"
        action="negative"
        size="md"
      >
        <ButtonText>Logout</ButtonText>
      </Button>
    </View>
  );
}
