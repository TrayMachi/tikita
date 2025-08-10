import { TicketDB } from "./ticket";

export interface OrderDB {
  id: string;
  seller_id: string;
  buyer_id: string;
  ticket_id: string;
  no: string;
  method: string;
  nama: string;
  email: string;
  nomor_hp: string;
  nomor_id: string;
  price: number;
  status: "processing" | "received" | "confirmed" | "onBid";
  created_at: string;
  updated_at: string;
}

export interface OrderForm {
  sellerId: string;
  buyerId: string;
  ticketId: string;
  no: string;
  metodePembayaran: string;
  nama: string;
  email: string;
  nomorHP: string;
  nomorKartuIdentitas: string;
  price: number;
  status: "processing" | "received" | "confirmed" | "onBid";
}

export interface OrderWithDetails<T = 'seller'> extends OrderDB {
  ticket: TicketDB;
  seller: T extends 'seller' ? {
    id: string;
    nama: string;
  } : never;
  buyer: T extends 'buyer' ? {
    id: string;
    name: string;
  } : never;
}

export interface GetOrdersOptions {
  limit?: number;
  offset?: number;
  status?: OrderDB["status"][];
  sortBy?: "created_at" | "updated_at" | "price";
  sortOrder?: "asc" | "desc";
}