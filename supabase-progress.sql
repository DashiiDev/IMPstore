-- Adicionar colunas para suportar atualizações de progresso
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_progress_update BOOLEAN DEFAULT false;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS progress_data JSONB;
