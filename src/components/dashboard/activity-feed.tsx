import {
  ShoppingCart, Sparkles, GraduationCap, Gamepad2, Home, PawPrint,
  Heart, Zap, Laptop, Car, Shirt, Briefcase, Code2, TrendingUp,
  Building2, MoreHorizontal, type LucideIcon,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Transacao } from '@/types'

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Alimentação': ShoppingCart,
  'Beleza': Sparkles,
  'Educação': GraduationCap,
  'Lazer': Gamepad2,
  'Moradia': Home,
  'Pets': PawPrint,
  'Saúde': Heart,
  'Serviços': Zap,
  'Tecnologia': Laptop,
  'Transporte': Car,
  'Vestuário': Shirt,
  'Salário': Briefcase,
  'Freelance': Code2,
  'Investimentos': TrendingUp,
  'Aluguel': Building2,
  'Outros': MoreHorizontal,
}

const CATEGORY_COLORS: Record<string, { bg: string; icon: string }> = {
  'Alimentação': { bg: 'bg-orange-100', icon: 'text-orange-500' },
  'Beleza': { bg: 'bg-pink-100', icon: 'text-pink-500' },
  'Educação': { bg: 'bg-violet-100', icon: 'text-violet-500' },
  'Lazer': { bg: 'bg-cyan-100', icon: 'text-cyan-500' },
  'Moradia': { bg: 'bg-indigo-100', icon: 'text-indigo-500' },
  'Pets': { bg: 'bg-amber-100', icon: 'text-amber-500' },
  'Saúde': { bg: 'bg-red-100', icon: 'text-red-500' },
  'Serviços': { bg: 'bg-slate-100', icon: 'text-slate-500' },
  'Tecnologia': { bg: 'bg-blue-100', icon: 'text-blue-500' },
  'Transporte': { bg: 'bg-lime-100', icon: 'text-lime-600' },
  'Vestuário': { bg: 'bg-fuchsia-100', icon: 'text-fuchsia-500' },
  'Salário': { bg: 'bg-emerald-100', icon: 'text-emerald-600' },
  'Freelance': { bg: 'bg-sky-100', icon: 'text-sky-500' },
  'Investimentos': { bg: 'bg-green-100', icon: 'text-green-600' },
  'Aluguel': { bg: 'bg-purple-100', icon: 'text-purple-500' },
  'Outros': { bg: 'bg-slate-100', icon: 'text-slate-400' },
}

function UserBadge({ usuario }: { usuario: string }) {
  const isJacson = usuario === 'JACSON'
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${isJacson ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
      {isJacson ? 'J' : 'M'}
    </span>
  )
}

interface ActivityFeedProps {
  transacoes: Transacao[]
}

export function ActivityFeed({ transacoes }: ActivityFeedProps) {
  if (transacoes.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
        <p className="mb-4 text-sm font-semibold text-slate-900">Últimas atividades</p>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <span className="text-2xl">📭</span>
          </div>
          <p className="text-sm font-medium text-slate-600">Nenhum lançamento ainda</p>
          <p className="mt-1 text-xs text-slate-400">Toque em + para adicionar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-100">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <p className="text-sm font-semibold text-slate-900">Últimas atividades</p>
        <span className="text-xs text-slate-400">{transacoes.length} itens</span>
      </div>
      <div className="divide-y divide-slate-50">
        {transacoes.map((t) => {
          const Icon = CATEGORY_ICONS[t.categoria] ?? MoreHorizontal
          const colors = CATEGORY_COLORS[t.categoria] ?? { bg: 'bg-slate-100', icon: 'text-slate-400' }
          const isReceita = t.tipo === 'RECEITA'
          return (
            <div key={t.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/70 transition-colors">
              {/* Lucide icon in colored circle */}
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colors.bg}`}>
                <Icon className={`h-4.5 w-4.5 ${colors.icon}`} strokeWidth={2} />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {t.descricao || t.categoria}
                  </p>
                  <UserBadge usuario={t.usuario} />
                  {t.isFixo && (
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                      Fixo
                    </span>
                  )}
                  {!isReceita && t.status === 'PENDENTE' && (
                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                      Pendente
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {t.categoria} · {formatDate(t.data)}
                </p>
              </div>

              {/* Value */}
              <p className={`shrink-0 text-sm font-bold tabular-nums ${isReceita ? 'text-emerald-600' : 'text-slate-900'}`}>
                {isReceita ? '+' : '-'}{formatCurrency(t.valor)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
