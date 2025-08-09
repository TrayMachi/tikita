export interface Ticket {
  namaEvent: string;
  kategori: string;
  kotaEvent: string;
  lokasi: string;
  tanggal: Date;
  waktu: Date;
  tipeTicket: string;
  tipeSeat: string;
  uploadTicket: string;
  gambarThumbnail: string;
  price: number;
  enableCountdownPriceDrop: boolean;
  countdownPriceDrops: number[]; // [H-1, H-2, H-3] percentage drops
  premium: boolean;
}

// Database ticket interface matching Supabase schema
export interface TicketDB {
  id: string;
  name: string;
  category: string;
  city: string;
  location: string;
  date: string | null;
  time: string | null;
  ticket_type: string;
  seat_type: string;
  ticket_url: string | null;
  thumbnail: string | null;
  price: number;
  is_price_drop: boolean;
  price_drop: string | null;
  is_premium: boolean;
  seller_id: string;
  created_at: string;
  updated_at: string;
  sold: boolean;
}

export interface TicketFormData {
  namaEvent: string;
  kategori: string;
  kotaEvent: string;
  lokasi: string;
  tanggal: Date | null;
  waktu: Date | null;
  tipeTicket: string;
  tipeSeat: string;
  uploadTicket: string | null; // React Native uses URI strings, not File objects
  gambarThumbnail: string | null; // React Native uses URI strings, not File objects
  price: number;
  enableCountdownPriceDrop: boolean;
  countdownPriceDrops: number[]; // [H-1, H-2, H-3] percentage drops
  premium: boolean;
}

export interface FormErrors {
  namaEvent?: string;
  kategori?: string;
  kotaEvent?: string;
  lokasi?: string;
  tanggal?: string;
  waktu?: string;
  tipeTicket?: string;
  tipeSeat?: string;
  uploadTicket?: string;
  gambarThumbnail?: string;
  price?: string;
  countdownPriceDrops?: string;
  premium?: string;
}

export const kategori = [
  { label: "Konser", value: "konser" },
  { label: "Festival", value: "festival" },
  { label: "Pertunjukan", value: "pertunjukan" },
  { label: "Stand Up Comedy", value: "stand-up-comedy" },
  { label: "Teater", value: "teater" },
  { label: "Olahraga", value: "olahraga" },
  { label: "Seminar", value: "seminar" },
  { label: "Workshop", value: "workshop" },
  { label: "Lainnya", value: "lainnya" },
];

export const tipeTicket = [
    { label: "Fisik", value: "fisik" },
    { label: "Digital", value: "digital" },
  ];
  
  export const tipeSeat = [
    { label: "Reserved Seat (Kursi Bernopmor)", value: "reserved" },
    { label: "Free Seating (Bebas Duduk)", value: "free" },
    { label: "Standing (Berdiri)", value: "standing" },
  ];
  