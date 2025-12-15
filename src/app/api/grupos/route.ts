import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { gerarCodigo } from '@/lib/sorteio';
import { enviarSMSEmLote } from '@/lib/notificacao';
import { env } from '@/lib/env';

export async function POST(request: Request) {
  try {
    const { nome, descricao, participantes, enviarSMS } = await request.json();
    if (!nome || !participantes || participantes.length < 2) {
      return NextResponse.json(
        { error: 'Nome e pelo menos 2 participantes são obrigatórios' },
        { status: 400 }
      );
    }

    const grupo = await prisma.grupo.create({
      data: {
        nome,
        descricao,
        participantes: {
          create: participantes.map((p: any) => ({
            nome: p.nome,
            telefone: p.telefone,
            codigo: gerarCodigo(),
          })),
        },
      },
      include: {
        participantes: true,
      },
    });

    let smsResultado = null;
    if (enviarSMS) {
      smsResultado = await enviarSMSEmLote(
        grupo.participantes,
        grupo.id,
        grupo.nome
      );
    }

    return NextResponse.json({
      grupoId: grupo.id,
      adminToken: grupo.adminToken,
      adminUrl: `${env.NEXT_PUBLIC_BASE_URL}/admin/${grupo.adminToken}`,
      participantesUrl: `${env.NEXT_PUBLIC_BASE_URL}/grupo/${grupo.id}`,
      smsResultado,
      participantes: grupo.participantes.map(p => ({
        nome: p.nome,
        codigo: p.codigo,
        telefone: p.telefone,
      })),
    });
  } catch (error) {
    console.error('Erro ao criar grupo:', error);
    return NextResponse.json(
      { error: 'Erro ao criar grupo' },
      { status: 500 }
    );
  }
}