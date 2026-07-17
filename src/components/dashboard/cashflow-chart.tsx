import { formatCurrency } from '@/lib/utils'
import type { MesData } from '@/types'

interface CashflowChartProps {
  meses: MesData[]
}

function smoothPath(points: { x: number; y: number }[], close?: { bottom: number; startX: number }): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const dx = curr.x - prev.x
    d += ` C ${prev.x + dx * 0.35} ${prev.y} ${curr.x - dx * 0.35} ${curr.y} ${curr.x} ${curr.y}`
  }
  if (close) {
    d += ` L ${points[points.length - 1].x} ${close.bottom} L ${close.startX} ${close.bottom} Z`
  }
  return d
}

export function CashflowChart({ meses }: CashflowChartProps) {
  const W = 620
  const H = 220
  const PAD = { top: 32, right: 18, bottom: 52, left: 48 }
  const cW = W - PAD.left - PAD.right
  const cH = H - PAD.top - PAD.bottom
  const isEmpty = meses.every((m) => m.receitas === 0 && m.despesas === 0)
  const maxValue = isEmpty ? 1000 : Math.max(...meses.flatMap((m) => [m.receitas, m.despesas]), 1)
  const topValue = Math.ceil(maxValue / 100) * 100
  const bottom = PAD.top + cH

  function toPoint(index: number, value: number) {
    const x = PAD.left + (index / Math.max(meses.length - 1, 1)) * cW
    const y = PAD.top + cH - (value / topValue) * cH
    return { x, y }
  }

  const receitasPoints = meses.map((m, i) => toPoint(i, m.receitas))
  const despesasPoints = meses.map((m, i) => toPoint(i, m.despesas))

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 h-[340px]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Fluxo de Caixa</p>
          <p className="text-xs text-slate-400">Últimos 6 meses</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Receitas
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            Despesas
          </div>
        </div>
      </div>

      <div className="h-full">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
          <defs>
            <linearGradient id="gReceita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
              <stop offset="80%" stopColor="#10b981" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gDespesa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity="0.18" />
              <stop offset="80%" stopColor="#f87171" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const y = PAD.top + cH * (1 - fraction)
            return (
              <g key={fraction}>
                <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                <text x={PAD.left - 10} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="10" fontFamily="Inter, sans-serif">
                  {formatCurrency(topValue * fraction)}
                </text>
              </g>
            )
          })}

          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={bottom} stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1={PAD.left} y1={bottom} x2={W - PAD.right} y2={bottom} stroke="#cbd5e1" strokeWidth="1.5" />

          {isEmpty ? (
            <text x={W / 2} y={H / 2 + 5} textAnchor="middle" fill="#cbd5e1" fontSize="12" fontFamily="Inter, sans-serif">
              Sem dados — adicione lançamentos
            </text>
          ) : (
            <>
              <path d={smoothPath(receitasPoints, { bottom, startX: PAD.left })} fill="url(#gReceita)" />
              <path d={smoothPath(receitasPoints)} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d={smoothPath(despesasPoints, { bottom, startX: PAD.left })} fill="url(#gDespesa)" />
              <path d={smoothPath(despesasPoints)} fill="none" stroke="#f87171" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {receitasPoints.map((point, index) => (
                <g key={`r-${index}`}>
                  <circle cx={point.x} cy={point.y} r="4.5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                  <title>{`Receita ${meses[index].label}: ${formatCurrency(meses[index].receitas)}`}</title>
                </g>
              ))}
              {despesasPoints.map((point, index) => (
                <g key={`d-${index}`}>
                  <circle cx={point.x} cy={point.y} r="4.5" fill="#f87171" stroke="#fff" strokeWidth="2" />
                  <title>{`Despesa ${meses[index].label}: ${formatCurrency(meses[index].despesas)}`}</title>
                </g>
              ))}
            </>
          )}

          {meses.map((m, index) => {
            const x = PAD.left + (index / Math.max(meses.length - 1, 1)) * cW
            return (
              <g key={m.label}>
                <line x1={x} y1={bottom} x2={x} y2={bottom + 6} stroke="#cbd5e1" strokeWidth="1" />
                <text x={x} y={H - 16} textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
                  {m.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
