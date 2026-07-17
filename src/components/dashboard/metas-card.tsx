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
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-zinc-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-100">
            <Target className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Metas do Casal</p>
            <p className="text-xs text-slate-500">Objetivos financeiros</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Nova Meta
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="mb-4 space-y-3 rounded-2xl bg-slate-50 p-4 border border-zinc-200">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Nome da meta"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              placeholder="Objetivo (R$)"
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
              className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50">
              {loading ? 'Salvando...' : 'Criar meta'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
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
              <div key={meta.id} className="group rounded-2xl border border-zinc-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{meta.titulo}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatCurrency(meta.valorAtual)} de {formatCurrency(meta.valorObjetivo)}
                      {falta > 0 && <span className="ml-1 text-slate-400">· faltam {formatCurrency(falta)}</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(meta.id)}
                    className="opacity-0 group-hover:opacity-100 h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-100 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="h-2 rounded-full bg-white shadow-inner">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-600">{pct.toFixed(0)}%</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
