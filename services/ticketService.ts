import { supabase } from "@/utils/supabase";
import { Ticket, TicketFormData } from "@/types/ticket";

export async function createTicket(
  ticketFormData: TicketFormData,
  sellerId: string
) {
  try {
    const ticketData = {
      name: ticketFormData.namaEvent,
      category: ticketFormData.kategori,
      city: ticketFormData.kotaEvent,
      location: ticketFormData.lokasi,
      date: ticketFormData.tanggal,
      time: ticketFormData.waktu,
      ticket_type: ticketFormData.tipeTicket,
      seat_type: ticketFormData.tipeSeat,
      ticket_url: ticketFormData.uploadTicket, // Will be updated later with uploaded URL
      thumbnail: ticketFormData.gambarThumbnail, // Will be updated later with uploaded URL
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
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
}

export async function uploadTicketImage(fileUri: string, ticketId: string) {
  try {
    // Convert React Native URI to blob for Supabase upload
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const fileExt = fileUri.split(".").pop() || "jpg";
    const fileName = `${ticketId}_${Date.now()}.${fileExt}`;
    const filePath = `ticket/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("ticket")
      .upload(filePath, blob);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("ticket").getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading ticket image:", error);
    throw error;
  }
}

export async function uploadTicketThumbnail(fileUri: string, ticketId: string) {
  try {
    // Convert React Native URI to blob for Supabase upload
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const fileExt = fileUri.split(".").pop() || "jpg";
    const fileName = `${ticketId}_${Date.now()}.${fileExt}`;
    const filePath = `thumbnail/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("thumbnail")
      .upload(filePath, blob);
    if (uploadError) throw uploadError;

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
