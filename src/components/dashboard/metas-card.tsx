'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Target, Plus, X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Meta } from '@/types'

interface MetasCardProps {
  metas: Meta[]
}

export function MetasCard({ metas: initialMetas }: MetasCardProps) {
  const router = useRouter()
  const [metas, setMetas] = useState(initialMetas)
  const [showForm, setShowForm] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [atual, setAtual] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!titulo || !objetivo) return
    setLoading(true)
    try {
      const res = await fetch('/api/metas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          valorObjetivo: parseFloat(objetivo),
          valorAtual: parseFloat(atual || '0'),
        }),
      })
      const nova = await res.json()
      setMetas((prev) => [...prev, { ...nova, valorObjetivo: Number(nova.valorObjetivo), valorAtual: Number(nova.valorAtual) }])
      setTitulo(''); setObjetivo(''); setAtual(''); setShowForm(false)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/metas/${id}`, { method: 'DELETE' })
    setMetas((prev) => prev.filter((m) => m.id !== id))
    router.refresh()
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
            <Target className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Metas do Casal</p>
            <p className="text-xs text-slate-400">Objetivos financeiros</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition hover:bg-emerald-200"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="mb-4 space-y-2.5 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Nome da meta (ex: Viagem de Fim de Ano)"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              placeholder="Valor objetivo (R$)"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
            />
            <input
              type="number"
              value={atual}
              onChange={(e) => setAtual(e.target.value)}
              placeholder="Já guardado (R$)"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading}
              className="flex-1 rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50">
              {loading ? 'Salvando...' : 'Criar meta'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Metas list */}
      {metas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-2xl mb-2">🎯</p>
          <p className="text-sm font-medium text-slate-600">Nenhuma meta ainda</p>
          <p className="text-xs text-slate-400 mt-1">Clique em + para criar seu primeiro objetivo</p>
        </div>
      ) : (
        <div className="space-y-4">
          {metas.map((meta) => {
            const pct = Math.min(100, (meta.valorAtual / meta.valorObjetivo) * 100)
            const falta = meta.valorObjetivo - meta.valorAtual
            return (
              <div key={meta.id} className="group">
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{meta.titulo}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatCurrency(meta.valorAtual)} de {formatCurrency(meta.valorObjetivo)}
                      {falta > 0 && <span className="ml-1 text-slate-400">· faltam {formatCurrency(falta)}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600">{pct.toFixed(0)}%</span>
                    <button
                      onClick={() => handleDelete(meta.id)}
                      className="opacity-0 group-hover:opacity-100 h-5 w-5 flex items-center justify-center rounded text-slate-400 hover:text-red-500 transition-all"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
