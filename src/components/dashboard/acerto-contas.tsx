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

  const total = jacson + manueli || 1
  const percJacson = (jacson / total) * 100
  const percManueli = (manueli / total) * 100
  const statusLabel = equilibrado ? 'Equilíbrio atingido' : `${nomeQuemPaga} paga mais este mês`

  const chartGradient = `conic-gradient(
    ${isJacsonPaga ? '#3b82f6' : '#ec4899'} 0% ${percJacson}%,
    ${isJacsonPaga ? '#ec4899' : '#3b82f6'} ${percJacson}% 100%
  )`

  return (
    <div className="rounded-3xl bg-slate-950 p-5 shadow-2xl shadow-slate-900/30 border border-slate-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Diferença de gastos</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Ajuste entre Jacson e Manueli</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">Veja com clareza quem está pagando mais e qual é a participação de cada um neste mês.</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sky-400">
          <Scale className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div className="mx-auto">
          <div className="relative h-52 w-52">
            <div className="absolute inset-0 rounded-full bg-slate-900/80" />
            <div className="absolute inset-0 rounded-full" style={{ background: chartGradient }} />
            <div className="absolute inset-5 rounded-full border border-slate-800 bg-slate-950" />
            <div className="absolute inset-10 rounded-full bg-slate-950/95 flex flex-col items-center justify-center text-center px-3">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">Quanto a mais</p>
              <p className="mt-3 text-4xl font-semibold text-white">{formatCurrency(valor)}</p>
              <p className="mt-2 text-sm text-slate-400">{nomeQuemPaga} paga mais do que {nomeQuemPaga === 'Jacson' ? 'Manueli' : 'Jacson'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-900/90 p-5 border border-slate-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-200">Participação</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">Valores deste mês</p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-sky-300">{statusLabel}</span>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                    <span className="text-sm font-medium text-white">Jacson</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{percJacson.toFixed(0)}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-400 transition-all duration-300" style={{ width: `${percJacson}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-pink-400" />
                    <span className="text-sm font-medium text-white">Manueli</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{percManueli.toFixed(0)}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-pink-400 transition-all duration-300" style={{ width: `${percManueli}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900/90 p-5 border border-slate-800">
            <p className="text-sm font-medium text-slate-200">Contexto</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Este valor mostra quanto precisa ser ajustado para que as despesas fiquem equilibradas entre Jacson e Manueli.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
