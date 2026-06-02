'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { TIPOS_RECEITA } from '@/lib/utils'
import type { Receita, ReceitaInput } from '@/types'

interface ReceitaFormProps {
  trigger: React.ReactNode
  initial?: Receita
  onSuccess?: () => void
}

const defaultValues: ReceitaInput = {
  usuario: 'JACSON',
  data: new Date().toISOString().split('T')[0],
  tipo: '',
  valor: 0,
  descricao: '',
}

export function ReceitaForm({ trigger, initial, onSuccess }: ReceitaFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ReceitaInput>(
    initial
      ? {
          usuario: initial.usuario,
          data: initial.data.split('T')[0],
          tipo: initial.tipo,
          valor: initial.valor,
          descricao: initial.descricao ?? '',
        }
      : defaultValues
  )

  const set = (key: keyof ReceitaInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.tipo || form.valor <= 0) {
      toast({ variant: 'destructive', title: 'Preencha tipo e valor.' })
      return
    }
    setLoading(true)
    try {
      const url = initial ? `/api/receitas/${initial.id}` : '/api/receitas'
      const method = initial ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, valor: Number(form.valor) }),
      })
      if (!res.ok) throw new Error()
      toast({
        variant: 'success',
        title: initial ? 'Receita atualizada.' : 'Receita registrada.',
      })
      setOpen(false)
      setForm(defaultValues)
      onSuccess?.()
      router.refresh()
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao salvar receita.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? 'Editar Receita' : 'Nova Receita'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Usuário + Data */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Usuário</Label>
              <Select value={form.usuario} onValueChange={(v) => set('usuario', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="JACSON">Jacson</SelectItem>
                  <SelectItem value="MANUELI">Manueli</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Data</Label>
              <Input
                type="date"
                value={form.data}
                onChange={(e) => set('data', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Tipo */}
          <div className="space-y-1.5">
            <Label>Tipo de Receita</Label>
            <Select value={form.tipo} onValueChange={(v) => set('tipo', v)}>
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {TIPOS_RECEITA.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Valor */}
          <div className="space-y-1.5">
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={form.valor || ''}
              onChange={(e) => set('valor', parseFloat(e.target.value) || 0)}
              required
              className="font-mono"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <Label>Descrição (opcional)</Label>
            <Input
              placeholder="Ex: Salário agosto, Freela site..."
              value={form.descricao ?? ''}
              onChange={(e) => set('descricao', e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="income" disabled={loading}>
              {loading ? 'Salvando...' : initial ? 'Atualizar' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
