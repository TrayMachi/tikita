import { supabase } from "@/utils/supabase";
import { TicketFormData } from "@/types/ticket";
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
