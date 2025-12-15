'use client';

import React from 'react';
import { Gift, Sparkles, Users, Smartphone, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Zap,
      title: 'Sorteio Instantâneo',
      description: 'Crie seu grupo e sorteie em segundos. Simples, rápido e automático.',
    },
    {
      icon: Smartphone,
      title: 'SMS Automático',
      description: 'Códigos enviados direto no celular. Sem complicação, sem apps.',
    },
    {
      icon: Shield,
      title: '100% Seguro',
      description: 'Códigos únicos e criptografados. Ninguém descobre antes da hora.',
    },
    {
      icon: Users,
      title: 'Ilimitado',
      description: 'Quantos participantes você quiser. Perfeito para grupos grandes.',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Crie o Grupo',
      description: 'Adicione o nome do grupo e os participantes com seus telefones',
      color: 'from-red-500 to-pink-500',
    },
    {
      step: '2',
      title: 'Envie os SMS',
      description: 'Sistema envia códigos automaticamente para todos os celulares',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      step: '3',
      title: 'Realize o Sorteio',
      description: 'Clique em sortear quando todos estiverem prontos',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      step: '4',
      title: 'Revelem os Amigos',
      description: 'Cada pessoa digita seu código e descobre quem tirou',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-pink-50 to-green-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-green-500 rounded-full mb-8 animate-bounce">
              <Gift className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Amigo Secreto<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600">
                Descomplicado
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Crie, sorteie e envie os códigos por SMS automaticamente. 
              Perfeito para famílias, empresas e grupos de amigos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => window.location.href = '/criar'}
                className="group px-8 py-4 bg-gradient-to-r from-red-600 to-green-600 text-white font-bold rounded-full hover:from-red-700 hover:to-green-700 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center gap-2"
              >
                <Gift className="w-5 h-5" />
                Criar Amigo Secreto Grátis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition-all shadow-lg border-2 border-gray-200">
                Ver Como Funciona
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Grátis para sempre</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>SMS automático</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Sem cadastro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-red-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que escolher nosso sistema?
            </h2>
            <p className="text-xl text-gray-600">
              A forma mais moderna e prática de organizar seu amigo secreto
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-100 hover:border-red-200 transition-all hover:shadow-xl group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Como funciona?
            </h2>
            <p className="text-xl text-gray-600">
              Em 4 passos simples você organiza tudo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-xl h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <span className="text-3xl font-black text-white">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
                
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-red-600 via-pink-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-8">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Pronto para começar?
          </h2>
          
          <p className="text-xl text-white text-opacity-90 mb-8">
            Crie seu amigo secreto agora e surpreenda todos com a praticidade
          </p>

          <button
            onClick={() => window.location.href = '/criar'}
            className="group px-10 py-5 bg-white text-red-600 font-bold rounded-full hover:bg-gray-50 transition-all shadow-2xl transform hover:scale-105 inline-flex items-center gap-3 text-lg"
          >
            <Gift className="w-6 h-6" />
            Criar Meu Amigo Secreto
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-white text-opacity-80 mt-6 text-sm">
            ✨ Grátis • Sem cadastro • SMS automático
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="w-6 h-6" />
            <span className="font-bold text-xl">Amigo Secreto</span>
          </div>
          <p className="text-gray-400 text-sm">
            Feito com ❤️ para facilitar sua vida
          </p>
          <p className="text-gray-500 text-xs mt-4">
            © 2024 - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}