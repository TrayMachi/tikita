import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  Animated,
  StatusBar,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Stack } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { FormInput } from "@/components/ui/FormInput";
import { validateEmail } from "@/lib/utils";
import { Image } from "@/components/ui/image";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validate email
    if (!email.trim()) {
      setEmailError("Email wajib diisi");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Email tidak valid");
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError("Password wajib diisi");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "An error occurred during login";

      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email atau password salah";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please check your email and confirm your account";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 bg-background-0 dark:bg-background-950"
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="flex-1 justify-center px-6 py-12"
          >
            {/* Header */}
            <Box className="items-center mb-10">
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ scale: fadeAnim }],
                }}
                className="mb-9"
              >
                <Image
                  source={require("@/assets/images/LogoTikita.webp")}
                  className="w-[111px] h-[100px]"
                  alt="logo"
                />
              </Animated.View>

              <Text className="text-4xl font-poppins font-semibold text-typography-900 dark:text-typography-50 mb-3 tracking-tight">
                Masuk Kembali
              </Text>
              <Text className="text-lg text-typography-500 dark:text-typography-400 text-center max-w-sm leading-relaxed">
                Belom punya akun?{" "}
                <Link href="/auth/register" asChild>
                  <TouchableOpacity className="ml-1">
                    <Text className="font-bold text-primary-400">
                      Daftar
                    </Text>
                  </TouchableOpacity>
                </Link>
              </Text>
            </Box>

            {/* Login Form */}
            <VStack space="lg" className="mb-8">
              <FormInput
                label="Email Address"
                placeholder="Masukan username anda"
                value={email}
                onChangeText={setEmail}
                error={emailError}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />

              <FormInput
                label="Password"
                placeholder="Masukan password anda"
                value={password}
                onChangeText={setPassword}
                error={passwordError}
                secureTextEntry
                autoComplete="password"
                textContentType="password"
              />
            </VStack>

            {/* Login Button */}
            <Button
              onPress={handleLogin}
              disabled={isLoading}
              size="xl"
              className={`mb-8 rounded-xl shadow-lg ${
                isLoading
                  ? "bg-primary-300 dark:bg-primary-700"
                  : "bg-primary-500 dark:bg-primary-600 active:bg-primary-600"
              }`}
            >
              <ButtonText className="text-white font-bold text-lg">
                {isLoading ? "Memasuki..." : "Masuk"}
              </ButtonText>
            </Button>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-typography-500 dark:text-typography-400 text-base">
                Butuh bantuan?{" "}
              </Text>
              <Link href="/auth/register" asChild>
                <TouchableOpacity className="ml-1">
                  <Text className="text-primary-600 dark:text-primary-400 font-bold text-base">
                    Hubungi Tikita Care
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
