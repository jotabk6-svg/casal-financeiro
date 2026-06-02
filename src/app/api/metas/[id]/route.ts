import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const meta = await prisma.meta.update({
    where: { id },
    data: {
      ...(body.valorAtual !== undefined && { valorAtual: body.valorAtual }),
      ...(body.titulo && { titulo: body.titulo }),
    },
  })
  return NextResponse.json(meta)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.meta.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
