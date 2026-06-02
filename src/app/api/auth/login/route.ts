import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { usuario, senha } = await req.json()

  if (usuario !== 'JACSON' && usuario !== 'MANUELI') {
    return NextResponse.json({ error: 'Usuário inválido' }, { status: 401 })
  }

  const senhaCorreta =
    usuario === 'JACSON' ? process.env.SENHA_JACSON : process.env.SENHA_MANUELI

  if (!senhaCorreta || senha !== senhaCorreta) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('casal_user', usuario, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return response
}
