import { supabase } from "@/utils/supabase";
import { TicketFormData, TicketDB } from "@/types/ticket";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

export async function createTicket(
  ticketFormData: TicketFormData,
  sellerId: string
) {
  try {
    const formatDate = (date: Date | null): string | null => {
      if (!date) return null;
      return date.toISOString().split("T")[0]; // YYYY-MM-DD format
    };

    const formatTime = (time: Date | null): string | null => {
      if (!time) return null;
      return time.toTimeString().split(" ")[0]; // HH:MM:SS format
    };

    const ticketData = {
      name: ticketFormData.namaEvent,
      category: ticketFormData.kategori,
      city: ticketFormData.kotaEvent,
      location: ticketFormData.lokasi,
      date: formatDate(ticketFormData.tanggal),
      time: formatTime(ticketFormData.waktu),
      ticket_type: ticketFormData.tipeTicket,
      seat_type: ticketFormData.tipeSeat,
      ticket_url: null,
      thumbnail: null,
      price: ticketFormData.price,
      is_price_drop: ticketFormData.enableCountdownPriceDrop,
      price_drop: JSON.stringify(ticketFormData.countdownPriceDrops),
      is_premium: ticketFormData.premium,
      seller_id: sellerId,
    };

    const { data, error } = await supabase
      .from("ticket")
      .insert(ticketData)
      .select()
      .single();

    return data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
}

export async function uploadTicketImage(fileUri: string, ticketId: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User must be authenticated to upload images");
    }

    const fileName = `${user.id}_${ticketId}_${Date.now()}.jpg`;
    const filePath = fileName;

    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const arrayBuffer = decode(base64);

    const { error: uploadError } = await supabase.storage
      .from("ticket")
      .upload(filePath, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from("ticket").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading ticket image:", error);
    throw error;
  }
}

export async function uploadTicketThumbnail(fileUri: string, ticketId: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User must be authenticated to upload images");
    }

    const fileName = `${user.id}_${ticketId}_${Date.now()}.jpg`;
    const filePath = fileName;

    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const arrayBuffer = decode(base64);

    const { error: uploadError } = await supabase.storage
      .from("thumbnail")
      .upload(filePath, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from("thumbnail").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading ticket thumbnail:", error);
    throw error;
  }
}

export async function updateTicketImages(
  ticketId: string,
  ticketImageUrl: string,
  thumbnailUrl: string
) {
  try {
    const { data, error } = await supabase
      .from("ticket")
      .update({
        ticket_url: ticketImageUrl,
        thumbnail: thumbnailUrl,
      })
      .eq("id", ticketId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating ticket images:", error);
    throw error;
  }
}

// Get all tickets except the current user's tickets
export async function getAllTickets(
  currentUserId?: string
): Promise<TicketDB[]> {
  try {
    let query = supabase
      .from("ticket")
      .select("*")
      .order("created_at", { ascending: false });

    // Exclude current user's tickets if userId is provided
    if (currentUserId) {
      query = query.neq("seller_id", currentUserId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
}

// Get premium tickets for flash ticket section
export async function getPremiumTickets(
  currentUserId?: string
): Promise<TicketDB[]> {
  try {
    let query = supabase
      .from("ticket")
      .select("*")
      .eq("is_premium", true)
      .order("created_at", { ascending: false })
      .limit(10);

    // Exclude current user's tickets if userId is provided
    if (currentUserId) {
      query = query.neq("seller_id", currentUserId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching premium tickets:", error);
    throw error;
  }
}

// Search tickets by name or category
export async function searchTickets(
  searchTerm: string,
  currentUserId?: string
): Promise<TicketDB[]> {
  try {
    let query = supabase
      .from("ticket")
      .select("*")
      .or(
        `name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`
      )
      .order("created_at", { ascending: false });

    // Exclude current user's tickets if userId is provided
    if (currentUserId) {
      query = query.neq("seller_id", currentUserId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error searching tickets:", error);
    throw error;
  }
}

// Get tickets by category
export async function getTicketsByCategory(
  category: string,
  currentUserId?: string
): Promise<TicketDB[]> {
  try {
    let query = supabase
      .from("ticket")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    // Exclude current user's tickets if userId is provided
    if (currentUserId) {
      query = query.neq("seller_id", currentUserId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching tickets by category:", error);
    throw error;
  }
}
