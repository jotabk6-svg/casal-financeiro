import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, CATEGORIA_CORES } from '@/lib/utils'

interface CategoryBreakdownProps {
  categorias: { categoria: string; total: number }[]
  totalDespesas: number
}

export function CategoryBreakdown({ categorias, totalDespesas }: CategoryBreakdownProps) {
  const sorted = [...categorias].sort((a, b) => b.total - a.total).slice(0, 8)

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Nenhuma despesa registrada</p>
        ) : (
          <div className="space-y-4">
            {sorted.map(({ categoria, total }) => {
              const pct = totalDespesas > 0 ? (total / totalDespesas) * 100 : 0
              const cor = CATEGORIA_CORES[categoria] ?? '#71717a'
              return (
                <div key={categoria} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cor }} />
                      <span className="text-foreground font-medium">{categoria}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span>{pct.toFixed(0)}%</span>
                      <span className="font-mono font-semibold text-red-400 w-24 text-right">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: cor }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
