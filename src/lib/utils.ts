import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'dd/MM/yyyy', { locale: ptBR })
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy', { locale: ptBR })
}

export function getMonthRange(year: number, month: number) {
  const date = new Date(year, month - 1, 1)
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  }
}

export function getCurrentYearMonth() {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }
}

export const CATEGORIAS_DESPESA = [
  'Alimentação',
  'Beleza',
  'Educação',
  'Investimentos',
  'Lazer',
  'Moradia',
  'Pets',
  'Saúde',
  'Serviços',
  'Tecnologia',
  'Transporte',
  'Vestuário',
  'Outros',
] as const

export const TIPOS_RECEITA = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Aluguel',
  'Outros',
] as const

export const CATEGORIA_CORES: Record<string, string> = {
  Alimentação: '#f97316',
  Beleza: '#ec4899',
  Educação: '#8b5cf6',
  Investimentos: '#22c55e',
  Lazer: '#06b6d4',
  Moradia: '#6366f1',
  Pets: '#f59e0b',
  Saúde: '#10b981',
  Serviços: '#64748b',
  Tecnologia: '#3b82f6',
  Transporte: '#84cc16',
  Vestuário: '#e879f9',
  Outros: '#71717a',
}
