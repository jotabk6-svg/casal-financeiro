'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface MonthSelectorProps {
  year: number
  month: number
}

export function MonthSelector({ year, month }: MonthSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function navigate(newYear: number, newMonth: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('year', String(newYear))
    params.set('month', String(newMonth))
    router.push(`${pathname}?${params.toString()}`)
  }

  function prev() {
    if (month === 1) navigate(year - 1, 12)
    else navigate(year, month - 1)
  }

  function next() {
    if (month === 12) navigate(year + 1, 1)
    else navigate(year, month + 1)
  }

  const label = format(new Date(year, month - 1, 1), 'MMM yyyy', { locale: ptBR })

  return (
    <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white shadow-sm">
      <Button variant="ghost" size="icon" onClick={prev} className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-700">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[90px] text-center text-sm font-semibold capitalize text-slate-700">
        {label}
      </span>
      <Button variant="ghost" size="icon" onClick={next} className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-700">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
