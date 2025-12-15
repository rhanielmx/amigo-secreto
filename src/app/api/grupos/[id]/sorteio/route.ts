import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Fisher-Yates shuffle algorithm
function embaralhar<T>(array: T[]): T[] {
  const resultado = [...array];
  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Buscar o grupo
    const grupo = await prisma.grupo.findUnique({
      where: { adminToken: id },
      include: { participantes: true },
    });

    if (!grupo) {
      return NextResponse.json(
        { error: 'Grupo não encontrado' },
        { status: 404 }
      );
    }

    if (grupo.sorteado) {
      return NextResponse.json(
        { error: 'Este grupo já foi sorteado' },
        { status: 400 }
      );
    }

    if (grupo.participantes.length < 2) {
      return NextResponse.json(
        { error: 'Mínimo de 2 participantes necessários' },
        { status: 400 }
      );
    }

    // Embaralhar participantes
    const participantesEmbaralhados = embaralhar(grupo.participantes);

    // Criar as relações de amigo secreto na tabela Sorteio
    await Promise.all(
      participantesEmbaralhados.map((p: any, index: number) => {
        const proximoIndex = (index + 1) % participantesEmbaralhados.length;
        const proximoParticipante = participantesEmbaralhados[proximoIndex] as any;
        return prisma.sorteio.create({
          data: {
            grupoId: grupo.id,
            sorteadorId: p.id,
            sorteadoId: proximoParticipante.id,
          },
        });
      })
    );

    // Atualizar o grupo como sorteado
    const grupoAtualizado = await prisma.grupo.update({
      where: { adminToken: id },
      data: { sorteado: true },
      include: {
        participantes: {
          select: {
            id: true,
            nome: true,
            telefone: true,
            codigo: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: grupoAtualizado.id,
      nome: grupoAtualizado.nome,
      descricao: grupoAtualizado.descricao,
      sorteado: grupoAtualizado.sorteado,
      adminToken: grupoAtualizado.adminToken,
      participantes: grupoAtualizado.participantes,
    });
  } catch (error) {
    console.error('Erro ao realizar sorteio:', error);
    return NextResponse.json(
      { error: 'Erro ao realizar sorteio' },
      { status: 500 }
    );
  }
}
