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
import { CATEGORIAS_DESPESA } from '@/lib/utils'
import type { Despesa, DespesaInput } from '@/types'

interface DespesaFormProps {
  trigger: React.ReactNode
  initial?: Despesa
  onSuccess?: () => void
}

const defaultValues: DespesaInput = {
  usuario: 'JACSON',
  data: new Date().toISOString().split('T')[0],
  categoria: '',
  valor: 0,
  metodoPagamento: 'PIX',
  situacao: 'PENDENTE',
  isFixo: false,
  descricao: '',
}

export function DespesaForm({ trigger, initial, onSuccess }: DespesaFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<DespesaInput>(
    initial
      ? {
          usuario: initial.usuario,
          data: initial.data.split('T')[0],
          categoria: initial.categoria,
          valor: initial.valor,
          metodoPagamento: initial.metodoPagamento,
          situacao: initial.situacao,
          isFixo: initial.isFixo,
          descricao: initial.descricao ?? '',
        }
      : defaultValues
  )

  const set = (key: keyof DespesaInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.categoria || form.valor <= 0) {
      toast({ variant: 'destructive', title: 'Preencha categoria e valor.' })
      return
    }
    setLoading(true)
    try {
      const url = initial ? `/api/despesas/${initial.id}` : '/api/despesas'
      const method = initial ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, valor: Number(form.valor) }),
      })
      if (!res.ok) throw new Error()
      toast({
        variant: 'success',
        title: initial ? 'Despesa atualizada.' : 'Despesa registrada.',
      })
      setOpen(false)
      setForm(defaultValues)
      onSuccess?.()
      router.refresh()
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao salvar despesa.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? 'Editar Despesa' : 'Nova Despesa'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Linha 1: Usuário + Data */}
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

          {/* Categoria */}
          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Select value={form.categoria} onValueChange={(v) => set('categoria', v)}>
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {CATEGORIAS_DESPESA.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
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

          {/* Linha: Método + Situação */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Método</Label>
              <Select value={form.metodoPagamento} onValueChange={(v) => set('metodoPagamento', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="CARTAO">Cartão</SelectItem>
                  <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Situação</Label>
              <Select value={form.situacao} onValueChange={(v) => set('situacao', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAGO">Pago</SelectItem>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fixo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={form.isFixo}
              onClick={() => set('isFixo', !form.isFixo)}
              className={`h-4 w-4 border transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-600 ${
                form.isFixo
                  ? 'bg-zinc-50 border-zinc-50'
                  : 'bg-transparent border-zinc-700'
              }`}
            />
            <Label className="cursor-pointer" onClick={() => set('isFixo', !form.isFixo)}>
              Despesa fixa (recorrente)
            </Label>
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <Label>Descrição (opcional)</Label>
            <Input
              placeholder="Ex: Aluguel, Mercado..."
              value={form.descricao ?? ''}
              onChange={(e) => set('descricao', e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="expense" disabled={loading}>
              {loading ? 'Salvando...' : initial ? 'Atualizar' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
