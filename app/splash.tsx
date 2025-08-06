import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { supabase } from "@/utils/supabase";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start logo animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Subtle logo rotation effect
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Enhanced loading dots animation with staggered effect
    const createDotAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 500,
            delay,
            easing: Easing.bezier(0.4, 0, 0.6, 1),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 500,
            easing: Easing.bezier(0.4, 0, 0.6, 1),
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start dots animation with delays
    setTimeout(() => {
      createDotAnimation(dot1Anim, 0).start();
      createDotAnimation(dot2Anim, 150).start();
      createDotAnimation(dot3Anim, 300).start();
    }, 1000);

    // Check authentication status after enhanced loading time
    const timer = setTimeout(async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Add fade out animation before navigation
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          if (session) {
            router.replace("/(tabs)");
          } else {
            router.replace("/auth/login");
          }
        });
      } catch (error) {
        console.error("Auth check error:", error);
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          router.replace("/auth/login");
        });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      <View className="flex-1 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 justify-center items-center px-6 relative">
        {/* Background decoration */}
        <View className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full" />
        <View className="absolute bottom-32 right-8 w-16 h-16 bg-white/5 rounded-full" />
        <View className="absolute top-1/3 right-16 w-12 h-12 bg-white/10 rounded-full" />

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideUpAnim }],
          }}
          className="items-center"
        >
          {/* Enhanced Logo Container */}
          <Animated.View
            style={{
              transform: [{ rotate: logoRotation }],
            }}
            className="mb-8"
          >
            <View className="w-36 h-36 bg-white/95 rounded-[32px] justify-center items-center shadow-2xl relative">
              {/* Inner glow effect */}
              <View className="absolute inset-2 bg-primary-50 rounded-[24px]" />
              <Text className="text-6xl font-black text-primary-600 z-10">
                T
              </Text>
              {/* Subtle highlight */}
              <View className="absolute top-4 left-4 w-8 h-8 bg-white/40 rounded-full blur-sm" />
            </View>
          </Animated.View>

          {/* Enhanced Company Title */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }}
            className="items-center mb-20"
          >
            <Text className="text-5xl font-black text-white mb-3 text-center tracking-tight">
              Tikita
            </Text>
            <Text className="text-xl text-primary-100/90 text-center max-w-xs font-medium tracking-wide">
              Your Digital Solution Partner
            </Text>
            <View className="w-16 h-1 bg-white/40 rounded-full mt-4" />
          </Animated.View>

          {/* Enhanced Loading Dots */}
          <View className="flex-row items-center justify-center space-x-3">
            <Animated.View
              style={{
                opacity: dot1Anim,
                transform: [
                  {
                    scale: dot1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.4],
                    }),
                  },
                  {
                    translateY: dot1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -8],
                    }),
                  },
                ],
              }}
              className="w-4 h-4 bg-white rounded-full shadow-lg"
            />
            <Animated.View
              style={{
                opacity: dot2Anim,
                transform: [
                  {
                    scale: dot2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.4],
                    }),
                  },
                  {
                    translateY: dot2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -8],
                    }),
                  },
                ],
              }}
              className="w-4 h-4 bg-white rounded-full shadow-lg"
            />
            <Animated.View
              style={{
                opacity: dot3Anim,
                transform: [
                  {
                    scale: dot3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.4],
                    }),
                  },
                  {
                    translateY: dot3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -8],
                    }),
                  },
                ],
              }}
              className="w-4 h-4 bg-white rounded-full shadow-lg"
            />
          </View>

          {/* Loading text */}
          <Animated.Text
            style={{
              opacity: fadeAnim,
            }}
            className="text-white/70 text-sm font-medium mt-6 tracking-widest"
          >
            LOADING
          </Animated.Text>
        </Animated.View>
      </View>
    </>
  );
}
