import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/layout/app-shell'
import { Toaster } from '@/components/ui/toaster'
import { cookies } from 'next/headers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Casal Finance',
  description: 'Controle financeiro de Jacson e Manueli',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const usuario = cookieStore.get('casal_user')?.value ?? null

  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        {usuario ? (
          <AppShell usuario={usuario}>{children}</AppShell>
        ) : (
          children
        )}
        <Toaster />
      </body>
    </html>
  )
}
