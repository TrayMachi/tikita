import { supabase } from "@/utils/supabase";
import type { Seller, SellerFormData } from "@/types/seller";

/**
 * Check if a user is already a seller
 */
export async function checkSellerStatus(
  userId: string
): Promise<Seller | null> {
  try {
    const { data, error } = await supabase
      .from("seller")
      .select("*")
      .eq("userId", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "Row not found" error
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error checking seller status:", error);
    throw error;
  }
}

/**
 * Create a new seller record
 */
export async function createSeller(
  userId: string,
  formData: SellerFormData
): Promise<Seller> {
  try {
    const sellerData = {
      userId: userId,
      NIK: formData.NIK,
      nama: formData.nama,
      linkKtp: formData.linkKtp,
      linkSelfieKtp: formData.linkSelfieKtp,
      created_at: new Date().toISOString(),
      isVerified: true, // Set back to false for proper verification workflow
      isActive: true,
    };

    const { data, error } = await supabase
      .from("seller")
      .insert(sellerData)
      .select()
      .single();

    if (error) {
      // Handle specific error cases
      if (error.code === "42501") {
        throw new Error(
          "Permission denied. Please ensure you are properly authenticated and have the necessary permissions to create a seller account."
        );
      }
      if (error.code === "23505") {
        // Unique constraint violation (likely NIK already exists)
        throw new Error(
          "This NIK is already registered. Please check your NIK or contact support if you believe this is an error."
        );
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating seller:", error);
    throw error;
  }
}

/**
 * Upload image to Supabase storage
 */
export async function uploadSellerImage(
  file: File | Blob,
  userId: string,
  imageType: "ktp" | "selfie"
): Promise<string> {
  try {
    const fileExt = file instanceof File ? file.name.split(".").pop() : "jpg";
    const fileName = `${userId}_${imageType}_${Date.now()}.${fileExt}`;
    const filePath = `seller-documents/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("seller-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("seller-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

/**
 * Check if NIK is already taken
 */
export async function checkNIKAvailability(nik: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("seller")
      .select("NIK")
      .eq("NIK", nik)
      .single();

    if (error && error.code === "PGRST116") {
      // NIK not found, so it's available
      return true;
    }

    if (error) throw error;

    // NIK found, so it's taken
    return false;
  } catch (error) {
    console.error("Error checking NIK availability:", error);
    throw error;
  }
}

/**
 * Update seller verification status
 */
export async function updateSellerVerification(
  sellerId: string,
  isVerified: boolean
): Promise<void> {
  try {
    const { error } = await supabase
      .from("seller")
      .update({ isVerified })
      .eq("id", sellerId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating seller verification:", error);
    throw error;
  }
}

/**
 * Get seller dashboard data
 */
export async function getSellerDashboardData(sellerId: string) {
  try {
    // You can expand this to include seller-specific data like:
    // - Total tickets sold
    // - Revenue
    // - Active listings
    // - Recent transactions

    const { data: seller, error } = await supabase
      .from("seller")
      .select("*")
      .eq("id", sellerId)
      .single();

    if (error) throw error;

    // Add more queries here for dashboard metrics

    return {
      seller,
      // Add other dashboard data here
    };
  } catch (error) {
    console.error("Error fetching seller dashboard data:", error);
    throw error;
  }
}
