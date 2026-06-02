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
      {/* Saldo — card destacado com fundo verde */}
      <div className={`rounded-2xl p-5 shadow-sm col-span-2 lg:col-span-1 ${isPositive ? 'bg-emerald-600' : 'bg-red-500'}`}>
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Wallet className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium text-white/70">Saldo do mês</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-white">
            {formatCurrency(saldo)}
          </p>
        </div>
      </div>

      {/* Receitas */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
          <TrendingUp className="h-5 w-5 text-blue-600" />
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500">Receitas</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(totalReceitas)}
          </p>
        </div>
      </div>

      {/* Despesas */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
          <TrendingDown className="h-5 w-5 text-red-500" />
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500">Despesas</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(totalDespesas)}
          </p>
        </div>
      </div>

      {/* Pendente */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
          <Clock className="h-5 w-5 text-amber-600" />
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500">Pendente</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(totalPendente)}
          </p>
        </div>
      </div>
    </div>
  )
}
