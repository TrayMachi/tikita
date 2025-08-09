export interface OrderDB {
  id: string;
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
