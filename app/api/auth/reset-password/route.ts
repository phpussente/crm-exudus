import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token e nova senha são obrigatórios" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    // Verificar token
    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("id, email, name, reset_expires")
      .eq("reset_token", token)

    if (error) {
      console.error("Erro ao buscar token:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 })
    }

    const user = users[0]

    // Verificar se token não expirou
    if (new Date() > new Date(user.reset_expires)) {
      return NextResponse.json({ error: "Token expirado" }, { status: 400 })
    }

    // Atualizar senha e limpar token
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        password: newPassword,
        reset_token: null,
        reset_expires: null,
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("Erro ao atualizar senha:", updateError)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    console.log(`Senha redefinida para usuário: ${user.email}`)

    return NextResponse.json({
      success: true,
      message: "Senha redefinida com sucesso",
    })
  } catch (error) {
    console.error("Erro ao redefinir senha:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
