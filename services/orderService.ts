import { OrderDB, OrderForm } from "@/types/order";
import { supabase } from "@/utils/supabase";

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

    console.log("Attempting to create order with data:", orderData);

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

    console.log("Order created successfully:", data);
    return data as OrderDB;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
