-- Inserir usuários de exemplo
INSERT INTO users (name, email, role, password) VALUES
('Pedro Henrique', 'pedro@exudustech.com.br', 'gestor', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Maria Silva', 'maria@exudustech.com.br', 'agente', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('João Santos', 'joao@exudustech.com.br', 'agente', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (email) DO NOTHING;

-- Inserir clientes de exemplo
INSERT INTO clients (name, email, phone, company, segment) VALUES
('Dr. Carlos Silva', 'carlos@clinicasaude.com.br', '(11) 99999-1111', 'Clínica Saúde Total', 'Clínicas'),
('Marina Santos', 'marina@fitnesscenter.com.br', '(11) 99999-2222', 'Fitness Center Academia', 'Academias'),
('Roberto Lima', 'roberto@labexames.com.br', '(11) 99999-3333', 'Lab Exames Precisos', 'Laboratórios'),
('Ana Costa', 'ana@belezaclinica.com.br', '(11) 99999-4444', 'Beleza Clínica Estética', 'Clínicas'),
('João Pereira', 'joao@poweracademia.com.br', '(11) 99999-5555', 'Power Academia', 'Academias')
ON CONFLICT DO NOTHING;

-- Inserir leads de exemplo
INSERT INTO leads (name, email, phone, company, segment, status, source, notes, value) VALUES
('Dra. Patricia Oliveira', 'patricia@novaclinica.com.br', '(11) 88888-1111', 'Nova Clínica Médica', 'Clínicas', 'novo', 'Website', 'Interessada em automação de agendamentos', 5500.00),
('Carlos Mendes', 'carlos@gymfit.com.br', '(11) 88888-2222', 'Gym Fit Academia', 'Academias', 'contato', 'LinkedIn', 'Quer automatizar vendas de planos', 7200.00),
('Fernanda Rocha', 'fernanda@labpreciso.com.br', '(11) 88888-3333', 'Lab Preciso', 'Laboratórios', 'proposta', 'Indicação', 'Precisa de IA para resultados de exames', 8900.00),
('Ricardo Alves', 'ricardo@esteticavip.com.br', '(11) 88888-4444', 'Estética VIP', 'Clínicas', 'negociacao', 'Google Ads', 'Interessado em chatbot 24/7', 6300.00),
('Luciana Dias', 'luciana@strongacademia.com.br', '(11) 88888-5555', 'Strong Academia', 'Academias', 'fechado', 'WhatsApp', 'Cliente convertido - implementação iniciada', 5500.00)
ON CONFLICT DO NOTHING;
