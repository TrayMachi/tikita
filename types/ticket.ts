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
