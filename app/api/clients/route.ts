import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: clients, error } = await supabaseAdmin
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar clientes:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    return NextResponse.json(clients)
  } catch (error) {
    console.error("Erro ao buscar clientes:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, phone, company, segment } = data

    const { data: newClient, error } = await supabaseAdmin
      .from("clients")
      .insert([
        {
          name,
          email,
          phone,
          company,
          segment,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar cliente:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
