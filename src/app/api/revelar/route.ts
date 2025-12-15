import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { codigo, grupoId } = await request.json();

    const participante = await prisma.participante.findFirst({
      where: { 
        codigo,
        grupoId,
      },
      include: {
        grupo: true,
        sorteios: {
          include: {
            sorteado: true,
          },
        },
      },
    });
    if (!participante) {
      return NextResponse.json({ error: 'Código inválido' }, { status: 404 });
    }

    if (!participante.grupo.sorteado) {
      return NextResponse.json(
        { error: 'Sorteio ainda não foi realizado' },
        { status: 400 }
      );
    }

    const sorteio = participante.sorteios[0];

    if (!sorteio.revelado) {
      await prisma.sorteio.update({
        where: { id: sorteio.id },
        data: {
          revelado: true,
          reveladoEm: new Date(),
        },
      });
    }

    return NextResponse.json({
      participante: participante.nome,
      amigoSecreto: sorteio.sorteado.nome,
    });
  } catch (error) {
    console.error('Erro ao revelar:', error);
    return NextResponse.json({ error: 'Erro ao revelar' }, { status: 500 });
  }
}