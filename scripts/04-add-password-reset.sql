-- Adicionar colunas para recuperação de senha
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_expires TIMESTAMP;

-- Atualizar senha padrão para todos os usuários
UPDATE users SET password = 'admin123' WHERE password IS NULL OR password = '';

-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
