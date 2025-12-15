'use client'; 

import React, { useState } from 'react';
import { Plus, Trash2, Send, Copy, CheckCircle2, X } from 'lucide-react';

// Sistema de notificações personalizado (substitui o Sonner)
interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'loading';
  message: string;
}

function Toast({ message, onClose }: { message: ToastMessage; onClose: () => void }) {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    loading: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: '✅',
    error: '❌',
    loading: '⏳',
  };

  return (
    <div className={`${colors[message.type]} border-2 rounded-lg p-4 shadow-lg flex items-center gap-3 min-w-[300px] animate-[slide-in_0.3s_ease-out]`}>
      <span className="text-xl">{icons[message.type]}</span>
      <span className="flex-1 font-medium">{message.message}</span>
      {message.type !== 'loading' && (
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default function CriarGrupo() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [enviarSMS, setEnviarSMS] = useState(true);
  const [participantes, setParticipantes] = useState([
    { nome: '', telefone: '' },
    { nome: '', telefone: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [copiado, setCopiado] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'loading', message: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, type, message }]);
    
    if (type !== 'loading') {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    }
    
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const adicionarParticipante = () => {
    setParticipantes([...participantes, { nome: '', telefone: '' }]);
  };

  const removerParticipante = (index: number) => {
    if (participantes.length > 2) {
      setParticipantes(participantes.filter((_, i) => i !== index));
      showToast('success', 'Participante removido');
    } else {
      showToast('error', 'Mínimo de 2 participantes necessários');
    }
  };

  const atualizarParticipante = (index: number, campo: string, valor: string) => {
    const novos = [...participantes];
    
    // Formatar telefone automaticamente
    if (campo === 'telefone') {
      // Remove tudo que não é número
      const numeros = valor.replace(/\D/g, '');
      
      // Formata: (11) 99999-9999
      let telefoneFormatado = numeros;
      if (numeros.length <= 2) {
        telefoneFormatado = numeros;
      } else if (numeros.length <= 6) {
        telefoneFormatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
      } else if (numeros.length <= 10) {
        telefoneFormatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
      } else {
        telefoneFormatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
      }
      
      novos[index] = { ...novos[index], [campo]: telefoneFormatado };
    } else {
      novos[index] = { ...novos[index], [campo]: valor };
    }
    
    setParticipantes(novos);
  };

  const copiarTexto = (texto: string, id: string) => {
    navigator.clipboard.writeText(texto);
    setCopiado(id);
    showToast('success', 'Copiado para área de transferência!');
    setTimeout(() => setCopiado(null), 2000);
  };

  const handleSubmit = async () => {
    const participantesValidos = participantes.filter(
      p => p.nome.trim() && p.telefone.trim()
    );

    if (!nome.trim()) {
      showToast('error', 'Digite o nome do grupo');
      return;
    }

    if (participantesValidos.length < 2) {
      showToast('error', 'Adicione pelo menos 2 participantes com nome e telefone');
      return;
    }

    setLoading(true);
    const toastId = showToast('loading', 'Criando grupo...');

    try {
      const res = await fetch('/api/grupos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          descricao,
          participantes: participantesValidos,
          enviarSMS,
        }),
      });

      const data = await res.json();
      removeToast(toastId);

      if (res.ok) {
        showToast('success', 'Grupo criado com sucesso! 🎉');
        setResultado(data);
        
        if (data.smsResultado) {
          showToast('success', `SMS enviados: ${data.smsResultado.sucessos}/${data.smsResultado.total}`);
        }
      } else {
        showToast('error', data.error || 'Erro ao criar grupo');
      }
    } catch (error) {
      removeToast(toastId);
      showToast('error', 'Erro ao criar grupo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (resultado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Grupo Criado com Sucesso! 🎉
              </h1>
              <p className="text-gray-600">
                {resultado.smsResultado ? 
                  `SMS enviados: ${resultado.smsResultado.sucessos}/${resultado.smsResultado.total}` :
                  'Envie os códigos manualmente para os participantes'}
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
                  🔐 Link Administrativo (Guarde bem!)
                </h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={resultado.adminUrl}
                    readOnly
                    className="flex-1 px-4 py-3 bg-white border-2 border-red-300 rounded-lg font-mono text-sm"
                  />
                  <button
                    onClick={() => copiarTexto(resultado.adminUrl, 'admin')}
                    className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {copiado === 'admin' ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-sm text-red-700 mt-2">
                  ⚠️ Com este link você pode gerenciar o grupo e realizar o sorteio
                </p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">
                  👥 Link para Participantes
                </h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={resultado.participantesUrl}
                    readOnly
                    className="flex-1 px-4 py-3 bg-white border-2 border-blue-300 rounded-lg font-mono text-sm"
                  />
                  <button
                    onClick={() => copiarTexto(resultado.participantesUrl, 'participantes')}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copiado === 'participantes' ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  📋 Códigos dos Participantes
                </h2>
                <div className="space-y-3">
                  {resultado.participantes.map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-900">{p.nome}</p>
                        <p className="text-sm text-gray-600">{p.telefone}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xl text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                          {p.codigo}
                        </span>
                        <button
                          onClick={() => copiarTexto(p.codigo, `codigo-${i}`)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {copiado === `codigo-${i}` ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => window.location.href = resultado.adminUrl}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-green-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-green-700 transition-all shadow-lg"
              >
                Ir para Painel Administrativo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 p-4">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎁 Criar Amigo Secreto
          </h1>
          <p className="text-gray-600">
            Configure seu grupo e envie os códigos automaticamente
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome do Grupo *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Amigo Secreto Família Silva 2024"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Valor máximo R$ 50"
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all resize-none"
              />
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Participantes *
                </h3>
                <button
                  onClick={adicionarParticipante}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              </div>

              <div className="space-y-3">
                {participantes.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={p.nome}
                      onChange={(e) => atualizarParticipante(i, 'nome', e.target.value)}
                      placeholder="Nome completo"
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                    />
                    <input
                      type="tel"
                      value={p.telefone}
                      onChange={(e) => atualizarParticipante(i, 'telefone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                      className="w-48 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                    />
                    {participantes.length > 2 && (
                      <button
                        onClick={() => removerParticipante(i)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enviarSMS}
                  onChange={(e) => setEnviarSMS(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-blue-900 flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Enviar SMS automaticamente
                  </span>
                  <p className="text-sm text-blue-700 mt-1">
                    Os participantes receberão o código por SMS automaticamente
                  </p>
                </div>
              </label>
            </div>

            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                📱 Formato do Telefone
              </h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Digite apenas números</strong>, a formatação é automática:</p>
                <div className="bg-white rounded p-3 mt-2 font-mono text-xs space-y-1">
                  <p>✅ 11999999999 → (11) 99999-9999</p>
                  <p>✅ (11) 99999-9999 → (11) 99999-9999</p>
                  <p>✅ 11 99999-9999 → (11) 99999-9999</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 O código de área é obrigatório (DDD com 2 dígitos)
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-green-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-green-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando grupo...' : '🎄 Criar Grupo e Enviar SMS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}