-- Adicionar colunas para salvar dados de progresso na tabela chats
ALTER TABLE chats ADD COLUMN IF NOT EXISTS current_rank TEXT;
ALTER TABLE chats ADD COLUMN IF NOT EXISTS desired_rank TEXT;
ALTER TABLE chats ADD COLUMN IF NOT EXISTS current_division INTEGER DEFAULT 1;
ALTER TABLE chats ADD COLUMN IF NOT EXISTS current_progress INTEGER DEFAULT 0;
ALTER TABLE chats ADD COLUMN IF NOT EXISTS initial_rank TEXT;
