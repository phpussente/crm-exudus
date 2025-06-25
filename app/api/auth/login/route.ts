import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validar entrada
    if (!email || !password) {
      console.log("❌ Email ou senha não fornecidos")
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    console.log("🔍 Tentativa de login para:", email)
    console.log("🔑 Senha fornecida:", password)

    // Buscar usuário no Supabase
    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("id, email, name, role, password")
      .eq("email", email.toLowerCase().trim())

    if (error) {
      console.error("❌ Erro ao buscar usuário:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    console.log("👥 Usuários encontrados:", users?.length || 0)

    if (!users || users.length === 0) {
      console.log("❌ Nenhum usuário encontrado")
      return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 })
    }

    const user = users[0]
    console.log("👤 Usuário encontrado:", { id: user.id, email: user.email, name: user.name })
    console.log("🔐 Senha no banco:", user.password)
    console.log("🔐 Senha fornecida:", password)

    // Verificar senha
    if (password !== user.password) {
      console.log("❌ Senha incorreta")
      return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 })
    }

    console.log("✅ Login bem-sucedido para:", user.name)

    // Retornar dados do usuário
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("💥 Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor. Tente novamente." }, { status: 500 })
  }
}
