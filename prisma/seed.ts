import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar 1 usuário
  const user = await prisma.user.create({
    data: {
      name: 'Usuário Exemplo',
      email: 'exemplo@exudustech.com.br',
      password: '123456', // hasharemos isso depois
    },
  });

  // Criar 3 clientes
  await prisma.client.createMany({
    data: [
      { name: 'Cliente A', contact: 'clientea@email.com', phone: '111111111', ownerId: user.id },
      { name: 'Cliente B', contact: 'clienteb@email.com', phone: '222222222', ownerId: user.id },
      { name: 'Cliente C', contact: 'clientec@email.com', phone: '333333333', ownerId: user.id },
    ],
  });

  // Criar 3 leads
  await prisma.lead.createMany({
    data: [
      { name: 'Lead A', stage: 'new', ownerId: user.id },
      { name: 'Lead B', stage: 'contacted', ownerId: user.id },
      { name: 'Lead C', stage: 'converted', ownerId: user.id },
    ],
  });
}

main()
  .then(() => {
    console.log('✅ Seed concluído com sucesso!');
  })
  .catch((e) => {
    console.error('Erro no seed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
