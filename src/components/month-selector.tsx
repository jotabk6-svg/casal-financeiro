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
    <div className="flex items-center gap-1 rounded-md border border-border bg-transparent">
      <Button variant="ghost" size="icon" onClick={prev} className="h-8 w-8 rounded-r-none">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[90px] text-center text-sm font-medium capitalize text-foreground">
        {label}
      </span>
      <Button variant="ghost" size="icon" onClick={next} className="h-8 w-8 rounded-l-none">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
