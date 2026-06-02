import { Suspense } from 'react'
import { type Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getCurrentYearMonth, getMonthRange, formatCurrency, formatMonthYear } from '@/lib/utils'
import { DespesaTable } from '@/components/despesas/despesa-table'
import { DespesaForm } from '@/components/despesas/despesa-form'
import { DespesaFilters } from '@/components/despesas/despesa-filters'
import { MonthSelector } from '@/components/month-selector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { Despesa } from '@/types'

interface PageProps {
  searchParams: Promise<{
    month?: string
    year?: string
    usuario?: string
    categoria?: string
    situacao?: string
  }>
}

export default async function DespesasPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { year: currentYear, month: currentMonth } = getCurrentYearMonth()

  const year = parseInt(params.year ?? String(currentYear))
  const month = parseInt(params.month ?? String(currentMonth))

  const { start, end } = getMonthRange(year, month)

  const where: Prisma.DespesaWhereInput = {
    data: { gte: start, lte: end },
  }

  if (params.usuario && params.usuario !== 'TODOS') where.usuario = params.usuario
  if (params.categoria && params.categoria !== 'TODAS') where.categoria = params.categoria
  if (params.situacao && params.situacao !== 'TODAS') where.situacao = params.situacao

  const despesas = await prisma.despesa.findMany({ where, orderBy: { data: 'desc' } })

  const despesasFormatadas = despesas.map((d) => ({
    ...d,
    valor: d.valor.toNumber(),
    data: d.data.toISOString(),
    createdAt: d.createdAt.toISOString(),
  })) as Despesa[]

  const total = despesasFormatadas.reduce((s, d) => s + d.valor, 0)
  const totalPago = despesasFormatadas.filter((d) => d.situacao === 'PAGO').reduce((s, d) => s + d.valor, 0)
  const totalPendente = despesasFormatadas.filter((d) => d.situacao === 'PENDENTE').reduce((s, d) => s + d.valor, 0)
  const mesLabel = formatMonthYear(new Date(year, month - 1, 1))

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Despesas</h1>
          <p className="text-sm text-muted-foreground capitalize">{mesLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <MonthSelector year={year} month={month} />
          <DespesaForm
            trigger={
              <Button variant="expense" size="sm">
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
            <p className="text-xl font-bold font-mono text-red-400 tabular-nums">{formatCurrency(total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle>Pago</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xl font-bold font-mono text-green-400 tabular-nums">{formatCurrency(totalPago)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle>Pendente</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xl font-bold font-mono text-yellow-400 tabular-nums">{formatCurrency(totalPendente)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Suspense>
        <DespesaFilters />
      </Suspense>

      {/* Tabela */}
      <DespesaTable despesas={despesasFormatadas} />

      <p className="text-xs text-muted-foreground text-right">
        {despesasFormatadas.length} registro{despesasFormatadas.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
