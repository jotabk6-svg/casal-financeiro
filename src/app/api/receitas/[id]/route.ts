import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const receita = await prisma.receita.findUnique({ where: { id } })
  if (!receita) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ...receita, valor: receita.valor.toNumber() })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const { usuario, data, tipo, valor, descricao } = body

  const receita = await prisma.receita.update({
    where: { id },
    data: {
      usuario,
      data: new Date(data),
      tipo,
      valor,
      descricao: descricao || null,
    },
  })

  return NextResponse.json({ ...receita, valor: receita.valor.toNumber() })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.receita.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
