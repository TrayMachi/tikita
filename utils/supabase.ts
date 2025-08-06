import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_PROJECT_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or anon key");
}

// Check if we're in a browser/React Native environment
const isClient = typeof window !== "undefined";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isClient ? AsyncStorage : undefined,
    autoRefreshToken: isClient,
    persistSession: isClient,
    detectSessionInUrl: false,
  },
});
