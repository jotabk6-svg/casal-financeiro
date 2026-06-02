import { prisma } from '@/lib/prisma'
import { getCurrentYearMonth, getMonthRange, formatMonthYear } from '@/lib/utils'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { UserComparison } from '@/components/dashboard/user-comparison'
import { CategoryBreakdown } from '@/components/dashboard/category-breakdown'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { MonthSelector } from '@/components/month-selector'
import type { RecenteItem } from '@/types'

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { year: currentYear, month: currentMonth } = getCurrentYearMonth()

  const year = parseInt(params.year ?? String(currentYear))
  const month = parseInt(params.month ?? String(currentMonth))

  const { start, end } = getMonthRange(year, month)

  const [despesas, receitas] = await Promise.all([
    prisma.despesa.findMany({ where: { data: { gte: start, lte: end } } }),
    prisma.receita.findMany({ where: { data: { gte: start, lte: end } } }),
  ])

  // Totais
  const totalReceitas = receitas.reduce((s, r) => s + r.valor.toNumber(), 0)
  const totalDespesas = despesas.reduce((s, d) => s + d.valor.toNumber(), 0)
  const totalPendente = despesas.filter((d) => d.situacao === 'PENDENTE').reduce((s, d) => s + d.valor.toNumber(), 0)
  const saldo = totalReceitas - totalDespesas

  // Por usuário
  const receitaJacson = receitas.filter((r) => r.usuario === 'JACSON').reduce((s, r) => s + r.valor.toNumber(), 0)
  const receitaManueli = receitas.filter((r) => r.usuario === 'MANUELI').reduce((s, r) => s + r.valor.toNumber(), 0)
  const despesaJacson = despesas.filter((d) => d.usuario === 'JACSON').reduce((s, d) => s + d.valor.toNumber(), 0)
  const despesaManueli = despesas.filter((d) => d.usuario === 'MANUELI').reduce((s, d) => s + d.valor.toNumber(), 0)

  // Por categoria
  const categoriaMap = new Map<string, number>()
  for (const d of despesas) {
    categoriaMap.set(d.categoria, (categoriaMap.get(d.categoria) ?? 0) + d.valor.toNumber())
  }
  const categorias = Array.from(categoriaMap.entries()).map(([categoria, total]) => ({ categoria, total }))

  // Transações recentes (10 mais recentes entre despesas e receitas)
  const recentes: RecenteItem[] = [
    ...despesas.map((d) => ({
      id: d.id,
      tipo: 'despesa' as const,
      descricao: d.descricao ?? '',
      categoria: d.categoria,
      valor: d.valor.toNumber(),
      data: d.data.toISOString(),
      usuario: d.usuario as RecenteItem['usuario'],
      situacao: d.situacao as RecenteItem['situacao'],
    })),
    ...receitas.map((r) => ({
      id: r.id,
      tipo: 'receita' as const,
      descricao: r.descricao ?? '',
      categoria: r.tipo,
      valor: r.valor.toNumber(),
      data: r.data.toISOString(),
      usuario: r.usuario as RecenteItem['usuario'],
    })),
  ]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 10)

  const mesLabel = formatMonthYear(new Date(year, month - 1, 1))

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground capitalize">{mesLabel}</p>
        </div>
        <MonthSelector year={year} month={month} />
      </div>

      {/* Stats */}
      <StatsCards
        totalReceitas={totalReceitas}
        totalDespesas={totalDespesas}
        totalPendente={totalPendente}
        saldo={saldo}
      />

      {/* Grid: Comparativo + Categorias */}
      <div className="grid gap-4 lg:grid-cols-2">
        <UserComparison
          receitaJacson={receitaJacson}
          receitaManueli={receitaManueli}
          despesaJacson={despesaJacson}
          despesaManueli={despesaManueli}
        />
        <CategoryBreakdown categorias={categorias} totalDespesas={totalDespesas} />
      </div>

      {/* Recentes */}
      <RecentTransactions recentes={recentes} />
    </div>
  )
}
