// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

/* ---------- 1. Validação ---------- */
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(4),
});

/* ---------- 2. GET: lista usuários ---------- */
export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
  });
  return NextResponse.json(users);
}

/* ---------- 3. POST: cria usuário ---------- */
export async function POST(req: NextRequest) {
  try {
    // 3.1  Lê e valida o corpo
    const body = await req.json();
    const data = userSchema.parse(body);

    // 3.2  Impede e-mail duplicado
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 },
      );
    }

    // 3.3  Gera hash seguro da senha
    const hashedPassword = await hash(data.password, 10); // 10 = salt rounds

    // 3.4  Cria o usuário
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erro ao criar usuário' },
      { status: 400 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
