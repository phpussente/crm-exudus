import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'CRM ExudusTech',
  description: 'CRM com NextAuth e Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
