import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, View } from "react-native";
import {
  Home,
  Heart,
  PlusCircle,
  ClipboardList,
  User,
  type LucideIcon,
} from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  ZoomIn,
} from "react-native-reanimated";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

interface AnimatedTabIconProps {
  icon: LucideIcon;
  color: string;
  focused: boolean;
  size?: number;
}

function AnimatedTabIcon({
  icon: Icon,
  color,
  focused,
  size = 24,
}: AnimatedTabIconProps) {
  const scale = useSharedValue(focused ? 1.2 : 1);
  const opacity = useSharedValue(focused ? 1 : 0.7);
  const glowScale = useSharedValue(focused ? 1 : 0);
  const dotScale = useSharedValue(focused ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1, {
      damping: 15,
      stiffness: 200,
    });
    opacity.value = withTiming(focused ? 1 : 0.7, {
      duration: 200,
    });
    glowScale.value = withSpring(focused ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
    dotScale.value = withTiming(focused ? 1 : 0, {
      duration: 300,
    });
  }, [focused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowScale.value * 0.2,
  }));

  const animatedDotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    opacity: dotScale.value,
  }));

  return (
    <View className="items-center justify-center relative">
      {/* Background glow effect for active tab */}
      <Animated.View
        style={animatedGlowStyle}
        className="absolute w-12 h-12 bg-blue-500 rounded-full"
      />

      {/* Animated icon */}
      <Animated.View style={animatedIconStyle} className="relative z-10">
        <Icon size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
      </Animated.View>
    </View>
  );
}

// Enhanced tab bar with custom styling
function CustomTabBar(props: any) {
  return (
    <View className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg py-2">
      <View className="flex-row justify-around items-center py-2 px-4">
        {props.state.routes.map((route: any, index: number) => {
          const { options } = props.descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = props.state.index === index;

          const onPress = () => {
            const event = props.navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              props.navigation.navigate(route.name);
            }
          };

          // Icon mapping
          const getIcon = () => {
            switch (route.name) {
              case "index":
                return Home;
              case "foryou":
                return Heart;
              case "sellticket":
                return PlusCircle;
              case "orders":
                return ClipboardList;
              case "profile":
                return User;
              default:
                return Home;
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              className="flex-1 items-center py-2"
            >
              <AnimatedTabIcon
                icon={getIcon()}
                color={isFocused ? "#007AFF" : "#8E8E93"}
                focused={isFocused}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          display: "none", // Hide default tab bar since we're using custom
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon icon={Home} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="foryou"
        options={{
          title: "For You",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon icon={Heart} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="sellticket"
        options={{
          title: "Sell Ticket",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              icon={PlusCircle}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              icon={ClipboardList}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon icon={User} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
