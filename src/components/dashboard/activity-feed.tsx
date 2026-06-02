import { formatCurrency, formatDate, CATEGORIA_CORES } from '@/lib/utils'
import type { Transacao } from '@/types'

interface ActivityFeedProps {
  transacoes: Transacao[]
}

function getCategoryInitial(categoria: string): string {
  return categoria.charAt(0).toUpperCase()
}

function UserBadge({ usuario }: { usuario: string }) {
  const isJacson = usuario === 'JACSON'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        isJacson ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
      }`}
    >
      {isJacson ? 'J' : 'M'}
    </span>
  )
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
          const cor = CATEGORIA_CORES[t.categoria] ?? '#71717a'
          const isReceita = t.tipo === 'RECEITA'
          return (
            <div key={t.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
              {/* Category icon */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: cor }}
              >
                {getCategoryInitial(t.categoria)}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {t.descricao || t.categoria}
                  </p>
                  <UserBadge usuario={t.usuario} />
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
              <p className={`shrink-0 text-sm font-semibold tabular-nums ${isReceita ? 'text-emerald-600' : 'text-slate-900'}`}>
                {isReceita ? '+' : '-'}{formatCurrency(t.valor)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
