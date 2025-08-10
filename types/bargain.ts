export interface BargainChat {
  id: string;
  ticket_id: string;
  buyer_id: string;
  seller_id: string;
  status: "active" | "accepted" | "rejected" | "completed";
  final_price?: number;
  created_at: string;
  updated_at: string;
}

export interface BargainMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  message_type:
    | "text"
    | "offer"
    | "accept"
    | "reject"
    | "counter_offer"
    | "system";
  content: string;
  offer_price?: number;
  created_at: string;
}

export interface BargainChatWithDetails extends BargainChat {
  ticket: {
    id: string;
    name: string;
    price: number;
    thumbnail: string | null;
    category: string;
    date: string | null;
    location: string;
  };
  buyer: {
    id: string;
    name: string;
    email: string;
  };
  seller: {
    id: string;
    name: string;
    email: string;
  };
  last_message?: BargainMessage;
  unread_count?: number;
}

export interface ChatParticipant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Mock database schema documentation
export const BARGAIN_CHAT_SCHEMA = `
-- Table: bargain_chats
CREATE TABLE bargain_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES ticket(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'accepted', 'rejected', 'completed')),
  final_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ticket_id, buyer_id) -- One chat per ticket per buyer
);

-- Table: bargain_messages
CREATE TABLE bargain_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES bargain_chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'offer', 'accept', 'reject', 'counter_offer', 'system')),
  content TEXT NOT NULL,
  offer_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bargain_chats_buyer ON bargain_chats(buyer_id);
CREATE INDEX idx_bargain_chats_seller ON bargain_chats(seller_id);
CREATE INDEX idx_bargain_chats_ticket ON bargain_chats(ticket_id);
CREATE INDEX idx_bargain_messages_chat ON bargain_messages(chat_id, created_at);

-- RLS Policies
ALTER TABLE bargain_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bargain_messages ENABLE ROW LEVEL SECURITY;

-- Users can only see chats they are part of
CREATE POLICY "Users can view their own chats" ON bargain_chats
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Users can only see messages from chats they are part of  
CREATE POLICY "Users can view their chat messages" ON bargain_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bargain_chats 
      WHERE id = chat_id 
      AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    )
  );
`;
