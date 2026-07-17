import { formatCurrency } from '@/lib/utils'
import type { Transacao } from '@/types'

interface CategoriaDistribuicaoProps {
  transacoes: Transacao[]
}

export function CategoriaDistribuicao({ transacoes }: CategoriaDistribuicaoProps) {
  const despesas = transacoes.filter((t) => t.tipo === 'DESPESA')
  const total = despesas.reduce((sum, t) => sum + t.valor, 0)
  const grouped = despesas.reduce<Record<string, number>>((acc, t) => {
    acc[t.categoria] = (acc[t.categoria] ?? 0) + t.valor
    return acc
  }, {})

  const topCategorias = Object.entries(grouped)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-zinc-200">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Distribuição por Categoria</p>
          <p className="text-xs text-slate-500">Top 4 categorias mais gastas do mês</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">{topCategorias.length} categorias</span>
      </div>

      <div className="space-y-3">
        {topCategorias.map(([categoria, valor]) => {
          const pct = total ? Math.round((valor / total) * 100) : 0
          return (
            <div key={categoria} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-900 truncate">{categoria}</p>
                <p className="text-sm font-semibold text-slate-900">{formatCurrency(valor)}</p>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
        {topCategorias.length === 0 && (
          <p className="text-sm text-slate-500">Nenhuma despesa registrada neste mês.</p>
        )}
      </div>
    </div>
  )
}
