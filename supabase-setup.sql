-- Criar tabelas para o sistema de chat

-- Tabela de chats
CREATE TABLE IF NOT EXISTS chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id TEXT UNIQUE NOT NULL,
  game TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id TEXT NOT NULL REFERENCES chats(chat_id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  sender_name TEXT,
  sender_image TEXT,
  sender_role TEXT,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chats_chat_id ON chats(chat_id);

-- Habilitar realtime para mensagens
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
