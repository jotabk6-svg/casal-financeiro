import { prisma } from '@/lib/prisma'
import { getCurrentYearMonth, getMonthRange, formatMonthYear, formatCurrency, formatDate, CATEGORIA_CORES } from '@/lib/utils'
import { MonthSelector } from '@/components/month-selector'
import type { Transacao } from '@/types'

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string; tipo?: string; usuario?: string }>
}

function UserBadge({ usuario }: { usuario: string }) {
  const isJacson = usuario === 'JACSON'
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${isJacson ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
      {isJacson ? 'Jacson' : 'Manueli'}
    </span>
  )
}

export default async function ExtratoPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { year: currentYear, month: currentMonth } = getCurrentYearMonth()

  const year = parseInt(params.year ?? String(currentYear))
  const month = parseInt(params.month ?? String(currentMonth))

  const { start, end } = getMonthRange(year, month)

  const where: Record<string, unknown> = { data: { gte: start, lte: end } }
  if (params.tipo && params.tipo !== 'TODOS') where.tipo = params.tipo
  if (params.usuario && params.usuario !== 'TODOS') where.usuario = params.usuario

  const rows = await prisma.transacao.findMany({
    where,
    orderBy: { data: 'desc' },
  })

  const transacoes: Transacao[] = rows.map((t) => ({
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
  const totalReceitas = transacoes.filter((t) => t.tipo === 'RECEITA').reduce((s, t) => s + t.valor, 0)
  const totalDespesas = transacoes.filter((t) => t.tipo === 'DESPESA').reduce((s, t) => s + t.valor, 0)

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Extrato</h1>
          <p className="text-sm capitalize text-slate-500">{mesLabel}</p>
        </div>
        <MonthSelector year={year} month={month} />
      </div>

      {/* Mini summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500">Total receitas</p>
          <p className="mt-1 text-lg font-bold text-emerald-600">{formatCurrency(totalReceitas)}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500">Total despesas</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(totalDespesas)}</p>
        </div>
      </div>

      {/* Transactions list */}
      {transacoes.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100 text-center">
          <p className="text-2xl mb-2">📭</p>
          <p className="text-sm font-medium text-slate-600">Nenhum lançamento neste mês</p>
          <p className="text-xs text-slate-400 mt-1">Use o botão + para adicionar</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          <div className="divide-y divide-slate-50">
            {transacoes.map((t) => {
              const cor = CATEGORIA_CORES[t.categoria] ?? '#71717a'
              const isReceita = t.tipo === 'RECEITA'
              return (
                <div key={t.id} className="flex items-center gap-3 px-5 py-4">
                  {/* Category icon */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: cor }}
                  >
                    {t.categoria.charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {t.descricao || t.categoria}
                      </p>
                      <UserBadge usuario={t.usuario} />
                      {!isReceita && t.status === 'PENDENTE' && (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                          Pendente
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">{t.categoria} · {formatDate(t.data)}</p>
                  </div>

                  {/* Value */}
                  <p className={`shrink-0 text-sm font-semibold tabular-nums ${isReceita ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {isReceita ? '+' : '-'}{formatCurrency(t.valor)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
