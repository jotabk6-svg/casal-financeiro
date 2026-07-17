'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, formatDate, CATEGORIAS_DESPESA, CATEGORIAS_RECEITA, CATEGORIA_CORES } from '@/lib/utils'
import type { Transacao } from '@/types'
import { Edit2, Trash2 } from 'lucide-react'

interface TransacoesListProps {
  transacoes: Transacao[]
}

export function TransacoesList({ transacoes }: TransacoesListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedTransacao, setSelectedTransacao] = useState<Transacao | null>(null)
  const [open, setOpen] = useState(false)
  const [valor, setValor] = useState('')
  const [categoria, setCategoria] = useState('')
  const [data, setData] = useState('')
  const [status, setStatus] = useState<'PAGO' | 'PENDENTE'>('PAGO')
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedTransacao) {
      setValor('')
      setCategoria('')
      setData('')
      setStatus('PAGO')
      setDescricao('')
      return
    }

    setValor(String(selectedTransacao.valor))
    setCategoria(selectedTransacao.categoria)
    setData(selectedTransacao.data.split('T')[0])
    setStatus(selectedTransacao.status)
    setDescricao(selectedTransacao.descricao ?? '')
  }, [selectedTransacao])

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Tem certeza que deseja excluir este lançamento?')
    if (!confirmed) return

    try {
      const res = await fetch(`/api/transacoes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao excluir')
      toast({ title: 'Lançamento excluído', variant: 'default' })
      router.refresh()
    } catch {
      toast({ title: 'Falha ao excluir', description: 'Tente novamente.', variant: 'destructive' })
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedTransacao) return

    if (!valor || !categoria || !data) {
      toast({ title: 'Dados incompletos', description: 'Preencha valor, categoria e data.', variant: 'destructive' })
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/transacoes/${selectedTransacao.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valor: parseFloat(valor.replace(',', '.')),
          categoria,
          data,
          status,
          descricao: descricao || null,
        }),
      })

      if (!res.ok) throw new Error('Erro ao atualizar')

      toast({ title: 'Lançamento atualizado' })
      setOpen(false)
      setSelectedTransacao(null)
      router.refresh()
    } catch {
      toast({ title: 'Falha ao atualizar', description: 'Tente novamente.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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
                <div key={t.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: cor }}
                    >
                      {t.categoria.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-sm font-medium text-slate-900 truncate">{t.descricao || t.categoria}</p>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">{t.categoria}</span>
                        {!isReceita && t.status === 'PENDENTE' && (
                          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">Pendente</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">{formatDate(t.data)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 sm:items-end sm:text-right">
                    <p className={`text-sm font-semibold tabular-nums ${isReceita ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {isReceita ? '+' : '-'}{formatCurrency(t.valor)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedTransacao(t)
                          setOpen(true)
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(t.id)}>
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={(value) => {
        setOpen(value)
        if (!value) setSelectedTransacao(null)
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar lançamento</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Valor</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={valor}
                onChange={(event) => setValor(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="grid gap-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Categoria</label>
              <div className="grid grid-cols-2 gap-2">
                {(selectedTransacao?.tipo === 'RECEITA' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoria(cat)}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${categoria === cat ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={categoria}
                onChange={(event) => setCategoria(event.target.value)}
                placeholder="Categoria personalizada"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="grid gap-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Data</label>
              <input
                type="date"
                value={data}
                onChange={(event) => setData(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {selectedTransacao?.tipo === 'DESPESA' && (
              <div className="grid gap-3">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as 'PAGO' | 'PENDENTE')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="PAGO">Pago</option>
                  <option value="PENDENTE">Pendente</option>
                </select>
              </div>
            )}

            <div className="grid gap-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descrição</label>
              <input
                type="text"
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
                placeholder="Ex: Supermercado"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="income" size="sm" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </form>

          <DialogClose asChild>
            <button className="sr-only">Fechar</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  )
}
