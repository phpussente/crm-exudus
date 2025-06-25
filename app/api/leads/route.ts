import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: leads, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar leads:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    return NextResponse.json(leads)
  } catch (error) {
    console.error("Erro ao buscar leads:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, phone, company, segment, status, source, notes, value } = data

    const { data: newLead, error } = await supabaseAdmin
      .from("leads")
      .insert([
        {
          name,
          email,
          phone,
          company,
          segment,
          status,
          source,
          notes,
          value,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar lead:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    return NextResponse.json(newLead, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar lead:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
