import type { MesData } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface CashflowChartProps {
  meses: MesData[]
}

function smoothPath(points: { x: number; y: number }[], close?: { bottom: number; width: number }): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpX = (prev.x + curr.x) / 2
    d += ` C ${cpX} ${prev.y} ${cpX} ${curr.y} ${curr.x} ${curr.y}`
  }

  if (close) {
    d += ` L ${close.width} ${close.bottom} L 0 ${close.bottom} Z`
  }
  return d
}

export function CashflowChart({ meses }: CashflowChartProps) {
  const W = 600
  const H = 160
  const PADDING = { top: 20, right: 16, bottom: 40, left: 16 }
  const chartW = W - PADDING.left - PADDING.right
  const chartH = H - PADDING.top - PADDING.bottom

  const isEmpty = meses.every((m) => m.receitas === 0 && m.despesas === 0)
  const maxVal = isEmpty ? 1000 : Math.max(...meses.flatMap((m) => [m.receitas, m.despesas]), 1)

  function toPoint(index: number, value: number) {
    const x = PADDING.left + (index / Math.max(meses.length - 1, 1)) * chartW
    const y = PADDING.top + chartH - (value / maxVal) * chartH
    return { x, y }
  }

  const receitaPoints = meses.map((m, i) => toPoint(i, m.receitas))
  const despesaPoints = meses.map((m, i) => toPoint(i, m.despesas))

  const bottom = PADDING.top + chartH

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Fluxo de Caixa</p>
          <p className="text-xs text-slate-400">Últimos 6 meses</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500">Receitas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="text-xs text-slate-500">Despesas</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 160 }}>
          <defs>
            <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="despesaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((frac) => {
            const y = PADDING.top + chartH * (1 - frac)
            return (
              <line
                key={frac}
                x1={PADDING.left}
                y1={y}
                x2={W - PADDING.right}
                y2={y}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
            )
          })}

          {isEmpty ? (
            <text x={W / 2} y={H / 2 + 5} textAnchor="middle" fill="#cbd5e1" fontSize="12" fontFamily="Inter, sans-serif">
              Sem dados ainda — adicione lançamentos
            </text>
          ) : (
            <>
              {/* Receita area */}
              <path d={smoothPath(receitaPoints, { bottom, width: W - PADDING.right })} fill="url(#receitaGrad)" />
              <path d={smoothPath(receitaPoints)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

              {/* Despesa area */}
              <path d={smoothPath(despesaPoints, { bottom, width: W - PADDING.right })} fill="url(#despesaGrad)" />
              <path d={smoothPath(despesaPoints)} fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />

              {/* Dots on last point */}
              {receitaPoints.length > 0 && (
                <circle cx={receitaPoints[receitaPoints.length - 1].x} cy={receitaPoints[receitaPoints.length - 1].y} r="4" fill="#10b981" stroke="white" strokeWidth="2" />
              )}
              {despesaPoints.length > 0 && (
                <circle cx={despesaPoints[despesaPoints.length - 1].x} cy={despesaPoints[despesaPoints.length - 1].y} r="4" fill="#f87171" stroke="white" strokeWidth="2" />
              )}
            </>
          )}

          {/* X-axis labels */}
          {meses.map((m, i) => {
            const x = PADDING.left + (i / Math.max(meses.length - 1, 1)) * chartW
            return (
              <text key={m.label} x={x} y={H - 8} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Inter, sans-serif">
                {m.label}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
