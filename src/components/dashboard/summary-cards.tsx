import { TrendingUp, TrendingDown, Wallet, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface SummaryCardsProps {
  totalReceitas: number
  totalDespesas: number
  totalPendente: number
  saldo: number
}

export function SummaryCards({ totalReceitas, totalDespesas, totalPendente, saldo }: SummaryCardsProps) {
  const isPositive = saldo >= 0

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-zinc-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <Wallet className="h-5 w-5 text-slate-700" />
          </div>
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">Saldo</span>
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Saldo do mês</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-700">{formatCurrency(saldo)}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm border border-zinc-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Receitas</span>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-semibold tracking-tight text-slate-900">{formatCurrency(totalReceitas)}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm border border-zinc-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Despesas</span>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-semibold tracking-tight text-slate-900">{formatCurrency(totalDespesas)}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm border border-zinc-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pendente</span>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-semibold tracking-tight text-slate-900">{formatCurrency(totalPendente)}</p>
        </div>
      </div>
    </div>
  )
}
