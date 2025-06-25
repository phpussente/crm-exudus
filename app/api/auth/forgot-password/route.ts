import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
    }

    // Verificar se usuário existe
    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("id, email, name")
      .eq("email", email.toLowerCase().trim())

    if (error) {
      console.error("Erro ao buscar usuário:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    if (!users || users.length === 0) {
      // Por segurança, não revelar se o email existe ou não
      return NextResponse.json({
        success: true,
        message: "Se o email existir em nossa base, você receberá instruções para redefinir sua senha.",
      })
    }

    const user = users[0]

    // Gerar token de recuperação
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const resetExpires = new Date(Date.now() + 3600000) // 1 hora

    // Salvar token no banco
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        reset_token: resetToken,
        reset_expires: resetExpires.toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("Erro ao salvar token:", updateError)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    // Simular envio de email (em produção, usar serviço real como SendGrid, etc.)
    console.log(`Email de recuperação enviado para: ${email}`)
    console.log(`Token de recuperação: ${resetToken}`)
    console.log(
      `Link de recuperação: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`,
    )

    return NextResponse.json({
      success: true,
      message: "Se o email existir em nossa base, você receberá instruções para redefinir sua senha.",
      // Em desenvolvimento, retornar o token para teste
      ...(process.env.NODE_ENV === "development" && { resetToken, resetLink: `/reset-password?token=${resetToken}` }),
    })
  } catch (error) {
    console.error("Erro ao processar recuperação de senha:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
