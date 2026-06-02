import { prisma } from '@/lib/prisma'
import { getCurrentYearMonth, getMonthRange, formatMonthYear, MESES_CURTOS } from '@/lib/utils'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { CashflowChart } from '@/components/dashboard/cashflow-chart'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { MonthSelector } from '@/components/month-selector'
import type { Transacao, MesData } from '@/types'

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { year: currentYear, month: currentMonth } = getCurrentYearMonth()

  const year = parseInt(params.year ?? String(currentYear))
  const month = parseInt(params.month ?? String(currentMonth))

  const { start, end } = getMonthRange(year, month)

  // Current month transactions
  const transacoes = await prisma.transacao.findMany({
    where: { data: { gte: start, lte: end } },
    orderBy: { data: 'desc' },
  })

  // Last 6 months for chart
  const mesesData: MesData[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, month - 1 - i, 1)
    const { start: s, end: e } = getMonthRange(d.getFullYear(), d.getMonth() + 1)
    const txs = await prisma.transacao.findMany({ where: { data: { gte: s, lte: e } } })
    mesesData.push({
      label: MESES_CURTOS[d.getMonth()],
      receitas: txs.filter((t) => t.tipo === 'RECEITA').reduce((acc, t) => acc + t.valor.toNumber(), 0),
      despesas: txs.filter((t) => t.tipo === 'DESPESA').reduce((acc, t) => acc + t.valor.toNumber(), 0),
    })
  }

  const receitas = transacoes.filter((t) => t.tipo === 'RECEITA')
  const despesas = transacoes.filter((t) => t.tipo === 'DESPESA')

  const totalReceitas = receitas.reduce((s, t) => s + t.valor.toNumber(), 0)
  const totalDespesas = despesas.reduce((s, t) => s + t.valor.toNumber(), 0)
  const totalPendente = despesas.filter((t) => t.status === 'PENDENTE').reduce((s, t) => s + t.valor.toNumber(), 0)
  const saldo = totalReceitas - totalDespesas

  const recentes: Transacao[] = transacoes.slice(0, 10).map((t) => ({
    id: t.id,
    usuario: t.usuario as Transacao['usuario'],
    tipo: t.tipo as Transacao['tipo'],
    valor: t.valor.toNumber(),
    categoria: t.categoria,
    data: t.data.toISOString(),
    status: t.status as Transacao['status'],
    descricao: t.descricao,
    createdAt: t.createdAt.toISOString(),
  }))

  const mesLabel = formatMonthYear(new Date(year, month - 1, 1))

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm capitalize text-slate-500">{mesLabel}</p>
        </div>
        <MonthSelector year={year} month={month} />
      </div>

      {/* Summary cards */}
      <SummaryCards
        totalReceitas={totalReceitas}
        totalDespesas={totalDespesas}
        totalPendente={totalPendente}
        saldo={saldo}
      />

      {/* Cashflow chart */}
      <CashflowChart meses={mesesData} />

      {/* Activity feed */}
      <ActivityFeed transacoes={recentes} />
    </div>
  )
}
