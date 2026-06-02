'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, List, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LancamentoSheet } from '@/components/lancamento/lancamento-sheet'
import type { Usuario } from '@/types'

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/extrato', label: 'Extrato', icon: List },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
              active
                ? 'bg-white/15 text-white'
                : 'text-emerald-200 hover:bg-white/10 hover:text-white'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

interface BottomNavProps {
  usuario: Usuario
}

export function BottomNav({ usuario }: BottomNavProps) {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white/95 backdrop-blur-sm md:hidden">
      <div className="flex items-center">
        {/* Dashboard */}
        <Link
          href="/"
          className={cn(
            'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
            pathname === '/' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        {/* New Transaction — center */}
        <div className="flex flex-1 justify-center">
          <LancamentoSheet
            usuario={usuario}
            trigger={
              <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 active:scale-95">
                <Plus className="h-6 w-6" />
              </button>
            }
          />
        </div>

        {/* Extrato */}
        <Link
          href="/extrato"
          className={cn(
            'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
            pathname === '/extrato' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <List className="h-5 w-5" />
          <span>Extrato</span>
        </Link>
      </div>
    </div>
  )
}
