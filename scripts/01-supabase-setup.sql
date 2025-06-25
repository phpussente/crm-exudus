-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'usuario',
    reset_token VARCHAR(255),
    reset_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de leads
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    segment VARCHAR(100),
    status VARCHAR(50) DEFAULT 'novo',
    source VARCHAR(100),
    notes TEXT,
    value DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    segment VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir usuário admin padrão
INSERT INTO users (email, name, password, role) 
VALUES ('admin@exudustech.com.br', 'Administrador', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Inserir dados de exemplo para leads
INSERT INTO leads (name, email, phone, company, segment, status, source, notes, value) VALUES
('João Silva', 'joao@empresa.com', '(11) 99999-9999', 'Empresa ABC', 'Tecnologia', 'novo', 'Website', 'Interessado em automação de processos', 15000),
('Maria Santos', 'maria@startup.com', '(11) 88888-8888', 'Startup XYZ', 'Fintech', 'contato', 'LinkedIn', 'Reunião agendada para próxima terça-feira', 25000),
('Pedro Costa', 'pedro@consultoria.com', '(11) 77777-7777', 'Consultoria 123', 'Consultoria', 'proposta', 'Indicação', 'Proposta enviada. Aguardando retorno', 35000),
('Ana Oliveira', 'ana@clinica.com', '(11) 66666-6666', 'Clínica Saúde+', 'Saúde', 'negociacao', 'Google Ads', 'Em negociação final', 45000),
('Carlos Mendes', 'carlos@loja.com', '(11) 55555-5555', 'Loja Virtual Pro', 'E-commerce', 'fechado', 'Indicação', 'Contrato assinado!', 28000)
ON CONFLICT DO NOTHING;

-- Inserir dados de exemplo para clientes
INSERT INTO clients (name, email, phone, company, segment) VALUES
('Dr. Carlos Silva', 'carlos@clinicasaude.com.br', '(11) 99999-1111', 'Clínica Saúde Total', 'Clínicas'),
('Marina Santos', 'marina@fitnesscenter.com.br', '(11) 99999-2222', 'Fitness Center Academia', 'Academias'),
('Roberto Lima', 'roberto@labexames.com.br', '(11) 99999-3333', 'Lab Exames Precisos', 'Laboratórios'),
('Ana Costa', 'ana@belezaclinica.com.br', '(11) 99999-4444', 'Beleza Clínica Estética', 'Clínicas'),
('João Pereira', 'joao@poweracademia.com.br', '(11) 99999-5555', 'Power Academia', 'Academias')
ON CONFLICT DO NOTHING;

-- Criar triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_clients_updated_at_column();
