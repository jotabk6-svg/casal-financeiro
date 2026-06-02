import { TrendingUp, TrendingDown, Wallet, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface SummaryCardsProps {
  totalReceitas: number
  totalDespesas: number
  totalPendente: number
  saldo: number
}

export function SummaryCards({ totalReceitas, totalDespesas, totalPendente, saldo }: SummaryCardsProps) {
  const cards = [
    {
      label: 'Saldo do mês',
      value: saldo,
      icon: Wallet,
      color: saldo >= 0 ? 'text-emerald-600' : 'text-red-500',
      iconBg: saldo >= 0 ? 'bg-emerald-100' : 'bg-red-100',
      iconColor: saldo >= 0 ? 'text-emerald-600' : 'text-red-500',
      valueColor: saldo >= 0 ? 'text-emerald-700' : 'text-red-600',
    },
    {
      label: 'Receitas',
      value: totalReceitas,
      icon: TrendingUp,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-slate-900',
    },
    {
      label: 'Despesas',
      value: totalDespesas,
      icon: TrendingDown,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      valueColor: 'text-slate-900',
    },
    {
      label: 'Pendente',
      value: totalPendente,
      icon: Clock,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      valueColor: 'text-slate-900',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, iconBg, iconColor, valueColor }) => (
        <div key={label} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className={`mt-1 text-xl font-bold ${valueColor}`}>
              {formatCurrency(value)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
