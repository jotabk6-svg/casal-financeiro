'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WalletCards } from 'lucide-react'
import { cn } from '@/lib/utils'

type Usuario = 'JACSON' | 'MANUELI'

export default function LoginPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [senha, setSenha] = useState('')
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
        setErro(data.error ?? 'Erro ao entrar')
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-border">
            <WalletCards className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Casal Finance</h1>
          <p className="text-sm text-muted-foreground">Controle financeiro de Jacson & Manueli</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User selector */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Quem é você?</p>
            <div className="grid grid-cols-2 gap-2">
              {(['JACSON', 'MANUELI'] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => { setUsuario(u); setErro('') }}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors',
                    usuario === u
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  )}
                >
                  <div className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white',
                    u === 'JACSON'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                      : 'bg-gradient-to-br from-pink-500 to-purple-600'
                  )}>
                    {u === 'JACSON' ? 'J' : 'M'}
                  </div>
                  <span className="capitalize">{u.charAt(0) + u.slice(1).toLowerCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          {usuario && (
            <div className="space-y-2">
              <label htmlFor="senha" className="text-sm font-medium text-foreground">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => { setSenha(e.target.value); setErro('') }}
                placeholder="Digite sua senha"
                autoFocus
                className="flex h-9 w-full rounded-md border border-border bg-card px-3 py-1 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          )}

          {/* Error */}
          {erro && (
            <p className="text-sm text-destructive">{erro}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!usuario || !senha || loading}
            className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
