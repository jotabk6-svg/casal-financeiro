import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Limpando dados existentes...')
  await prisma.despesa.deleteMany()
  await prisma.receita.deleteMany()

  const junho2026 = (day: number) => new Date(2026, 5, day)
  const maio2026 = (day: number) => new Date(2026, 4, day)

  console.log('Inserindo receitas...')
  await prisma.receita.createMany({
    data: [
      { usuario: 'JACSON', data: junho2026(1), tipo: 'Salário', valor: 5500.0, descricao: 'Salário junho' },
      { usuario: 'MANUELI', data: junho2026(1), tipo: 'Salário', valor: 3800.0, descricao: 'Salário junho' },
      { usuario: 'JACSON', data: junho2026(15), tipo: 'Freelance', valor: 1200.0, descricao: 'Projeto site' },
      { usuario: 'JACSON', data: maio2026(1), tipo: 'Salário', valor: 5500.0, descricao: 'Salário maio' },
      { usuario: 'MANUELI', data: maio2026(1), tipo: 'Salário', valor: 3800.0, descricao: 'Salário maio' },
    ],
  })

  console.log('Inserindo despesas...')
  await prisma.despesa.createMany({
    data: [
      // Junho - Jacson
      { usuario: 'JACSON', data: junho2026(1), categoria: 'Moradia', valor: 1200.0, metodoPagamento: 'PIX', situacao: 'PAGO', isFixo: true, descricao: 'Aluguel' },
      { usuario: 'JACSON', data: junho2026(5), categoria: 'Serviços', valor: 189.9, metodoPagamento: 'CARTAO', situacao: 'PAGO', isFixo: true, descricao: 'Internet + streaming' },
      { usuario: 'JACSON', data: junho2026(10), categoria: 'Alimentação', valor: 620.0, metodoPagamento: 'PIX', situacao: 'PAGO', isFixo: false, descricao: 'Mercado' },
      { usuario: 'JACSON', data: junho2026(12), categoria: 'Transporte', valor: 280.0, metodoPagamento: 'PIX', situacao: 'PAGO', isFixo: false, descricao: 'Uber + gasolina' },
      { usuario: 'JACSON', data: junho2026(15), categoria: 'Saúde', valor: 350.0, metodoPagamento: 'CARTAO', situacao: 'PAGO', isFixo: false, descricao: 'Dentista' },
      { usuario: 'JACSON', data: junho2026(20), categoria: 'Lazer', valor: 450.0, metodoPagamento: 'CARTAO', situacao: 'PENDENTE', isFixo: false, descricao: 'Jantar aniversário' },
      { usuario: 'JACSON', data: junho2026(22), categoria: 'Tecnologia', valor: 79.9, metodoPagamento: 'CARTAO', situacao: 'PENDENTE', isFixo: true, descricao: 'Adobe' },
      // Junho - Manueli
      { usuario: 'MANUELI', data: junho2026(2), categoria: 'Beleza', valor: 250.0, metodoPagamento: 'PIX', situacao: 'PAGO', isFixo: false, descricao: 'Salão' },
      { usuario: 'MANUELI', data: junho2026(8), categoria: 'Alimentação', valor: 380.0, metodoPagamento: 'PIX', situacao: 'PAGO', isFixo: false, descricao: 'Mercado' },
      { usuario: 'MANUELI', data: junho2026(14), categoria: 'Saúde', valor: 180.0, metodoPagamento: 'CARTAO', situacao: 'PAGO', isFixo: true, descricao: 'Academia' },
      { usuario: 'MANUELI', data: junho2026(18), categoria: 'Vestuário', valor: 320.0, metodoPagamento: 'CARTAO', situacao: 'PENDENTE', isFixo: false, descricao: 'Roupas' },
      { usuario: 'MANUELI', data: junho2026(25), categoria: 'Educação', valor: 450.0, metodoPagamento: 'PIX', situacao: 'PENDENTE', isFixo: true, descricao: 'Curso inglês' },
      // Maio - histórico
      { usuario: 'JACSON', data: maio2026(1), categoria: 'Moradia', valor: 1200.0, metodoPagamento: 'PIX', situacao: 'PAGO', isFixo: true, descricao: 'Aluguel' },
      { usuario: 'JACSON', data: maio2026(10), categoria: 'Alimentação', valor: 580.0, metodoPagamento: 'PIX', situacao: 'PAGO', isFixo: false, descricao: 'Mercado' },
      { usuario: 'MANUELI', data: maio2026(5), categoria: 'Beleza', valor: 220.0, metodoPagamento: 'PIX', situacao: 'PAGO', isFixo: false, descricao: 'Salão' },
      { usuario: 'MANUELI', data: maio2026(14), categoria: 'Saúde', valor: 180.0, metodoPagamento: 'CARTAO', situacao: 'PAGO', isFixo: true, descricao: 'Academia' },
    ],
  })

  console.log('✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
