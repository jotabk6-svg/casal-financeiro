'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SheetClose } from '@/components/ui/sheet'
import { cn, CATEGORIAS_DESPESA, CATEGORIAS_RECEITA, formatCurrency } from '@/lib/utils'
import type { TipoTransacao, StatusTransacao, Usuario } from '@/types'

interface LancamentoFormProps {
  usuario: Usuario
}

export function LancamentoForm({ usuario }: LancamentoFormProps) {
  const router = useRouter()
  const [tipo, setTipo] = useState<TipoTransacao>('DESPESA')
  const [valor, setValor] = useState('')
  const [categoria, setCategoria] = useState('')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState<StatusTransacao>('PAGO')
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const categorias = tipo === 'RECEITA' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valor || !categoria || !data) {
      setErro('Preencha valor, categoria e data.')
      return
    }
    setLoading(true)
    setErro('')
    try {
      const res = await fetch('/api/transacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario,
          tipo,
          valor: parseFloat(valor.replace(',', '.')),
          categoria,
          data,
          status: tipo === 'RECEITA' ? 'PAGO' : status,
          descricao: descricao || undefined,
        }),
      })
      if (!res.ok) throw new Error()
      router.refresh()
      // reset
      setValor('')
      setCategoria('')
      setDescricao('')
      setStatus('PAGO')
      document.getElementById('sheet-close-btn')?.click()
    } catch {
      setErro('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-6 pb-8 pt-2 space-y-5">
      {/* Tipo toggle */}
      <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
        {(['DESPESA', 'RECEITA'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTipo(t); setCategoria('') }}
            className={cn(
              'flex-1 rounded-lg py-2 text-sm font-semibold transition-all',
              tipo === t
                ? t === 'DESPESA'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {t === 'DESPESA' ? '↓ Despesa' : '↑ Receita'}
          </button>
        ))}
      </div>

      {/* Valor */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Valor (R$)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="0,00"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Categoria */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Categoria</label>
        <div className="grid grid-cols-3 gap-2">
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoria(cat)}
              className={cn(
                'rounded-xl border px-2 py-2.5 text-xs font-medium transition-all',
                categoria === cat
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Data */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Data</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Status (only for despesas) */}
      {tipo === 'DESPESA' && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
          <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
            {(['PAGO', 'PENDENTE'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  'flex-1 rounded-lg py-2 text-sm font-medium transition-all',
                  status === s
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500'
                )}
              >
                {s === 'PAGO' ? '✓ Pago' : '⏳ Pendente'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Descrição */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descrição (opcional)</label>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Supermercado Atacadão"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {erro && <p className="text-sm text-red-500">{erro}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Salvar lançamento'}
      </button>

      <SheetClose id="sheet-close-btn" className="hidden" />
    </form>
  )
}
