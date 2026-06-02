import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const despesa = await prisma.despesa.findUnique({ where: { id } })
  if (!despesa) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ...despesa, valor: despesa.valor.toNumber() })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const { usuario, data, categoria, valor, metodoPagamento, situacao, isFixo, descricao } = body

  const despesa = await prisma.despesa.update({
    where: { id },
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

  return NextResponse.json({ ...despesa, valor: despesa.valor.toNumber() })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.despesa.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
