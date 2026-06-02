export type Usuario = 'JACSON' | 'MANUELI'
export type TipoTransacao = 'RECEITA' | 'DESPESA'
export type StatusTransacao = 'PAGO' | 'PENDENTE'

export interface Transacao {
  id: string
  usuario: Usuario
  tipo: TipoTransacao
  valor: number
  categoria: string
  data: string
  status: StatusTransacao
  isFixo: boolean
  descricao?: string | null
  createdAt: string
}

export interface TransacaoInput {
  usuario: Usuario
  tipo: TipoTransacao
  valor: number
  categoria: string
  data: string
  status: StatusTransacao
  isFixo?: boolean
  descricao?: string
}

export interface ResumoMes {
  totalReceitas: number
  totalDespesas: number
  totalPendente: number
  saldo: number
}

export interface MesData {
  label: string
  receitas: number
  despesas: number
}

export interface Meta {
  id: string
  titulo: string
  valorObjetivo: number
  valorAtual: number
  descricao?: string | null
  createdAt: string
}

export interface AcertoContas {
  equilibrado: boolean
  valor: number
  quemPaga: Usuario | null
  quemRecebe: Usuario | null
  jacson: number
  manueli: number
}
