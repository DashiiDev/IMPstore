-- Desabilitar RLS temporariamente para permitir acesso público
-- Em produção, você deve implementar autenticação real

ALTER TABLE chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- Ou, se preferir manter RLS habilitado, configure políticas:
-- (RECOMENDADO para produção)

-- Desabilitar RLS primeiro
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Allow public read on chats" ON chats FOR SELECT USING (true);
CREATE POLICY "Allow public read on messages" ON messages FOR SELECT USING (true);

-- Política para permitir inserção pública
CREATE POLICY "Allow public insert on chats" ON chats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on messages" ON messages FOR INSERT WITH CHECK (true);

-- Política para permitir atualização pública
CREATE POLICY "Allow public update on chats" ON chats FOR UPDATE USING (true);
CREATE POLICY "Allow public update on messages" ON messages FOR UPDATE USING (true);

-- Política para permitir deleção pública
CREATE POLICY "Allow public delete on chats" ON chats FOR DELETE USING (true);
CREATE POLICY "Allow public delete on messages" ON messages FOR DELETE USING (true);
