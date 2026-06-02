import { NextRequest, NextResponse } from 'next/server'
import { type Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const month = searchParams.get('month')
  const year = searchParams.get('year')
  const usuario = searchParams.get('usuario')
  const categoria = searchParams.get('categoria')
  const situacao = searchParams.get('situacao')

  const where: Prisma.DespesaWhereInput = {}

  if (month && year) {
    const start = new Date(parseInt(year), parseInt(month) - 1, 1)
    const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
    where.data = { gte: start, lte: end }
  }

  if (usuario && usuario !== 'TODOS') where.usuario = usuario
  if (categoria && categoria !== 'TODAS') where.categoria = categoria
  if (situacao && situacao !== 'TODAS') where.situacao = situacao

  const despesas = await prisma.despesa.findMany({
    where,
    orderBy: { data: 'desc' },
  })

  return NextResponse.json(
    despesas.map((d) => ({ ...d, valor: d.valor.toNumber() }))
  )
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { usuario, data, categoria, valor, metodoPagamento, situacao, isFixo, descricao } = body

  if (!usuario || !data || !categoria || !valor || !metodoPagamento || !situacao) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
  }

  const despesa = await prisma.despesa.create({
    data: {
      usuario,
      data: new Date(data),
      categoria,
      valor,
      metodoPagamento,
      situacao,
      isFixo: isFixo ?? false,
      descricao: descricao || null,
    },
  })

  return NextResponse.json({ ...despesa, valor: despesa.valor.toNumber() }, { status: 201 })
}
