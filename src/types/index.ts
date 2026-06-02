export type Usuario = 'JACSON' | 'MANUELI'
export type MetodoPagamento = 'DINHEIRO' | 'CARTAO' | 'PIX'
export type Situacao = 'PAGO' | 'PENDENTE'

export interface Despesa {
  id: string
  usuario: Usuario
  data: string
  categoria: string
  valor: number
  metodoPagamento: MetodoPagamento
  situacao: Situacao
  isFixo: boolean
  descricao: string | null
  createdAt: string
}

export interface Receita {
  id: string
  usuario: Usuario
  data: string
  tipo: string
  valor: number
  descricao: string | null
  createdAt: string
}

export interface DespesaInput {
  usuario: Usuario
  data: string
  categoria: string
  valor: number
  metodoPagamento: MetodoPagamento
  situacao: Situacao
  isFixo: boolean
  descricao?: string
}

export interface ReceitaInput {
  usuario: Usuario
  data: string
  tipo: string
  valor: number
  descricao?: string
}

export interface DashboardStats {
  totalReceitas: number
  totalDespesas: number
  totalPago: number
  totalPendente: number
  saldo: number
  receitaJacson: number
  receitaManueli: number
  despesaJacson: number
  despesaManueli: number
  categorias: { categoria: string; total: number }[]
  recentes: RecenteItem[]
}

export interface RecenteItem {
  id: string
  tipo: 'despesa' | 'receita'
  descricao: string
  categoria: string
  valor: number
  data: string
  usuario: Usuario
  situacao?: Situacao
}
