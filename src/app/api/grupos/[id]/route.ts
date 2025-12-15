import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const grupo = await prisma.grupo.findUnique({
      where: { adminToken: id },
      include: {
        participantes: {
          select: {
            id: true,
            nome: true,
            telefone: true,
            codigo: true,
          },
        },
        sorteios: {
          select: {
            sorteadorId: true,
            revelado: true,
          },
        },
      },
    });

    if (!grupo) {
      return NextResponse.json(
        { error: 'Grupo não encontrado' },
        { status: 404 }
      );
    }

    // Mapear participantes com o campo revelado vindo da tabela Sorteio
    const participantesComRevelado = grupo.participantes.map((p: any) => {
      const sorteio = grupo.sorteios.find((s: any) => s.sorteadorId === p.id);
      return {
        ...p,
        revelado: sorteio?.revelado || false,
      };
    });

    return NextResponse.json({
      id: grupo.id,
      nome: grupo.nome,
      descricao: grupo.descricao,
      sorteado: grupo.sorteado,
      adminToken: grupo.adminToken,
      participantes: participantesComRevelado,
    });
  } catch (error) {
    console.error('Erro ao buscar grupo:', params);
    return NextResponse.json(
      { error: 'Erro ao buscar grupo' },
      { status: 500 }
    );
  }
}
