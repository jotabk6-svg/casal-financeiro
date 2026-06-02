'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DespesaForm } from './despesa-form'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Despesa } from '@/types'

interface DespesaTableProps {
  despesas: Despesa[]
}

function SortHeader({ label, isSorted, onSort }: { label: string; isSorted: false | 'asc' | 'desc'; onSort: () => void }) {
  return (
    <button
      onClick={onSort}
      className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
      {isSorted === 'asc' ? (
        <ArrowUp className="h-3 w-3" />
      ) : isSorted === 'desc' ? (
        <ArrowDown className="h-3 w-3" />
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-40" />
      )}
    </button>
  )
}

export function DespesaTable({ despesas }: DespesaTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [sorting, setSorting] = useState<SortingState>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Confirma exclusão desta despesa?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/despesas/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ variant: 'success', title: 'Despesa excluída.' })
      router.refresh()
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao excluir.' })
    } finally {
      setDeletingId(null)
    }
  }, [router, toast])

  const columns = useMemo<ColumnDef<Despesa>[]>(() => [
    {
      accessorKey: 'data',
      header: ({ column }) => (
        <SortHeader
          label="Data"
          isSorted={column.getIsSorted()}
          onSort={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(row.original.data)}
        </span>
      ),
    },
    {
      accessorKey: 'usuario',
      header: 'Usuário',
      cell: ({ row }) => (
        <Badge variant={row.original.usuario === 'JACSON' ? 'jacson' : 'manueli'}>
          {row.original.usuario}
        </Badge>
      ),
    },
    {
      accessorKey: 'categoria',
      header: ({ column }) => (
        <SortHeader
          label="Categoria"
          isSorted={column.getIsSorted()}
          onSort={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground">{row.original.categoria}</span>
          {row.original.isFixo && (
            <Badge variant="fixo" className="text-[10px] px-1.5 py-0">fixo</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'descricao',
      header: 'Descrição',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground max-w-[160px] truncate block">
          {row.original.descricao || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'metodoPagamento',
      header: 'Método',
      cell: ({ row }) => {
        const m = row.original.metodoPagamento
        return (
          <Badge variant={m === 'PIX' ? 'pix' : m === 'CARTAO' ? 'cartao' : 'dinheiro'}>
            {m}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'situacao',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.situacao === 'PAGO' ? 'pago' : 'pendente'}>
          {row.original.situacao}
        </Badge>
      ),
    },
    {
      accessorKey: 'valor',
      header: ({ column }) => (
        <div className="flex justify-end">
          <SortHeader
            label="Valor"
            isSorted={column.getIsSorted()}
            onSort={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right font-mono font-semibold text-red-400 tabular-nums whitespace-nowrap">
          {formatCurrency(row.original.valor)}
        </div>
      ),
    },
    {
      id: 'acoes',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <DespesaForm
            trigger={
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            }
            initial={row.original}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
            onClick={() => handleDelete(row.original.id)}
            disabled={deletingId === row.original.id}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ], [handleDelete, deletingId])

  const table = useReactTable({
    data: despesas,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (despesas.length === 0) {
    return (
      <div className="rounded-lg border border-border p-12 text-center text-sm text-muted-foreground">
        Nenhuma despesa encontrada para o período selecionado.
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="group/row">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
