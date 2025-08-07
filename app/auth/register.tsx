import React, { useState, useRef } from "react";
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
import { validateEmail, validatePassword } from "@/lib/utils";
import { Image } from "@/components/ui/image";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
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
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Validate name
    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setPasswordError(passwordValidation.errors[0]);
        isValid = false;
      }
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signUp(email.trim(), password, name.trim(), name.trim());
      Alert.alert(
        "Registration Successful",
        "Please check your email to confirm your account before signing in.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/auth/login"),
          },
        ]
      );
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "An error occurred during registration";

      if (error.message?.includes("User already registered")) {
        errorMessage = "An account with this email already exists";
      } else if (
        error.message?.includes("Password should be at least 6 characters")
      ) {
        errorMessage = "Password must be at least 6 characters long";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Registration Failed", errorMessage);
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
            className="flex-1 justify-center px-6 py-8"
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

              <Text className="text-4xl font-poppins-semibold text-[#464646] mb-3">
                Daftar Sekarang
              </Text>
              <Text className="text-lg text-[#A1A1A1] text-center max-w-sm">
                Sudah punya akun?{" "}
                <Link href="/auth/login" asChild>
                  <TouchableOpacity className="ml-1">
                    <Text className="text-primary-400">Masuk</Text>
                  </TouchableOpacity>
                </Link>
              </Text>
            </Box>

            {/* Registration Form */}
            <VStack space="lg" className="mb-8">
              <FormInput
                label="Username"
                placeholder="Masukan username anda"
                value={name}
                onChangeText={setName}
                error={nameError}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
              />

              <FormInput
                label="Email Address"
                placeholder="Masukan email anda"
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
                autoComplete="new-password"
                textContentType="newPassword"
              />

              <FormInput
                label="Confirm Password"
                placeholder="Konfirmasi password anda"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={confirmPasswordError}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
              />
            </VStack>

            {/* Register Button */}
            <Button
              onPress={handleRegister}
              disabled={isLoading}
              size="xl"
              className={`mb-6 ${
                isLoading
                  ? "bg-primary-300 dark:bg-primary-700"
                  : "bg-primary-500 dark:bg-primary-600 active:bg-primary-600"
              }`}
            >
              <ButtonText>
                {isLoading ? "Membuat akun..." : "Daftar"}
              </ButtonText>
            </Button>

            {/* Terms and Privacy */}
            <Text className="text-base text-[#A1A1A1] text-center">
              Dengan mendaftar, anda setuju dengan{"\n"}
              <Text className="text-primary-600 dark:text-primary-400">
                Syarat dan Ketentuan
              </Text>{" "}
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
