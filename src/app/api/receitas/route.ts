import { NextRequest, NextResponse } from 'next/server'
import { type Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const month = searchParams.get('month')
  const year = searchParams.get('year')
  const usuario = searchParams.get('usuario')
  const tipo = searchParams.get('tipo')

  const where: Prisma.ReceitaWhereInput = {}

  if (month && year) {
    const start = new Date(parseInt(year), parseInt(month) - 1, 1)
    const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
    where.data = { gte: start, lte: end }
  }

  if (usuario && usuario !== 'TODOS') where.usuario = usuario
  if (tipo && tipo !== 'TODOS') where.tipo = tipo

  const receitas = await prisma.receita.findMany({
    where,
    orderBy: { data: 'desc' },
  })

  return NextResponse.json(
    receitas.map((r) => ({ ...r, valor: r.valor.toNumber() }))
  )
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { usuario, data, tipo, valor, descricao } = body

  if (!usuario || !data || !tipo || !valor) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
  }

  const receita = await prisma.receita.create({
    data: {
      usuario,
      data: new Date(data),
      tipo,
      valor,
      descricao: descricao || null,
    },
  })

  return NextResponse.json({ ...receita, valor: receita.valor.toNumber() }, { status: 201 })
}
