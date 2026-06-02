import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const metas = await prisma.meta.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(metas)
}

export async function POST(req: Request) {
  const { titulo, valorObjetivo, valorAtual, descricao } = await req.json()
  if (!titulo || !valorObjetivo) {
    return NextResponse.json({ error: 'Título e valor objetivo são obrigatórios' }, { status: 400 })
  }
  const meta = await prisma.meta.create({
    data: { titulo, valorObjetivo, valorAtual: valorAtual ?? 0, descricao: descricao ?? null },
  })
  return NextResponse.json(meta, { status: 201 })
}
