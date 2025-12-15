'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Shuffle, Users, CheckCircle2, Clock, Copy, ExternalLink, AlertCircle, Send } from 'lucide-react';

// Simulando dados que viriam do servidor
interface Participante {
  id: string;
  nome: string;
  telefone: string;
  codigo: string;
  revelado?: boolean;
}

interface Grupo {
  id: string;
  nome: string;
  descricao?: string;
  sorteado: boolean;
  participantes: Participante[];
  adminToken: string;
}

// Mock data para demonstração
const mockGrupo: Grupo = {
  id: 'grupo-123',
  nome: 'Amigo Secreto Família Silva 2024',
  descricao: 'Valor máximo R$ 50',
  sorteado: false,
  adminToken: 'admin-token-123',
  participantes: [
    { id: '1', nome: 'João Silva', telefone: '+5511999999999', codigo: 'A1B2C3', revelado: false },
    { id: '2', nome: 'Maria Santos', telefone: '+5511988888888', codigo: 'D4E5F6', revelado: false },
    { id: '3', nome: 'Pedro Oliveira', telefone: '+5511977777777', codigo: 'G7H8I9', revelado: false },
    { id: '4', nome: 'Ana Costa', telefone: '+5511966666666', codigo: 'J1K2L3', revelado: false },
  ],
};

export default function PainelAdmin() {
  const params = useParams(); // ← Pegar o token da URL
  const token = params.token as string;

  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [loading, setLoading] = useState(true);
  const [sorteando, setSorteando] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);
  const [reenviando, setReenviando] = useState<string | null>(null);

  const linkParticipantes = `https://seusite.com/grupo/${grupo?.id}`;
  const revelados = grupo?.participantes.filter(p => p.revelado).length;
  const total = grupo?.participantes.length;

  const copiarTexto = (texto: string, id: string) => {
    navigator.clipboard.writeText(texto);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  };

  const reenviarSMS = async (participanteId?: string) => {
    setReenviando(participanteId || 'todos');

    try {
      const res = await fetch(`/api/grupos/${token}/reenviar-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participanteIds: participanteId ? [participanteId] : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`Erro: ${data.error}`);
        return;
      }

      const data = await res.json();
      alert(`✅ ${data.resultado.sucessos} SMS enviado(s) com sucesso!`);
    } catch (error) {
      console.error('Erro ao reenviar SMS:', error);
      alert('Erro ao reenviar SMS');
    } finally {
      setReenviando(null);
    }
  };

  const realizarSorteio = async () => {
    if (!confirm('Tem certeza que deseja realizar o sorteio? Esta ação não pode ser desfeita!')) {
      return;
    }

    setSorteando(true);

    try {
      const res = await fetch(`/api/grupos/${token}/sorteio`, {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`Erro: ${data.error}`);
        return;
      }

      const data = await res.json();
      setGrupo(data);
      alert('Sorteio realizado com sucesso! ✅');
    } catch (error) {
      console.error('Erro ao realizar sorteio:', error);
      alert('Erro ao realizar sorteio');
    } finally {
      setSorteando(false);
    }
  };

  useEffect(() => {
    const carregarGrupo = async () => {
      try {
        const res = await fetch(`/api/grupos/${token}`);
        const data = await res.json();
        setGrupo(data);
      } catch (error) {
        console.error('Erro ao carregar grupo:', error);
      } finally {
        setLoading(false);
      }
    };
    
    carregarGrupo();
  }, [token]);
  
  if (loading) return <div>Carregando...</div>;
  if (!grupo) return <div>Grupo não encontrado</div>;

  if (sorteando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-600 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin mb-8">
            <Shuffle className="w-32 h-32 text-white drop-shadow-2xl" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 animate-pulse">
            Sorteando amigos secretos...
          </h2>
          <p className="text-white text-lg">
            Aguarde enquanto embaralhamos os participantes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {grupo.nome}
              </h1>
              {grupo.descricao && (
                <p className="text-gray-600">{grupo.descricao}</p>
              )}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">
                {grupo.participantes.length} participantes
              </span>
            </div>
          </div>

          {/* Status do Sorteio */}
          {grupo.sorteado ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-900">
                    Sorteio Realizado
                  </h3>
                  <p className="text-sm text-green-700">
                    Os participantes já podem revelar seus amigos secretos
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-green-200">
                <div className="flex-1 bg-white rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-600">
                    {revelados}/{total}
                  </div>
                  <div className="text-sm text-gray-600">
                    Revelaram o amigo secreto
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-lg p-4">
                  <div className="text-3xl font-bold text-yellow-600">
                    {Math.round((revelados / total) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Progresso
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-yellow-900">
                    Aguardando Sorteio
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Clique no botão abaixo quando todos estiverem prontos
                  </p>
                </div>
              </div>
              <button
                onClick={realizarSorteio}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Shuffle className="w-5 h-5" />
                Realizar Sorteio Agora
              </button>
            </div>
          )}
        </div>

        {/* Link para Participantes */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200 mb-6">
          <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Link para os Participantes
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={linkParticipantes}
              readOnly
              className="flex-1 px-4 py-3 bg-blue-50 border-2 border-blue-300 rounded-lg font-mono text-sm"
            />
            <button
              onClick={() => copiarTexto(linkParticipantes, 'link')}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {copiado === 'link' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            💡 Compartilhe este link com os participantes
          </p>
        </div>

        {/* Lista de Participantes */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Participantes e Códigos
            </h2>
            <button
              onClick={() => reenviarSMS()}
              disabled={reenviando !== null}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
              title="Reenviar SMS para todos os participantes"
            >
              <Send className="w-4 h-4" />
              {reenviando === 'todos' ? 'Reenviando...' : 'Reenviar SMS para Todos'}
            </button>
          </div>
          
          <div className="space-y-3">
            {grupo.participantes.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      {p.nome}
                      {grupo.sorteado && p.revelado && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600">{p.telefone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Código</div>
                    <div className="font-mono font-bold text-lg text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                      {p.codigo}
                    </div>
                  </div>
                  <button
                    onClick={() => copiarTexto(p.codigo, `codigo-${i}`)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiado === `codigo-${i}` ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => reenviarSMS(p.id)}
                    disabled={reenviando !== null}
                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Reenviar SMS para este participante"
                  >
                    {reenviando === p.id ? (
                      <div className="animate-spin"><Send className="w-5 h-5" /></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!grupo.sorteado && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Atenção:</p>
                <p>Os participantes só poderão revelar seus amigos secretos após você realizar o sorteio.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}