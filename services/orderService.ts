import {
  OrderDB,
  OrderForm,
  OrderWithDetails,
  GetOrdersOptions,
} from "@/types/order";
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

export const getOrdersByBuyerId = async (
  userId: string,
  options: GetOrdersOptions = {}
): Promise<OrderWithDetails<"seller">[]> => {
  const {
    limit = 50,
    offset = 0,
    status,
    sortBy = "created_at",
    sortOrder = "desc",
  } = options;

  let query = supabase
    .from("orders")
    .select(
      `
      *,
      ticket:ticket_id (
        id,
        name,
        category,
        city,
        location,
        date,
        time,
        ticket_type,
        ticket_url,
        seat_type,
        thumbnail,
        price,
        is_premium,
        sold
      ),
      seller:seller_id (
        id,
        nama
      )
    `
    )
    .eq("buyer_id", userId)
    .order(sortBy, { ascending: sortOrder === "asc" })
    .range(offset, offset + limit - 1);

  if (status && status.length > 0) {
    query = query.in("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase error getting orders with details:", error);
    throw new Error(`Database error: ${error.message}`);
  }

  return data as OrderWithDetails<"seller">[];
};

export const getOrdersBySellerId = async (
  sellerId: string,
  options: GetOrdersOptions = {}
): Promise<OrderWithDetails<"buyer">[]> => {
  const {
    limit = 50,
    offset = 0,
    status,
    sortBy = "created_at",
    sortOrder = "desc",
  } = options;

  let query = supabase
    .from("orders")
    .select(
      `
      *,
      ticket:ticket_id (
        id,
        name,
        category,
        city,
        location,
        date,
        time,
        ticket_type,
        seat_type,
        ticket_url,
        thumbnail,
        price,
        is_premium,
        sold
      ),
      profiles:buyer_id (
        id,
        full_name
      )
    `
    )
    .eq("seller_id", sellerId)
    .order(sortBy, { ascending: sortOrder === "asc" })
    .range(offset, offset + limit - 1);

  if (status && status.length > 0) {
    query = query.in("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase error getting seller orders:", error);
    throw new Error(`Database error: ${error.message}`);
  }

  return data as OrderWithDetails<"buyer">[];
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

export const updateOrderStatus = async (
  orderId: string,
  status: "received" | "confirmed" | "onBid" | "declined"
) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status: status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Supabase error updating order status:", error);
    throw new Error(`Database error: ${error.message}`);
  }

  return data as OrderDB;
};
