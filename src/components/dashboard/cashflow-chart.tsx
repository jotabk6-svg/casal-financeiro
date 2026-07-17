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
  const W = 600
  const H = 180
  const PAD = { top: 24, right: 16, bottom: 44, left: 16 }
  const cW = W - PAD.left - PAD.right
  const cH = H - PAD.top - PAD.bottom
  const isEmpty = meses.every((m) => m.receitas === 0 && m.despesas === 0)
  const maxVal = isEmpty ? 1000 : Math.max(...meses.flatMap((m) => [m.receitas, m.despesas]), 1)
  const bottom = PAD.top + cH

  function toPoint(index: number, value: number) {
    const x = PAD.left + (index / Math.max(meses.length - 1, 1)) * cW
    const y = PAD.top + cH - (value / maxVal) * cH * 0.9
    return { x, y }
  }

  const rPts = meses.map((m, i) => toPoint(i, m.receitas))
  const dPts = meses.map((m, i) => toPoint(i, m.despesas))

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 h-[300px]">
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

      <div className="h-full">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
          <defs>
            <linearGradient id="gReceita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#10b981" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gDespesa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity="0.18" />
              <stop offset="85%" stopColor="#f87171" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((f) => {
            const y = PAD.top + cH * (1 - f)
            return <line key={f} x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#f1f5f9" strokeWidth="1" />
          })}

          {isEmpty ? (
            <text x={W / 2} y={H / 2 + 5} textAnchor="middle" fill="#cbd5e1" fontSize="12" fontFamily="Inter,sans-serif">
              Sem dados — adicione lançamentos
            </text>
          ) : (
            <>
              <path d={smoothPath(rPts, { bottom, startX: PAD.left })} fill="url(#gReceita)" />
              <path d={smoothPath(rPts)} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d={smoothPath(dPts, { bottom, startX: PAD.left })} fill="url(#gDespesa)" />
              <path d={smoothPath(dPts)} fill="none" stroke="#f87171" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {rPts.length > 0 && (
                <circle cx={rPts[rPts.length - 1].x} cy={rPts[rPts.length - 1].y} r="5" fill="#10b981" stroke="white" strokeWidth="2.5" />
              )}
              {dPts.length > 0 && (
                <circle cx={dPts[dPts.length - 1].x} cy={dPts[dPts.length - 1].y} r="5" fill="#f87171" stroke="white" strokeWidth="2.5" />
              )}
            </>
          )}

          {meses.map((m, i) => {
            const x = PAD.left + (i / Math.max(meses.length - 1, 1)) * cW
            return (
              <text key={m.label} x={x} y={H - 10} textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter,sans-serif">
                {m.label}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
