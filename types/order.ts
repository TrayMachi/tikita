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
  status: "processing" | "received" | "onBid";
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
  status: "processing" | "received" | "onBid";
}
