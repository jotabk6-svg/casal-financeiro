import { prisma } from '@/lib/prisma'
import { getCurrentYearMonth, getMonthRange, formatMonthYear, formatCurrency, CATEGORIAS_DESPESA, CATEGORIAS_RECEITA } from '@/lib/utils'
import { MonthSelector } from '@/components/month-selector'
import { TransacoesList } from '@/components/extrato/transacoes-list'
import type { Transacao } from '@/types'

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string; tipo?: string; usuario?: string; categoria?: string }>
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
  if (params.categoria && params.categoria !== 'TODOS') where.categoria = params.categoria

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
    isFixo: t.isFixo,
    descricao: t.descricao,
    createdAt: t.createdAt.toISOString(),
  }))

  const mesLabel = formatMonthYear(new Date(year, month - 1, 1))
  const totalReceitas = transacoes.filter((t) => t.tipo === 'RECEITA').reduce((s, t) => s + t.valor, 0)
  const totalDespesas = transacoes.filter((t) => t.tipo === 'DESPESA').reduce((s, t) => s + t.valor, 0)
  const totalItens = transacoes.length
  const categoriasResumo = transacoes.reduce<Record<string, number>>((summary, t) => {
    summary[t.categoria] = (summary[t.categoria] ?? 0) + t.valor
    return summary
  }, {})

  const allCategorias = params.tipo === 'RECEITA'
    ? CATEGORIAS_RECEITA
    : params.tipo === 'DESPESA'
    ? CATEGORIAS_DESPESA
    : Array.from(new Set([...CATEGORIAS_DESPESA, ...CATEGORIAS_RECEITA]))

  const clearFiltersHref = `/extrato?year=${year}&month=${month}${params.usuario && params.usuario !== 'TODOS' ? `&usuario=${params.usuario}` : ''}`

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

      <div className="grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1.5fr)_auto]">
        <form method="get" className="space-y-3 sm:space-y-0 sm:flex sm:items-end sm:gap-3 w-full">
          <input type="hidden" name="year" value={String(year)} />
          <input type="hidden" name="month" value={String(month)} />
          {params.usuario && params.usuario !== 'TODOS' && <input type="hidden" name="usuario" value={params.usuario} />}

          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Tipo</label>
            <select
              name="tipo"
              defaultValue={params.tipo ?? 'TODOS'}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="TODOS">Todos</option>
              <option value="DESPESA">Despesas</option>
              <option value="RECEITA">Receitas</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Categoria</label>
            <select
              name="categoria"
              defaultValue={params.categoria ?? 'TODOS'}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="TODOS">Todas</option>
              {allCategorias.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            Filtrar
          </button>
        </form>

        <div className="flex items-center justify-end">
          <a
            href={clearFiltersHref}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
          >
            Limpar filtro
          </a>
        </div>
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

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500">Transações no filtro</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{totalItens}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">Subtotal por categoria</p>
            <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{Math.min(Object.keys(categoriasResumo).length, 3)} itens</span>
          </div>
          <div className="mt-3 space-y-2">
            {Object.entries(categoriasResumo).slice(0, 3).map(([categoria, valor]) => (
              <div key={categoria} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{categoria}</span>
                <span className="font-semibold text-slate-900">{formatCurrency(valor)}</span>
              </div>
            ))}
            {Object.keys(categoriasResumo).length > 3 && (
              <p className="text-xs text-slate-500">Mostrando 3 de {Object.keys(categoriasResumo).length} categorias</p>
            )}
          </div>
        </div>
      </div>

      <TransacoesList transacoes={transacoes} />
    </div>
  )
}
