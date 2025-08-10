import {
  BargainChat,
  BargainMessage,
  BargainChatWithDetails,
} from "@/types/bargain";
import { TicketDB } from "@/types/ticket";

// Mock data for development - will be replaced with Supabase integration
let mockChats: BargainChatWithDetails[] = [];
let mockMessages: { [chatId: string]: BargainMessage[] } = {};

// Generate mock data - DYNAMIC PERSPECTIVE (supports all 4 users)
const generateMockData = () => {
  const currentUser = getCurrentUserId();
  const sampleTickets: TicketDB[] = [
    {
      id: "ticket-1",
      name: "Konser Raisa - Love Stories Tour 2024",
      category: "konser",
      city: "Jakarta",
      location: "ICE BSD",
      date: "2024-06-15",
      time: "19:00:00",
      ticket_type: "digital",
      seat_type: "reserved",
      ticket_url: null,
      thumbnail:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=200&fit=crop",
      price: 750000,
      is_price_drop: false,
      price_drop: null,
      is_premium: true,
      seller_id: "seller-1",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
      sold: false,
    },
    {
      id: "ticket-2",
      name: "Festival Jazz Jakarta 2024",
      category: "festival",
      city: "Jakarta",
      location: "JIExpo Kemayoran",
      date: "2024-07-20",
      time: "18:00:00",
      ticket_type: "fisik",
      seat_type: "free",
      ticket_url: null,
      thumbnail:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
      price: 450000,
      is_price_drop: false,
      price_drop: null,
      is_premium: false,
      seller_id: "seller-2",
      created_at: "2024-01-10T14:30:00Z",
      updated_at: "2024-01-10T14:30:00Z",
      sold: false,
    },
    {
      id: "ticket-3",
      name: "Stand Up Comedy Show - Raditya Dika",
      category: "stand-up-comedy",
      city: "Bandung",
      location: "Trans Studio Bandung",
      date: "2024-08-10",
      time: "20:00:00",
      ticket_type: "digital",
      seat_type: "reserved",
      ticket_url: null,
      thumbnail:
        "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=300&h=200&fit=crop",
      price: 350000,
      is_price_drop: false,
      price_drop: null,
      is_premium: false,
      seller_id: "seller-1",
      created_at: "2024-01-12T16:20:00Z",
      updated_at: "2024-01-12T16:20:00Z",
      sold: false,
    },
    {
      id: "ticket-4",
      name: "Coldplay Music of The Spheres World Tour",
      category: "konser",
      city: "Jakarta",
      location: "Gelora Bung Karno Stadium",
      date: "2024-09-15",
      time: "19:30:00",
      ticket_type: "digital",
      seat_type: "reserved",
      ticket_url: null,
      thumbnail:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=200&fit=crop",
      price: 1200000,
      is_price_drop: false,
      price_drop: null,
      is_premium: true,
      seller_id: "seller-2",
      created_at: "2024-01-08T09:00:00Z",
      updated_at: "2024-01-08T09:00:00Z",
      sold: false,
    },
  ];

  // DYNAMIC CHAT GENERATION based on current user perspective
  const allUsers = {
    "buyer-1": {
      id: "buyer-1",
      name: "Ahmad Rizki",
      email: "ahmad.rizki@gmail.com",
    },
    "buyer-2": {
      id: "buyer-2",
      name: "Sari Indah",
      email: "sari.indah@yahoo.com",
    },
    "seller-1": {
      id: "seller-1",
      name: "Sarah Music Store",
      email: "sarah@musicstore.com",
    },
    "seller-2": {
      id: "seller-2",
      name: "Event Paradise",
      email: "info@eventparadise.com",
    },
  };

  // Create all possible chats between users and tickets
  const allChats: BargainChatWithDetails[] = [
    // Chat 1: buyer-1 (Ahmad) wants Raisa ticket from seller-1 (Sarah)
    {
      id: "chat-1",
      ticket_id: "ticket-1",
      buyer_id: "buyer-1",
      seller_id: "seller-1",
      status: "active",
      created_at: "2024-01-20T10:00:00Z",
      updated_at: "2024-01-20T16:45:00Z",
      ticket: sampleTickets[0],
      buyer: allUsers["buyer-1"],
      seller: allUsers["seller-1"],
      last_message: {
        id: "msg-1-last",
        chat_id: "chat-1",
        sender_id: "buyer-1",
        message_type: "offer",
        content: "Bagaimana kalau dengan harga ini kak?",
        offer_price: 650000,
        created_at: "2024-01-20T16:45:00Z",
      },
      unread_count: currentUser === "seller-1" ? 1 : 0,
    },

    // Chat 2: buyer-2 (Sari) wants same Raisa ticket from seller-1 (Sarah)
    {
      id: "chat-2",
      ticket_id: "ticket-1",
      buyer_id: "buyer-2",
      seller_id: "seller-1",
      status: "active",
      created_at: "2024-01-20T14:00:00Z",
      updated_at: "2024-01-20T17:20:00Z",
      ticket: sampleTickets[0],
      buyer: allUsers["buyer-2"],
      seller: allUsers["seller-1"],
      last_message: {
        id: "msg-2-last",
        chat_id: "chat-2",
        sender_id: "buyer-2",
        message_type: "offer",
        content: "Harga aslinya terlalu mahal, bisa nego tidak?",
        offer_price: 600000,
        created_at: "2024-01-20T17:20:00Z",
      },
      unread_count: currentUser === "seller-1" ? 1 : 0,
    },

    // Chat 3: buyer-1 (Ahmad) wants Jazz ticket from seller-2 (Event Paradise)
    {
      id: "chat-3",
      ticket_id: "ticket-2",
      buyer_id: "buyer-1",
      seller_id: "seller-2",
      status: "active",
      created_at: "2024-01-19T09:00:00Z",
      updated_at: "2024-01-20T12:30:00Z",
      ticket: sampleTickets[1],
      buyer: allUsers["buyer-1"],
      seller: allUsers["seller-2"],
      last_message: {
        id: "msg-3-last",
        chat_id: "chat-3",
        sender_id: "buyer-1",
        message_type: "offer",
        content: "350rb final offer saya, bagaimana?",
        offer_price: 350000,
        created_at: "2024-01-20T12:30:00Z",
      },
      unread_count: currentUser === "seller-2" ? 1 : 0,
    },

    // Chat 4: buyer-2 (Sari) wants Comedy ticket from seller-1 (Sarah)
    {
      id: "chat-4",
      ticket_id: "ticket-3",
      buyer_id: "buyer-2",
      seller_id: "seller-1",
      status: "active",
      created_at: "2024-01-21T08:15:00Z",
      updated_at: "2024-01-21T09:30:00Z",
      ticket: sampleTickets[2],
      buyer: allUsers["buyer-2"],
      seller: allUsers["seller-1"],
      last_message: {
        id: "msg-4-last",
        chat_id: "chat-4",
        sender_id: "buyer-2",
        message_type: "offer",
        content: "Budget terbatas, boleh nego tidak?",
        offer_price: 280000,
        created_at: "2024-01-21T09:30:00Z",
      },
      unread_count: currentUser === "seller-1" ? 1 : 0,
    },

    // Chat 5: buyer-1 (Ahmad) wants Coldplay ticket from seller-2 (Event Paradise)
    {
      id: "chat-5",
      ticket_id: "ticket-4",
      buyer_id: "buyer-1",
      seller_id: "seller-2",
      status: "active",
      created_at: "2024-01-18T11:00:00Z",
      updated_at: "2024-01-18T15:45:00Z",
      ticket: sampleTickets[3],
      buyer: allUsers["buyer-1"],
      seller: allUsers["seller-2"],
      last_message: {
        id: "msg-5-last",
        chat_id: "chat-5",
        sender_id: "buyer-1",
        message_type: "offer",
        content: "Harga Coldplay memang mahal, tapi ini maksimal budget saya",
        offer_price: 1000000,
        created_at: "2024-01-18T15:45:00Z",
      },
      unread_count: currentUser === "seller-2" ? 1 : 0,
    },

    // Chat 6: buyer-2 (Sari) successfully bought Coldplay ticket from seller-2
    {
      id: "chat-6",
      ticket_id: "ticket-4",
      buyer_id: "buyer-2",
      seller_id: "seller-2",
      status: "accepted",
      final_price: 1100000,
      created_at: "2024-01-17T14:20:00Z",
      updated_at: "2024-01-17T16:30:00Z",
      ticket: sampleTickets[3],
      buyer: allUsers["buyer-2"],
      seller: allUsers["seller-2"],
      last_message: {
        id: "msg-6-last",
        chat_id: "chat-6",
        sender_id: "seller-2",
        message_type: "accept",
        content: "Deal! Penawaran diterima 🎉",
        offer_price: 1100000,
        created_at: "2024-01-17T16:30:00Z",
      },
      unread_count: 0,
    },
  ];

  // STATIC: Always show 4 chats (2 buyer scenarios + 2 seller scenarios)
  // This ensures every user sees both buyer and seller perspectives
  const selectedChatIds = ["chat-1", "chat-2", "chat-3", "chat-4"];

  mockChats = selectedChatIds
    .map((chatId) => allChats.find((chat) => chat.id === chatId))
    .filter(Boolean) as BargainChatWithDetails[];

  console.log(
    `Always showing 4 static chats for any user: ${currentUser} (${
      getUserProfile(currentUser).name
    })`
  );

  // DYNAMIC MESSAGES: Generate messages for all chats
  mockMessages = {
    // Chat 1: Ahmad Rizki - NEEDS SELLER DECISION (Offer: 650k for 750k ticket)
    "chat-1": [
      {
        id: "msg-1-1",
        chat_id: "chat-1",
        sender_id: "buyer-1", // Ahmad Rizki
        message_type: "text",
        content:
          "Halo, saya tertarik dengan tiket konser Raisa ini. Apakah masih tersedia?",
        created_at: "2024-01-20T10:00:00Z",
      },
      {
        id: "msg-1-2",
        chat_id: "chat-1",
        sender_id: "seller-1", // Current user (seller)
        message_type: "text",
        content: "Halo! Ya masih tersedia. Harga tiketnya 750rb.",
        created_at: "2024-01-20T10:15:00Z",
      },
      {
        id: "msg-1-3",
        chat_id: "chat-1",
        sender_id: "buyer-1",
        message_type: "text",
        content: "Boleh nego tidak kak? Harga segitu agak mahal untuk saya 😅",
        created_at: "2024-01-20T16:30:00Z",
      },
      {
        id: "msg-1-4",
        chat_id: "chat-1",
        sender_id: "buyer-1", // PENDING OFFER
        message_type: "offer",
        content:
          "Saya tertarik dengan tiket Raisa ini. Bagaimana kalau dengan harga ini?",
        offer_price: 650000,
        created_at: "2024-01-20T16:45:00Z",
      },
    ],

    // Chat 2: Sari Indah - NEEDS SELLER DECISION (Offer: 600k for same 750k ticket)
    "chat-2": [
      {
        id: "msg-2-1",
        chat_id: "chat-2",
        sender_id: "buyer-2", // Sari Indah
        message_type: "text",
        content: "Halo ka, saya lihat tiket konser Raisa. Masih ada?",
        created_at: "2024-01-20T14:00:00Z",
      },
      {
        id: "msg-2-2",
        chat_id: "chat-2",
        sender_id: "seller-1", // Current user (seller)
        message_type: "text",
        content: "Halo! Masih ada kok. Harganya 750rb.",
        created_at: "2024-01-20T14:10:00Z",
      },
      {
        id: "msg-2-3",
        chat_id: "chat-2",
        sender_id: "buyer-2", // PENDING OFFER
        message_type: "offer",
        content: "Harga aslinya terlalu mahal untuk saya, bisa nego tidak?",
        offer_price: 600000,
        created_at: "2024-01-20T17:20:00Z",
      },
    ],

    // Chat 3: Budi Santoso - NEEDS SELLER DECISION (Offer: 350k for 450k ticket)
    "chat-3": [
      {
        id: "msg-3-1",
        chat_id: "chat-3",
        sender_id: "buyer-3", // Budi Santoso
        message_type: "text",
        content: "Halo, saya tertarik dengan tiket Jazz Festival.",
        created_at: "2024-01-19T09:00:00Z",
      },
      {
        id: "msg-3-2",
        chat_id: "chat-3",
        sender_id: "seller-1", // Current user (seller)
        message_type: "text",
        content: "Halo! Tiket jazz masih tersedia. Harganya 450rb.",
        created_at: "2024-01-19T09:15:00Z",
      },
      {
        id: "msg-3-3",
        chat_id: "chat-3",
        sender_id: "buyer-3",
        message_type: "text",
        content: "Agak mahal ya, bisa kurang tidak?",
        created_at: "2024-01-19T11:20:00Z",
      },
      {
        id: "msg-3-4",
        chat_id: "chat-3",
        sender_id: "seller-1", // Current user (seller)
        message_type: "text",
        content: "Paling rendah bisa 380rb deh.",
        created_at: "2024-01-19T12:00:00Z",
      },
      {
        id: "msg-3-5",
        chat_id: "chat-3",
        sender_id: "buyer-3", // PENDING OFFER
        message_type: "offer",
        content: "350rb final offer saya, bagaimana?",
        offer_price: 350000,
        created_at: "2024-01-20T12:30:00Z",
      },
    ],

    // Chat 4: Maya Putri - NEEDS SELLER DECISION (Offer: 280k for 350k ticket)
    "chat-4": [
      {
        id: "msg-4-1",
        chat_id: "chat-4",
        sender_id: "buyer-4", // Maya Putri
        message_type: "text",
        content:
          "Halo kak! Saya mahasiswa, tertarik tiket comedy show Raditya Dika.",
        created_at: "2024-01-21T08:15:00Z",
      },
      {
        id: "msg-4-2",
        chat_id: "chat-4",
        sender_id: "seller-1", // Current user (seller)
        message_type: "text",
        content: "Halo! Tiketnya 350rb ya.",
        created_at: "2024-01-21T08:30:00Z",
      },
      {
        id: "msg-4-3",
        chat_id: "chat-4",
        sender_id: "buyer-4", // PENDING OFFER
        message_type: "offer",
        content: "Boleh nego tidak? Saya mahasiswa, budget terbatas 😅",
        offer_price: 280000,
        created_at: "2024-01-21T09:30:00Z",
      },
    ],
  };
};

// Initialize mock data
generateMockData();

// Service functions
export async function getUserChats(
  userId: string
): Promise<BargainChatWithDetails[]> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // STATIC: Always return all 4 chats regardless of userId
    const userChats = mockChats;

    // Sort by last message time
    return userChats.sort((a, b) => {
      const aTime = a.last_message?.created_at || a.updated_at;
      const bTime = b.last_message?.created_at || b.updated_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  } catch (error) {
    console.error("Error fetching user chats:", error);
    throw error;
  }
}

export async function getChatMessages(
  chatId: string
): Promise<BargainMessage[]> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return mockMessages[chatId] || [];
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  content: string,
  messageType: BargainMessage["message_type"] = "text",
  offerPrice?: number
): Promise<BargainMessage> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const newMessage: BargainMessage = {
      id: `msg-${Date.now()}`,
      chat_id: chatId,
      sender_id: senderId,
      message_type: messageType,
      content,
      offer_price: offerPrice,
      created_at: new Date().toISOString(),
    };

    // Add to mock messages
    if (!mockMessages[chatId]) {
      mockMessages[chatId] = [];
    }
    mockMessages[chatId].push(newMessage);

    // Update chat's last message
    const chatIndex = mockChats.findIndex((chat) => chat.id === chatId);
    if (chatIndex !== -1) {
      mockChats[chatIndex].last_message = newMessage;
      mockChats[chatIndex].updated_at = new Date().toISOString();
    }

    return newMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function createBargainChat(
  ticketId: string,
  buyerId: string,
  sellerId: string
): Promise<BargainChat> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check if chat already exists
    const existingChat = mockChats.find(
      (chat) => chat.ticket_id === ticketId && chat.buyer_id === buyerId
    );

    if (existingChat) {
      throw new Error("Chat already exists for this ticket");
    }

    const newChat: BargainChat = {
      id: `chat-${Date.now()}`,
      ticket_id: ticketId,
      buyer_id: buyerId,
      seller_id: sellerId,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Note: In real implementation, we would also create the chat with details
    // For now, this is just the basic chat structure

    return newChat;
  } catch (error) {
    console.error("Error creating bargain chat:", error);
    throw error;
  }
}

export async function acceptOffer(
  chatId: string,
  senderId: string,
  offerPrice: number
): Promise<BargainMessage> {
  try {
    // Update chat status to accepted
    const chatIndex = mockChats.findIndex((chat) => chat.id === chatId);
    if (chatIndex !== -1) {
      mockChats[chatIndex].status = "accepted";
      mockChats[chatIndex].final_price = offerPrice;
      mockChats[chatIndex].updated_at = new Date().toISOString();
    }

    // Send accept message
    return await sendMessage(
      chatId,
      senderId,
      "Penawaran diterima!",
      "accept",
      offerPrice
    );
  } catch (error) {
    console.error("Error accepting offer:", error);
    throw error;
  }
}

export async function rejectOffer(
  chatId: string,
  senderId: string
): Promise<BargainMessage> {
  try {
    // Send reject message
    return await sendMessage(chatId, senderId, "Penawaran ditolak", "reject");
  } catch (error) {
    console.error("Error rejecting offer:", error);
    throw error;
  }
}

export async function sendCounterOffer(
  chatId: string,
  senderId: string,
  counterPrice: number,
  message?: string
): Promise<BargainMessage> {
  try {
    return await sendMessage(
      chatId,
      senderId,
      message || "Saya tawar balik dengan harga ini",
      "counter_offer",
      counterPrice
    );
  } catch (error) {
    console.error("Error sending counter offer:", error);
    throw error;
  }
}

export async function getChatById(
  chatId: string
): Promise<BargainChatWithDetails | null> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const chat = mockChats.find((chat) => chat.id === chatId);
    return chat || null;
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
    throw error;
  }
}

// Current mock user - can be changed to test different perspectives
let currentMockUserId: "buyer-1" | "buyer-2" | "seller-1" | "seller-2" =
  "buyer-1";

// Helper function to get the current user ID (mock implementation)
export function getCurrentUserId(): string {
  // In real implementation, this would get the user ID from auth context
  return currentMockUserId;
}

// Helper function to switch between user perspectives for testing
export function switchUserPerspective(
  userId: "buyer-1" | "buyer-2" | "seller-1" | "seller-2"
): void {
  // This is a testing utility to switch between different user perspectives
  console.log(`Switching from ${currentMockUserId} to ${userId}`);
  currentMockUserId = userId;

  // Regenerate mock data for the new perspective
  generateMockData();
  console.log(`✅ Switched to user perspective: ${userId}`);
}

// Helper function to get user profile by ID
export function getUserProfile(userId: string) {
  const profiles = {
    "buyer-1": {
      id: "buyer-1",
      name: "Ahmad Rizki",
      email: "ahmad.rizki@gmail.com",
      role: "buyer",
    },
    "buyer-2": {
      id: "buyer-2",
      name: "Sari Indah",
      email: "sari.indah@yahoo.com",
      role: "buyer",
    },
    "seller-1": {
      id: "seller-1",
      name: "Sarah Music Store",
      email: "sarah@musicstore.com",
      role: "seller",
    },
    "seller-2": {
      id: "seller-2",
      name: "Event Paradise",
      email: "info@eventparadise.com",
      role: "seller",
    },
  };
  return profiles[userId as keyof typeof profiles] || profiles["buyer-1"];
}
