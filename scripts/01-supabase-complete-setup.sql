-- Limpar dados existentes (se houver)
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Criar tabela de usuários
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de leads
CREATE TABLE leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    status VARCHAR(50) DEFAULT 'novo',
    source VARCHAR(100),
    notes TEXT,
    value DECIMAL(10,2),
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de clientes
CREATE TABLE clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    address TEXT,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir usuário admin com senha correta
INSERT INTO users (email, name, role, password) VALUES 
('admin@exudustech.com.br', 'Administrador', 'admin', 'admin123');

-- Inserir dados de exemplo
INSERT INTO users (email, name, role, password) VALUES 
('manager@exudustech.com.br', 'Gerente', 'manager', 'admin123'),
('user@exudustech.com.br', 'Usuário', 'user', 'admin123');

-- Inserir leads de exemplo
INSERT INTO leads (name, email, phone, company, status, source, notes, value) VALUES 
('João Silva', 'joao@empresa.com', '(11) 99999-9999', 'Empresa ABC', 'novo', 'Website', 'Lead interessado em IA', 5000.00),
('Maria Santos', 'maria@tech.com', '(11) 88888-8888', 'Tech Solutions', 'contato', 'Indicação', 'Precisa de automação', 8000.00),
('Pedro Costa', 'pedro@startup.com', '(11) 77777-7777', 'Startup XYZ', 'proposta', 'LinkedIn', 'Quer chatbot personalizado', 12000.00),
('Ana Oliveira', 'ana@comercio.com', '(11) 66666-6666', 'Comércio Digital', 'negociacao', 'Google Ads', 'E-commerce automation', 15000.00);

-- Inserir clientes de exemplo
INSERT INTO clients (name, email, phone, company, address, notes, status) VALUES 
('Carlos Mendes', 'carlos@cliente1.com', '(11) 55555-5555', 'Cliente Premium', 'São Paulo, SP', 'Cliente VIP desde 2023', 'ativo'),
('Lucia Ferreira', 'lucia@cliente2.com', '(11) 44444-4444', 'Empresa Parceira', 'Rio de Janeiro, RJ', 'Parceria estratégica', 'ativo'),
('Roberto Lima', 'roberto@cliente3.com', '(11) 33333-3333', 'Negócios & CIA', 'Belo Horizonte, MG', 'Cliente corporativo', 'ativo');

-- Criar triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verificar se os dados foram inseridos
SELECT 'Usuários criados:' as info, count(*) as total FROM users;
SELECT 'Leads criados:' as info, count(*) as total FROM leads;
SELECT 'Clientes criados:' as info, count(*) as total FROM clients;

-- Mostrar usuário admin
SELECT 'Usuário Admin:' as info, email, name, password FROM users WHERE email = 'admin@exudustech.com.br';
