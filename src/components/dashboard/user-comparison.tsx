import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface UserComparisonProps {
  receitaJacson: number
  receitaManueli: number
  despesaJacson: number
  despesaManueli: number
}

export function UserComparison({
  receitaJacson,
  receitaManueli,
  despesaJacson,
  despesaManueli,
}: UserComparisonProps) {
  const totalReceitas = receitaJacson + receitaManueli
  const pctJacson = totalReceitas > 0 ? (receitaJacson / totalReceitas) * 100 : 0

  const saldoJacson = receitaJacson - despesaJacson
  const saldoManueli = receitaManueli - despesaManueli

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Comparativo por Usuário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Jacson */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-400" />
            <p className="text-sm font-semibold text-foreground">Jacson</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground mb-0.5">Receitas</p>
              <p className="font-mono font-semibold text-green-400">{formatCurrency(receitaJacson)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Despesas</p>
              <p className="font-mono font-semibold text-red-400">{formatCurrency(despesaJacson)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Saldo</p>
              <p className={`font-mono font-semibold ${saldoJacson >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(saldoJacson)}
              </p>
            </div>
          </div>
        </div>

        {/* Manueli */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-400" />
            <p className="text-sm font-semibold text-foreground">Manueli</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground mb-0.5">Receitas</p>
              <p className="font-mono font-semibold text-green-400">{formatCurrency(receitaManueli)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Despesas</p>
              <p className="font-mono font-semibold text-red-400">{formatCurrency(despesaManueli)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Saldo</p>
              <p className={`font-mono font-semibold ${saldoManueli >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(saldoManueli)}
              </p>
            </div>
          </div>
        </div>

        {/* Distribuição de receitas */}
        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Distribuição de Receitas</p>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="absolute left-0 h-full rounded-l-full bg-blue-500 transition-all duration-500"
              style={{ width: `${pctJacson}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-blue-400">Jacson {pctJacson.toFixed(0)}%</span>
            <span className="text-purple-400">Manueli {(100 - pctJacson).toFixed(0)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
