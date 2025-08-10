import { OrderDB, OrderForm } from "@/types/order";
import { supabase } from "@/utils/supabase";
import { TicketDB } from "@/types/ticket";

export const getOrderById = async (
  id: string
): Promise<{ order: OrderDB; ticket: TicketDB }> => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase error getting order:", error);
    throw new Error(`Database error: ${error.message}`);
  }

  const ticket = await supabase
    .from("ticket")
    .select("*")
    .eq("id", data?.ticket_id)
    .single();

  if (ticket.error) {
    console.error("Supabase error getting ticket:", ticket.error);
    throw new Error(`Database error: ${ticket.error.message}`);
  }

  return { order: data, ticket: ticket.data };
};

export const createOrder = async (order: OrderForm) => {
  try {
    const orderData = {
      buyer_id: order.buyerId,
      ticket_id: order.ticketId,
      seller_id: order.sellerId,
      no: order.no,
      method: order.metodePembayaran,
      nama: order.nama,
      email: order.email,
      nomor_hp: order.nomorHP,
      nomor_id: order.nomorKartuIdentitas,
      price: order.price,
      status: order.status,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating order:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      console.error("No data returned from order creation");
      throw new Error("Order creation failed - no data returned");
    }

    await supabase
      .from("ticket")
      .update({ sold: true })
      .eq("id", order.ticketId);

    return data as OrderDB;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
