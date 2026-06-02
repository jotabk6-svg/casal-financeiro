import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()))
  const month = parseInt(searchParams.get('month') ?? String(new Date().getMonth() + 1))
  const tipo = searchParams.get('tipo')
  const usuario = searchParams.get('usuario')

  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 0, 23, 59, 59)

  const where: Record<string, unknown> = { data: { gte: start, lte: end } }
  if (tipo && tipo !== 'TODOS') where.tipo = tipo
  if (usuario && usuario !== 'TODOS') where.usuario = usuario

  const transacoes = await prisma.transacao.findMany({
    where,
    orderBy: { data: 'desc' },
  })

  return NextResponse.json(transacoes)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { usuario, tipo, valor, categoria, data, status, descricao } = body

  if (!usuario || !tipo || !valor || !categoria || !data || !status) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  const transacao = await prisma.transacao.create({
    data: {
      usuario,
      tipo,
      valor,
      categoria,
      data: new Date(data),
      status: tipo === 'RECEITA' ? 'PAGO' : status,
      descricao: descricao || null,
    },
  })

  return NextResponse.json(transacao, { status: 201 })
}
