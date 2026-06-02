import { Scale } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { AcertoContas } from '@/types'

interface AcertoContasCardProps {
  acerto: AcertoContas
}

export function AcertoContasCard({ acerto }: AcertoContasCardProps) {
  const { equilibrado, valor, quemPaga, quemRecebe, jacson, manueli } = acerto

  const nomeQuemPaga = quemPaga === 'JACSON' ? 'Jacson' : 'Manueli'
  const nomeQuemRecebe = quemRecebe === 'JACSON' ? 'Jacson' : 'Manueli'
  const isJacsonPaga = quemPaga === 'JACSON'

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
          <Scale className="h-4 w-4 text-violet-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Acerto de Contas</p>
          <p className="text-xs text-slate-400">Despesas deste mês</p>
        </div>
      </div>

      {/* Bars comparison */}
      <div className="space-y-2.5 mb-4">
        {[
          { nome: 'Jacson', valor: jacson, isJacson: true },
          { nome: 'Manueli', valor: manueli, isJacson: false },
        ].map(({ nome, valor: v, isJacson }) => {
          const max = Math.max(jacson, manueli, 1)
          const pct = (v / max) * 100
          return (
            <div key={nome} className="flex items-center gap-3">
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${isJacson ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-pink-400 to-purple-500'}`}>
                {nome.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-slate-600">{nome}</span>
                  <span className="text-xs font-semibold text-slate-900 tabular-nums">{formatCurrency(v)}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isJacson ? 'bg-blue-400' : 'bg-pink-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Result message */}
      <div className={`rounded-xl p-3.5 ${equilibrado ? 'bg-emerald-50 border border-emerald-100' : 'bg-violet-50 border border-violet-100'}`}>
        {equilibrado ? (
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <p className="text-sm font-semibold text-emerald-700">
              Contas equilibradas! Nenhuma transferência necessária.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-violet-500 font-medium mb-0.5">Para igualar as contas</p>
            <p className="text-sm font-semibold text-violet-900">
              <span className={`font-bold ${isJacsonPaga ? 'text-blue-600' : 'text-pink-600'}`}>
                {nomeQuemPaga}
              </span>
              {' deve transferir '}
              <span className="font-bold text-violet-700">{formatCurrency(valor)}</span>
              {' para '}
              <span className={`font-bold ${!isJacsonPaga ? 'text-blue-600' : 'text-pink-600'}`}>
                {nomeQuemRecebe}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
