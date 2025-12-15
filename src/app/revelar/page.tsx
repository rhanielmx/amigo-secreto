'use client';
import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, AlertCircle } from 'lucide-react';

// Simulando props que viriam do Next.js
interface PageProps {
  grupoId?: string;
}

export default function PaginaParticipante({ grupoId = 'demo-grupo-123' }: PageProps) {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [revelando, setRevelando] = useState(false);

  const handleRevelar = async () => {
    if (codigo.length < 6) {
      setErro('Digite um código válido');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const res = await fetch('/api/revelar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigo.toUpperCase(), grupoId }),
      });

      const data = await res.json();

      if (res.ok) {
        setRevelando(true);
        setTimeout(() => {
          setResultado(data);
          setRevelando(false);
        }, 2000);
      } else {
        setErro(data.error || 'Código inválido');
      }
    } catch (error) {
      setErro('Erro ao revelar amigo secreto');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRevelar();
    }
  };

  if (revelando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-green-600 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-bounce mb-8">
            <Gift className="w-32 h-32 text-white drop-shadow-2xl" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 animate-pulse">
            Revelando seu amigo secreto...
          </h2>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (resultado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center transform animate-[scale-in_0.5s_ease-out]">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-green-500 rounded-full mb-6 animate-pulse">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🎉 Seu Amigo Secreto é...
              </h1>
              <p className="text-gray-600">
                Olá, {resultado.participante}!
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-green-50 border-4 border-red-200 rounded-2xl p-8 mb-8">
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600 mb-2">
                {resultado.amigoSecreto}
              </div>
              <p className="text-gray-600 text-lg">
                Esta é a pessoa para quem você vai dar o presente!
              </p>
            </div>

            <div className="space-y-4 text-left bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <h3 className="font-bold text-yellow-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Lembre-se:
              </h3>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>Mantenha segredo! Não conte para ninguém</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>Pense em um presente especial</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>Respeite o valor combinado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>Divirta-se! 🎁</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="mt-8 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-green-500 rounded-full mb-4">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Amigo Secreto 🎁
          </h1>
          <p className="text-gray-600">
            Digite seu código para descobrir quem é seu amigo secreto
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3 text-center">
              Digite seu código
            </label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value.toUpperCase());
                setErro('');
              }}
              onKeyPress={handleKeyPress}
              placeholder="Ex: A5B7C9"
              maxLength={6}
              className="w-full px-6 py-4 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-200 outline-none transition-all uppercase"
            />
            {erro && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{erro}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleRevelar}
            disabled={loading || codigo.length < 6}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-green-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-green-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-red-600 disabled:hover:to-green-600"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Verificando...
              </span>
            ) : (
              '🎉 Revelar Amigo Secreto'
            )}
          </button>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              💡 Você deve ter recebido seu código por SMS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}