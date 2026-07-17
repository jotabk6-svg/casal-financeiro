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

  const chartGradient = `conic-gradient(
    ${isJacsonPaga ? '#3b82f6' : '#ec4899'} 0% ${percJacson}%,
    ${isJacsonPaga ? '#ec4899' : '#3b82f6'} ${percJacson}% 100%
  )`

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-zinc-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100">
          <Scale className="h-5 w-5 text-slate-700" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Diferença de gastos mensais</p>
          <p className="text-xs text-slate-500">Visualize o equilíbrio de gastos e quanto Jacson gasta a mais.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[auto_1fr] items-center">
        <div className="relative mx-auto h-44 w-44">
          <div
            className="absolute inset-0 rounded-full bg-slate-100"
            style={{ background: chartGradient }}
          />
          <div className="absolute inset-4 rounded-full bg-white shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quanto Jacson gasta a mais</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(valor)}</p>
            <p className="mt-1 text-xs text-slate-500">Jacson paga mais do que Manueli</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <p className="text-sm font-medium text-slate-700">Percentual de participação</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium text-slate-700">Jacson</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{percJacson.toFixed(0)}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${percJacson}%` }} />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                  <span className="text-sm font-medium text-slate-700">Manueli</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{percManueli.toFixed(0)}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-pink-500" style={{ width: `${percManueli}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <p className="text-sm font-medium text-slate-700">Contexto do mês</p>
            <p className="mt-2 text-sm text-slate-500">
              Este valor é o ajuste necessário para que ambos compartilhem as despesas de forma equilibrada.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
