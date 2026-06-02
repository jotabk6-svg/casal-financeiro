'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIAS_DESPESA } from '@/lib/utils'

export function DespesaFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Select value={searchParams.get('usuario') ?? 'TODOS'} onValueChange={(v) => setParam('usuario', v)}>
        <SelectTrigger className="h-9 w-36 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TODOS">Todos</SelectItem>
          <SelectItem value="JACSON">Jacson</SelectItem>
          <SelectItem value="MANUELI">Manueli</SelectItem>
        </SelectContent>
      </Select>

      <Select value={searchParams.get('categoria') ?? 'TODAS'} onValueChange={(v) => setParam('categoria', v)}>
        <SelectTrigger className="h-9 w-44 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TODAS">Todas as categorias</SelectItem>
          {CATEGORIAS_DESPESA.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={searchParams.get('situacao') ?? 'TODAS'} onValueChange={(v) => setParam('situacao', v)}>
        <SelectTrigger className="h-9 w-36 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TODAS">Todas</SelectItem>
          <SelectItem value="PAGO">Pago</SelectItem>
          <SelectItem value="PENDENTE">Pendente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
