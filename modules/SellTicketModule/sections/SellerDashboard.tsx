import React, { useEffect, useState } from "react";
import { ScrollView, Pressable, RefreshControl } from "react-native";
import { View, Text } from "@/components/Themed";
import { Box } from "@/components/ui/box";
import { Badge, BadgeText } from "@/components/ui/badge";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { Seller } from "@/types/seller";
import { getSellerDashboardData } from "@/services/sellerService";
import { useAuth } from "@/contexts/AuthContext";

interface SellerDashboardProps {
  seller: Seller;
}

export default function SellerDashboard({ seller }: SellerDashboardProps) {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      const data = await getSellerDashboardData(seller.id);
      setDashboardData(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <FontAwesome name="spinner" size={32} className="text-primary-500" />
        <Text className="text-typography-600 dark:text-typography-300 mt-4">
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background-0 dark:bg-background-950"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-4 py-6 space-y-6">
        {/* Header */}
        <View className="space-y-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-heading text-typography-900 dark:text-typography-50">
                Seller Dashboard
              </Text>
              <Text className="text-sm text-typography-600 dark:text-typography-300">
                Welcome back, {seller.nama}
              </Text>
            </View>

            <Badge
              size="md"
              variant="solid"
              action={seller.isVerified ? "success" : "warning"}
            >
              <BadgeText>
                {seller.isVerified ? "Verified" : "Pending"}
              </BadgeText>
            </Badge>
          </View>

          {/* Verification Status */}
          {!seller.isVerified && (
            <Box className="bg-warning-50 dark:bg-warning-900 p-4 rounded-lg border border-warning-200 dark:border-warning-700">
              <View className="flex-row items-start space-x-3">
                <FontAwesome
                  name="clock-o"
                  size={20}
                  className="text-warning-600 mt-1"
                />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-warning-900 dark:text-warning-100 mb-1">
                    Account Under Review
                  </Text>
                  <Text className="text-sm text-warning-700 dark:text-warning-200">
                    Your seller account is being reviewed. You'll be able to
                    list tickets once verified.
                  </Text>
                </View>
              </View>
            </Box>
          )}
        </View>

        {/* Quick Actions */}
        <Box className="bg-background-50 dark:bg-background-900 p-4 rounded-lg border border-outline-200 dark:border-outline-700">
          <Text className="text-lg font-semibold text-typography-900 dark:text-typography-50 mb-4">
            Quick Actions
          </Text>

          <View className="space-y-3">
            <Pressable
              className={`flex-row items-center space-x-3 p-3 rounded-lg ${
                seller.isVerified
                  ? "bg-primary-50 dark:bg-primary-900"
                  : "bg-background-200 dark:bg-background-700"
              }`}
              disabled={!seller.isVerified}
            >
              <FontAwesome
                name="plus-circle"
                size={20}
                className={
                  seller.isVerified ? "text-primary-600" : "text-typography-400"
                }
              />
              <Text
                className={`flex-1 font-medium ${
                  seller.isVerified
                    ? "text-primary-900 dark:text-primary-100"
                    : "text-typography-400"
                }`}
              >
                List New Ticket
              </Text>
              <FontAwesome
                name="chevron-right"
                size={16}
                className={
                  seller.isVerified ? "text-primary-600" : "text-typography-400"
                }
              />
            </Pressable>

            <Pressable className="flex-row items-center space-x-3 p-3 rounded-lg bg-background-100 dark:bg-background-800">
              <FontAwesome
                name="list"
                size={20}
                className="text-typography-600"
              />
              <Text className="flex-1 font-medium text-typography-900 dark:text-typography-50">
                My Listings
              </Text>
              <FontAwesome
                name="chevron-right"
                size={16}
                className="text-typography-600"
              />
            </Pressable>

            <Pressable className="flex-row items-center space-x-3 p-3 rounded-lg bg-background-100 dark:bg-background-800">
              <FontAwesome
                name="bar-chart"
                size={20}
                className="text-typography-600"
              />
              <Text className="flex-1 font-medium text-typography-900 dark:text-typography-50">
                Sales Analytics
              </Text>
              <FontAwesome
                name="chevron-right"
                size={16}
                className="text-typography-600"
              />
            </Pressable>
          </View>
        </Box>

        {/* Stats Overview */}
        <Box className="bg-background-50 dark:bg-background-900 p-4 rounded-lg border border-outline-200 dark:border-outline-700">
          <Text className="text-lg font-semibold text-typography-900 dark:text-typography-50 mb-4">
            Overview
          </Text>

          <View className="flex-row space-x-4">
            <Box className="flex-1 bg-primary-100 dark:bg-primary-900 p-4 rounded-lg">
              <Text className="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-1">
                0
              </Text>
              <Text className="text-sm text-primary-700 dark:text-primary-200">
                Active Listings
              </Text>
            </Box>

            <Box className="flex-1 bg-success-100 dark:bg-success-900 p-4 rounded-lg">
              <Text className="text-2xl font-bold text-success-900 dark:text-success-100 mb-1">
                0
              </Text>
              <Text className="text-sm text-success-700 dark:text-success-200">
                Tickets Sold
              </Text>
            </Box>

            <Box className="flex-1 bg-info-100 dark:bg-info-900 p-4 rounded-lg">
              <Text className="text-lg font-bold text-info-900 dark:text-info-100 mb-1">
                Rp0
              </Text>
              <Text className="text-sm text-info-700 dark:text-info-200">
                Total Earnings
              </Text>
            </Box>
          </View>
        </Box>

        {/* Recent Activity */}
        <Box className="bg-background-50 dark:bg-background-900 p-4 rounded-lg border border-outline-200 dark:border-outline-700">
          <Text className="text-lg font-semibold text-typography-900 dark:text-typography-50 mb-4">
            Recent Activity
          </Text>

          <View className="items-center py-8">
            <FontAwesome
              name="inbox"
              size={32}
              className="text-typography-400 mb-2"
            />
            <Text className="text-typography-600 dark:text-typography-300 text-center">
              No recent activity
            </Text>
            <Text className="text-sm text-typography-400 text-center mt-1">
              Your sales and listing activities will appear here
            </Text>
          </View>
        </Box>

        {/* Account Information */}
        <Box className="bg-background-50 dark:bg-background-900 p-4 rounded-lg border border-outline-200 dark:border-outline-700">
          <Text className="text-lg font-semibold text-typography-900 dark:text-typography-50 mb-4">
            Account Information
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-sm text-typography-600 dark:text-typography-300">
                Seller ID:
              </Text>
              <Text className="text-sm font-mono text-typography-900 dark:text-typography-50">
                {seller.id.slice(0, 8)}...
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-typography-600 dark:text-typography-300">
                NIK:
              </Text>
              <Text className="text-sm font-mono text-typography-900 dark:text-typography-50">
                {seller.NIK.replace(
                  /(\d{4})(\d{4})(\d{4})(\d{4})/,
                  "$1-$2-$3-$4"
                )}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-typography-600 dark:text-typography-300">
                Registered:
              </Text>
              <Text className="text-sm text-typography-900 dark:text-typography-50">
                {new Date(seller.created_at).toLocaleDateString()}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-typography-600 dark:text-typography-300">
                Status:
              </Text>
              <Text
                className={`text-sm font-medium ${
                  seller.isVerified ? "text-success-600" : "text-warning-600"
                }`}
              >
                {seller.isVerified ? "Verified Seller" : "Pending Verification"}
              </Text>
            </View>
          </View>
        </Box>

        {/* Help & Support */}
        <Box className="bg-background-50 dark:bg-background-900 p-4 rounded-lg border border-outline-200 dark:border-outline-700">
          <Text className="text-lg font-semibold text-typography-900 dark:text-typography-50 mb-4">
            Help & Support
          </Text>

          <View className="space-y-3">
            <Pressable className="flex-row items-center space-x-3 p-3 rounded-lg bg-background-100 dark:bg-background-800">
              <FontAwesome
                name="question-circle"
                size={20}
                className="text-typography-600"
              />
              <Text className="flex-1 font-medium text-typography-900 dark:text-typography-50">
                Seller Guidelines
              </Text>
              <FontAwesome
                name="chevron-right"
                size={16}
                className="text-typography-600"
              />
            </Pressable>

            <Pressable className="flex-row items-center space-x-3 p-3 rounded-lg bg-background-100 dark:bg-background-800">
              <FontAwesome
                name="headphones"
                size={20}
                className="text-typography-600"
              />
              <Text className="flex-1 font-medium text-typography-900 dark:text-typography-50">
                Contact Support
              </Text>
              <FontAwesome
                name="chevron-right"
                size={16}
                className="text-typography-600"
              />
            </Pressable>
          </View>
        </Box>
      </View>
    </ScrollView>
  );
}
