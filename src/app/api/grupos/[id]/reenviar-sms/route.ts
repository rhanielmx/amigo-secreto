import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { enviarSMSEmLote } from '@/lib/notificacao';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { participanteIds } = body; // Array de IDs ou undefined para reenviar todos

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

    // Se participanteIds for fornecido, filtra; senão envia para todos
    const participantesParaEnviar = participanteIds
      ? grupo.participantes.filter(p => participanteIds.includes(p.id))
      : grupo.participantes;

    if (participantesParaEnviar.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum participante selecionado' },
        { status: 400 }
      );
    }

    const resultado = await enviarSMSEmLote(
      participantesParaEnviar,
      grupo.id,
      grupo.nome
    );

    return NextResponse.json({
      mensagem: 'SMS reenviados com sucesso',
      resultado,
    });
  } catch (error) {
    console.error('Erro ao reenviar SMS:', error);
    return NextResponse.json(
      { error: 'Erro ao reenviar SMS' },
      { status: 500 }
    );
  }
}
