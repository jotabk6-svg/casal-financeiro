'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { LancamentoForm } from './lancamento-form'
import type { Usuario } from '@/types'

interface LancamentoSheetProps {
  usuario: Usuario
  trigger: React.ReactNode
}

export function LancamentoSheet({ usuario, trigger }: LancamentoSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Novo lançamento</SheetTitle>
        </SheetHeader>
        <LancamentoForm usuario={usuario} />
      </SheetContent>
    </Sheet>
  )
}
