'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WalletCards, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

type Usuario = 'JACSON' | 'MANUELI'

const USERS: { id: Usuario; nome: string; emoji: string; gradient: string }[] = [
  { id: 'JACSON', nome: 'Jacson', emoji: '👨', gradient: 'from-blue-400 to-blue-600' },
  { id: 'MANUELI', nome: 'Manueli', emoji: '👩', gradient: 'from-pink-400 to-purple-500' },
]

export default function LoginPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!usuario) return
    setLoading(true)
    setErro('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha }),
      })
      if (!res.ok) {
        const data = await res.json()
        setErro(data.error ?? 'Credenciais inválidas')
        return
      }
      router.replace('/')
      router.refresh()
    } catch {
      setErro('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-200">
          <WalletCards className="h-7 w-7 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Casal Finance</h1>
          <p className="mt-1 text-sm text-slate-500">Controle financeiro de Jacson & Manueli</p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-md shadow-slate-200/70 border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User selector */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quem é você?</p>
            <div className="grid grid-cols-2 gap-3">
              {USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => { setUsuario(u.id); setSenha(''); setErro('') }}
                  className={cn(
                    'flex flex-col items-center gap-2.5 rounded-2xl border-2 p-4 transition-all',
                    usuario === u.id
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                      : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                  )}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${u.gradient} text-2xl shadow-sm`}>
                    {u.emoji}
                  </div>
                  <span className={cn(
                    'text-sm font-semibold',
                    usuario === u.id ? 'text-emerald-700' : 'text-slate-600'
                  )}>
                    {u.nome}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          {usuario && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => { setSenha(e.target.value); setErro('') }}
                  placeholder="Digite sua senha"
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {erro && (
            <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {erro}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!usuario || !senha || loading}
            className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-40"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-xs text-slate-400">Acesso restrito · Jacson & Manueli</p>
    </div>
  )
}
