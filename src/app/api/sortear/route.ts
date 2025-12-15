import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { realizarSorteio } from '@/lib/sorteio';

export async function POST(request: Request) {
  try {
    const { adminToken } = await request.json();

    const grupo = await prisma.grupo.findUnique({
      where: { adminToken },
      include: { participantes: true },
    });

    if (!grupo) {
      return NextResponse.json({ error: 'Grupo não encontrado' }, { status: 404 });
    }

    if (grupo.sorteado) {
      return NextResponse.json({ error: 'Sorteio já realizado' }, { status: 400 });
    }

    const ids = grupo.participantes.map((p: any) => p.id);
    const resultado = realizarSorteio(ids);

    if (!resultado) {
      return NextResponse.json({ error: 'Erro no sorteio' }, { status: 500 });
    }

    await prisma.$transaction([
      ...Array.from(resultado.entries()).map(([sorteadorId, sorteadoId]: [string, string]) =>
        prisma.sorteio.create({
          data: {
            grupoId: grupo.id,
            sorteadorId,
            sorteadoId,
          },
        })
      ),
      prisma.grupo.update({
        where: { id: grupo.id },
        data: { sorteado: true },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao sortear:', error);
    return NextResponse.json({ error: 'Erro ao sortear' }, { status: 500 });
  }
}