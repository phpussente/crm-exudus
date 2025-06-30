import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string | null // 👈 Adicione aqui
    }
  }

  interface User {
    role?: string | null // 👈 Se estiver usando JWT também
  }
}
