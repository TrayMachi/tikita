import FontAwesome from "@expo/vector-icons/FontAwesome";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Import Google Fonts
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { AuthProvider } from "@/contexts/AuthContext";
import SplashUI from "./splash";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setAppReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    // Google Fonts
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    ...FontAwesome.font,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load
        if (!fontsLoaded && !fontError) {
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));

        setAppReady(true);

        await SplashScreen.hideAsync();
      } catch (error) {
        console.error("error", error)
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);

  if (!isAppReady) {
    return <SplashUI />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode="light">
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen
          name="seller/onboarding"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="seller/addticket"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="ticket/[id]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
