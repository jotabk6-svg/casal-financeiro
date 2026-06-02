'use client'

import { useRouter } from 'next/navigation'
import { SideNav, BottomNav } from './nav'
import { WalletCards, LogOut } from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
  usuario: string | null
}

function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      title="Sair"
    >
      <LogOut className="h-3.5 w-3.5" />
    </button>
  )
}

export function AppShell({ children, usuario }: AppShellProps) {
  const isJacson = usuario === 'JACSON'
  const nome = usuario
    ? usuario.charAt(0) + usuario.slice(1).toLowerCase()
    : 'Casal'

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0 border-r border-border">
        <div className="flex h-16 items-center gap-3 px-6 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-border">
            <WalletCards className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-foreground">Casal Finance</p>
            <p className="text-[10px] text-muted-foreground">Controle financeiro</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <SideNav />
        </div>
        {usuario && (
          <div className="border-t border-border px-4 py-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${isJacson ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-pink-500 to-purple-600'}`}>
                {usuario.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">{nome}</p>
                <p className="text-[10px] text-muted-foreground">Logado</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-x-hidden pb-16 md:pb-0">
        {/* Mobile header */}
        <div className="flex h-14 items-center gap-3 border-b border-border px-4 md:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-border">
            <WalletCards className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="flex-1 text-sm font-semibold text-foreground">Casal Finance</span>
          {usuario && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{nome}</span>
              <LogoutButton />
            </div>
          )}
        </div>
        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <BottomNav />
    </div>
  )
}
