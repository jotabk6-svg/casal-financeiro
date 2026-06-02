import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await prisma.transacao.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const transacao = await prisma.transacao.update({
    where: { id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.descricao !== undefined && { descricao: body.descricao }),
    },
  })
  return NextResponse.json(transacao)
}
