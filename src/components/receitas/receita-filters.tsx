'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TIPOS_RECEITA } from '@/lib/utils'

export function ReceitaFilters() {
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

      <Select value={searchParams.get('tipo') ?? 'TODOS'} onValueChange={(v) => setParam('tipo', v)}>
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TODOS">Todos os tipos</SelectItem>
          {TIPOS_RECEITA.map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
