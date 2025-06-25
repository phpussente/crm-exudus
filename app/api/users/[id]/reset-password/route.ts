import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { newPassword, currentUserId } = await request.json()
    const targetUserId = Number.parseInt(params.id)

    if (!newPassword || !currentUserId) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    // Verificar se usuário atual é gestor ou admin
    const { data: currentUser, error: currentUserError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", currentUserId)
      .single()

    if (currentUserError || !currentUser || !["admin", "gestor"].includes(currentUser.role)) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Verificar se usuário alvo existe
    const { data: targetUser, error: targetUserError } = await supabaseAdmin
      .from("users")
      .select("id, email, name")
      .eq("id", targetUserId)
      .single()

    if (targetUserError || !targetUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Atualizar senha
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ password: newPassword })
      .eq("id", targetUserId)

    if (updateError) {
      console.error("Erro ao atualizar senha:", updateError)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    console.log(`Senha alterada pelo gestor para usuário: ${targetUser.email}`)

    return NextResponse.json({
      success: true,
      message: "Senha alterada com sucesso",
    })
  } catch (error) {
    console.error("Erro ao alterar senha:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
