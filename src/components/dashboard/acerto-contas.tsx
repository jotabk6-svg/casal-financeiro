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

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-zinc-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100">
          <Scale className="h-5 w-5 text-slate-700" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Balanço do Mês</p>
          <p className="text-xs text-slate-500">Para equilibrar as despesas compartilhadas, a compensação sugerida é:</p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 mb-4 border border-slate-100">
        <p className="text-sm text-slate-500">Transferência sugerida</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(valor)}</p>
        <p className="mt-2 text-sm text-slate-500">
          <span className={isJacsonPaga ? 'text-blue-600 font-semibold' : 'text-pink-600 font-semibold'}>{nomeQuemPaga}</span>
          {' → '}
          <span className={isJacsonPaga ? 'text-pink-600 font-semibold' : 'text-blue-600 font-semibold'}>{nomeQuemRecebe}</span>
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Jacson</span>
          <span>{percJacson.toFixed(0)}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-blue-500" style={{ width: `${percJacson}%` }} />
        </div>

        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Manueli</span>
          <span>{percManueli.toFixed(0)}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-pink-500" style={{ width: `${percManueli}%` }} />
        </div>
      </div>
    </div>
  )
}
