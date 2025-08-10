import { HStack } from "@/components/ui/hstack";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { cn } from "@/lib/utils";
import { VStack } from "@/components/ui/vstack";
import { OrderSaya } from "./OrderSaya";
import { OrderToko } from "./OrderToko";
import { useAuth } from "@/contexts/AuthContext";
import { checkSellerStatus } from "@/services/sellerService";

export default function OrdersContentSection() {
  const [page, setPage] = useState(0);
  const [role, setRole] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRole = async () => {
      const seller = await checkSellerStatus(user?.id || "");
      if (seller) {
        setRole(seller.id);
      }
    };
    fetchRole();
  }, [user]);

  return (
    <View className="flex-1 pt-8">
      <Text className="text-3xl font-poppins-semibold text-white pt-10 pb-5 text-center">
        Orders
      </Text>
      <HStack className="gap-2 justify-center px-2">
        <Pressable
          className={cn(
            "bg-[#E8E8E8] rounded-full px-4 py-2 w-[150px]",
            page === 0 && "bg-white"
          )}
          onPress={() => setPage(0)}
        >
          <Text
            className={cn(
              "text-base font-poppins-bold text-[#949494] text-center",
              page === 0 && "text-primary-500"
            )}
          >
            Order Saya
          </Text>
        </Pressable>
        <Pressable
          className={cn(
            "bg-[#E8E8E8] rounded-full px-4 py-2 w-[150px]",
            page === 1 && "bg-white",
            typeof role !== "string" && "hidden"
          )}
          onPress={() => setPage(1)}
        >
          <Text
            className={cn(
              "text-base font-poppins-bold text-[#949494] text-center",
              page === 1 && "text-primary-500"
            )}
          >
            Order Toko
          </Text>
        </Pressable>
      </HStack>
      <VStack className="flex-1 bg-white min-h-[85vh] h-full py-10 px-8 mt-5 rounded-t-[45px]">
        {page === 0 ? <OrderSaya /> : <OrderToko sellerId={role || ""} />}
      </VStack>
    </View>
  );
}
