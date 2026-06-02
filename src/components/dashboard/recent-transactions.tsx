import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { RecenteItem } from '@/types'

interface RecentTransactionsProps {
  recentes: RecenteItem[]
}

export function RecentTransactions({ recentes }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Últimas Transações</CardTitle>
          <Link
            href="/despesas"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver todas
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {recentes.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">Nenhuma transação registrada</p>
        ) : (
          <div className="divide-y divide-border">
            {recentes.map((item) => (
              <div
                key={`${item.tipo}-${item.id}`}
                className="flex items-center gap-3 px-6 py-3 hover:bg-muted/30 transition-colors"
              >
                <div
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    item.tipo === 'receita' ? 'bg-green-400' : 'bg-red-400'
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.descricao || item.categoria}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-muted-foreground">{formatDate(item.data)}</span>
                    <Badge variant={item.usuario === 'JACSON' ? 'jacson' : 'manueli'} className="text-[10px] px-1.5 py-0">
                      {item.usuario}
                    </Badge>
                    {item.situacao && (
                      <Badge variant={item.situacao === 'PAGO' ? 'pago' : 'pendente'} className="text-[10px] px-1.5 py-0">
                        {item.situacao}
                      </Badge>
                    )}
                  </div>
                </div>

                <span className={`font-mono text-sm font-semibold shrink-0 tabular-nums ${
                  item.tipo === 'receita' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {item.tipo === 'receita' ? '+' : '-'}{formatCurrency(item.valor)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
