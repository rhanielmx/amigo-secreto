import twilio from 'twilio';
import { env } from './env';

const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

interface EnvioSMSParams {
  telefone: string;
  codigo: string;
  nome: string;
  grupoId: string;
  nomeGrupo: string;
}

export async function enviarSMS({ telefone, codigo, nome, grupoId, nomeGrupo }: EnvioSMSParams) {
  try {
    const telefoneFormatado = telefone.startsWith('+55') 
      ? telefone 
      : `+55${telefone.replace(/\D/g, '')}`;

    const mensagem = `🎁 Amigo Secreto: ${nomeGrupo}\n\n👤 ${nome}\nCódigo: ${codigo}\n\nAcesse: ${env.NEXT_PUBLIC_BASE_URL}/grupo/${grupoId}`;
    
    await client.messages.create({
      body: mensagem,
      from: env.TWILIO_PHONE_NUMBER,
      to: telefoneFormatado,
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao enviar SMS:', error);
    return { success: false, error: error.message };
  }
}

export async function enviarSMSEmLote(
  participantes: Array<{ telefone: string; codigo: string; nome: string }>,
  grupoId: string,
  nomeGrupo: string
) {
  const resultados = await Promise.allSettled(
    participantes.map(p => 
      enviarSMS({
        telefone: p.telefone,
        codigo: p.codigo,
        nome: p.nome,
        grupoId,
        nomeGrupo,
      })
    )
  );
  
  const sucessos = resultados.filter(r => r.status === 'fulfilled').length;
  const falhas = resultados.filter(r => r.status === 'rejected').length;
  
  return { sucessos, falhas, total: participantes.length };
}