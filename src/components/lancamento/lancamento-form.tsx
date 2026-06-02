'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SheetClose } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { cn, CATEGORIAS_DESPESA, CATEGORIAS_RECEITA } from '@/lib/utils'
import type { TipoTransacao, StatusTransacao, Usuario } from '@/types'

interface LancamentoFormProps {
  usuario: Usuario
}

export function LancamentoForm({ usuario: defaultUsuario }: LancamentoFormProps) {
  const router = useRouter()
  const [tipo, setTipo] = useState<TipoTransacao>('DESPESA')
  const [pagador, setPagador] = useState<Usuario>(defaultUsuario)
  const [valor, setValor] = useState('')
  const [categoria, setCategoria] = useState('')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState<StatusTransacao>('PAGO')
  const [isFixo, setIsFixo] = useState(false)
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
          usuario: pagador,
          tipo,
          valor: parseFloat(valor.replace(',', '.')),
          categoria,
          data,
          status: tipo === 'RECEITA' ? 'PAGO' : status,
          isFixo: tipo === 'DESPESA' ? isFixo : false,
          descricao: descricao || undefined,
        }),
      })
      if (!res.ok) throw new Error()
      router.refresh()
      setValor(''); setCategoria(''); setDescricao(''); setStatus('PAGO'); setIsFixo(false)
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
          <button key={t} type="button" onClick={() => { setTipo(t); setCategoria('') }}
            className={cn('flex-1 rounded-lg py-2 text-sm font-semibold transition-all',
              tipo === t
                ? t === 'DESPESA' ? 'bg-red-500 text-white shadow-sm' : 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}>
            {t === 'DESPESA' ? '↓ Despesa' : '↑ Receita'}
          </button>
        ))}
      </div>

      {/* Pagador */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quem pagou?</p>
        <div className="grid grid-cols-2 gap-2">
          {(['JACSON', 'MANUELI'] as const).map((u) => (
            <button key={u} type="button" onClick={() => setPagador(u)}
              className={cn(
                'flex items-center gap-3 rounded-xl border-2 p-3 transition-all text-sm font-semibold',
                pagador === u
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
              )}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${u === 'JACSON' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-pink-400 to-purple-500'}`}>
                {u.charAt(0)}
              </div>
              {u === 'JACSON' ? 'Jacson' : 'Manueli'}
            </button>
          ))}
        </div>
      </div>

      {/* Valor */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Valor (R$)</label>
        <input type="number" step="0.01" min="0" value={valor} onChange={(e) => setValor(e.target.value)}
          placeholder="0,00"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
      </div>

      {/* Categoria */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Categoria</label>
        <div className="grid grid-cols-3 gap-2">
          {categorias.map((cat) => (
            <button key={cat} type="button" onClick={() => setCategoria(cat)}
              className={cn('rounded-xl border px-2 py-2.5 text-xs font-medium transition-all',
                categoria === cat
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Data */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Data</label>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
      </div>

      {/* Status + isFixo (only for despesas) */}
      {tipo === 'DESPESA' && (
        <>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
            <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
              {(['PAGO', 'PENDENTE'] as const).map((s) => (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className={cn('flex-1 rounded-lg py-2 text-sm font-medium transition-all',
                    status === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  )}>
                  {s === 'PAGO' ? '✓ Pago' : '⏳ Pendente'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">Despesa Fixa</p>
              <p className="text-xs text-slate-400">Recorrente todo mês</p>
            </div>
            <Switch checked={isFixo} onCheckedChange={setIsFixo} />
          </div>
        </>
      )}

      {/* Descrição */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descrição (opcional)</label>
        <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Supermercado Atacadão"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
      </div>

      {erro && <p className="text-sm text-red-500">{erro}</p>}

      <button type="submit" disabled={loading}
        className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50">
        {loading ? 'Salvando...' : 'Salvar lançamento'}
      </button>

      <SheetClose id="sheet-close-btn" className="hidden" />
    </form>
  )
}
