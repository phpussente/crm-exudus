import { createClient } from "@supabase/supabase-js"

// Tentar todas as possíveis variáveis de ambiente do Supabase
const supabaseUrl =
  process.env.SUPABASE_SUPABASE_URL ||
  process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL

const supabaseAnonKey =
  process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY ||
  process.env.SUPABASE_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY

const supabaseServiceKey =
  process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY

// Debug das variáveis
console.log("🔍 Debug Supabase Environment Variables:")
console.log(
  "Available env vars:",
  Object.keys(process.env).filter((key) => key.includes("SUPABASE")),
)
console.log("URL:", supabaseUrl ? "✅ Found" : "❌ Missing")
console.log("Anon Key:", supabaseAnonKey ? "✅ Found" : "❌ Missing")
console.log("Service Key:", supabaseServiceKey ? "✅ Found" : "❌ Missing")

// Verificar se as variáveis essenciais existem
if (!supabaseUrl) {
  console.error("❌ ERRO: URL do Supabase não encontrada!")
  console.error(
    "Variáveis disponíveis:",
    Object.keys(process.env).filter((key) => key.includes("SUPABASE")),
  )
  throw new Error("Supabase URL is required. Please check your environment variables.")
}

if (!supabaseAnonKey) {
  console.error("❌ ERRO: Chave Anon do Supabase não encontrada!")
  throw new Error("Supabase Anon Key is required. Please check your environment variables.")
}

// Criar clientes apenas se as variáveis existirem
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : supabase // Fallback para o cliente normal se não tiver service key
