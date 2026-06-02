import { Suspense } from 'react'
import { type Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getCurrentYearMonth, getMonthRange, formatCurrency, formatMonthYear } from '@/lib/utils'
import { ReceitaTable } from '@/components/receitas/receita-table'
import { ReceitaForm } from '@/components/receitas/receita-form'
import { ReceitaFilters } from '@/components/receitas/receita-filters'
import { MonthSelector } from '@/components/month-selector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { Receita } from '@/types'

interface PageProps {
  searchParams: Promise<{
    month?: string
    year?: string
    usuario?: string
    tipo?: string
  }>
}

export default async function ReceitasPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { year: currentYear, month: currentMonth } = getCurrentYearMonth()

  const year = parseInt(params.year ?? String(currentYear))
  const month = parseInt(params.month ?? String(currentMonth))

  const { start, end } = getMonthRange(year, month)

  const where: Prisma.ReceitaWhereInput = {
    data: { gte: start, lte: end },
  }

  if (params.usuario && params.usuario !== 'TODOS') where.usuario = params.usuario
  if (params.tipo && params.tipo !== 'TODOS') where.tipo = params.tipo

  const receitas = await prisma.receita.findMany({ where, orderBy: { data: 'desc' } })

  const receitasFormatadas = receitas.map((r) => ({
    ...r,
    valor: r.valor.toNumber(),
    data: r.data.toISOString(),
    createdAt: r.createdAt.toISOString(),
  })) as Receita[]

  const total = receitasFormatadas.reduce((s, r) => s + r.valor, 0)
  const totalJacson = receitasFormatadas.filter((r) => r.usuario === 'JACSON').reduce((s, r) => s + r.valor, 0)
  const totalManueli = receitasFormatadas.filter((r) => r.usuario === 'MANUELI').reduce((s, r) => s + r.valor, 0)
  const mesLabel = formatMonthYear(new Date(year, month - 1, 1))

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Receitas</h1>
          <p className="text-sm text-muted-foreground capitalize">{mesLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <MonthSelector year={year} month={month} />
          <ReceitaForm
            trigger={
              <Button variant="income" size="sm">
                <Plus className="h-4 w-4" />
                Nova
              </Button>
            }
          />
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle>Total</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xl font-bold font-mono text-green-400 tabular-nums">{formatCurrency(total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle>Jacson</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xl font-bold font-mono text-blue-400 tabular-nums">{formatCurrency(totalJacson)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle>Manueli</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xl font-bold font-mono text-purple-400 tabular-nums">{formatCurrency(totalManueli)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Suspense>
        <ReceitaFilters />
      </Suspense>

      {/* Tabela */}
      <ReceitaTable receitas={receitasFormatadas} />

      <p className="text-xs text-muted-foreground text-right">
        {receitasFormatadas.length} registro{receitasFormatadas.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
