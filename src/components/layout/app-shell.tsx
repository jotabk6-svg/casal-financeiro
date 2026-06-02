'use client'

import { SideNav, BottomNav } from './nav'
import { WalletCards } from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
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
        <div className="border-t border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white">
              J&amp;M
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Jacson &amp; Manueli</p>
              <p className="text-[10px] text-muted-foreground">Casal</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-x-hidden pb-16 md:pb-0">
        {/* Mobile header */}
        <div className="flex h-14 items-center gap-3 border-b border-border px-4 md:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-border">
            <WalletCards className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">Casal Finance</span>
        </div>
        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <BottomNav />
    </div>
  )
}
