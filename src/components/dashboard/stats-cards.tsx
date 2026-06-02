import { TrendingUp, TrendingDown, Scale, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface StatsCardsProps {
  totalReceitas: number
  totalDespesas: number
  totalPendente: number
  saldo: number
}

export function StatsCards({ totalReceitas, totalDespesas, totalPendente, saldo }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold font-mono text-green-400 tabular-nums">
            {formatCurrency(totalReceitas)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold font-mono text-red-400 tabular-nums">
            {formatCurrency(totalDespesas)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Saldo</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold font-mono tabular-nums ${saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(saldo)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Pendente</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold font-mono text-yellow-400 tabular-nums">
            {formatCurrency(totalPendente)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
