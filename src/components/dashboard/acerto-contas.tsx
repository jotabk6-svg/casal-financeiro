import { Scale } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { AcertoContas } from '@/types'

interface AcertoContasCardProps {
  acerto: AcertoContas
}

export function AcertoContasCard({ acerto }: AcertoContasCardProps) {
  const { equilibrado, valor, quemPaga, quemRecebe, jacson, manueli } = acerto

  const nomeQuemPaga = quemPaga === 'JACSON' ? 'Jacson' : 'Manueli'
  const isJacsonPaga = quemPaga === 'JACSON'

  const total = jacson + manueli || 1
  const percJacson = (jacson / total) * 100
  const percManueli = (manueli / total) * 100

  const chartGradient = `conic-gradient(
    ${isJacsonPaga ? '#3b82f6' : '#ec4899'} 0% ${percJacson}%,
    ${isJacsonPaga ? '#ec4899' : '#3b82f6'} ${percJacson}% 100%
  )`

  return (
    <div className="rounded-3xl bg-slate-950 p-6 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.9)] border border-slate-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-sky-400/90">Diferença de gastos</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Ajuste entre Jacson e Manueli</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Visualize quem pagou mais e a participação de cada um no total.</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sky-400">
          <Scale className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <div className="mx-auto flex justify-center">
          <div className="relative h-52 w-52 rounded-full bg-slate-900/80 p-3">
            <div className="absolute inset-0 rounded-full bg-slate-950" />
            <div className="absolute inset-0 rounded-full" style={{ background: chartGradient }} />
            <div className="absolute inset-5 rounded-full bg-slate-950 border border-slate-800 shadow-inner" />
            <div className="absolute inset-9 rounded-full bg-slate-950 flex flex-col items-center justify-center text-center px-4">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">Quanto a mais</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-white">{formatCurrency(valor)}</p>
              <p className="mt-2 text-sm text-slate-400">{nomeQuemPaga} paga mais do que {nomeQuemPaga === 'Jacson' ? 'Manueli' : 'Jacson'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] bg-slate-900/95 p-5 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Participação</p>
                <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Este mês</p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-sky-300">
                {nomeQuemPaga} paga mais
              </span>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-white">Jacson</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{percJacson.toFixed(0)}%</span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500 transition-all duration-300" style={{ width: `${percJacson}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                    <span className="text-sm font-medium text-white">Manueli</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{percManueli.toFixed(0)}%</span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-pink-500 transition-all duration-300" style={{ width: `${percManueli}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
