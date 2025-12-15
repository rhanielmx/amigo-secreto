# 🎁 Amigo Secreto

Uma aplicação web moderna para gerenciar sorteios de amigo secreto com envio automático de SMS.

## ✨ Funcionalidades

- ✅ **Criar grupos** de amigo secreto com múltiplos participantes
- 📱 **Envio automático de SMS** com códigos de acesso via Twilio
- 🎲 **Sorteio automático** com algoritmo de embaralhamento
- 🔐 **Links administrativos** para gerenciar o grupo
- 👥 **Página de participantes** para revelar amigos secretos
- 📊 **Painel de controle** com status do sorteio e progresso de revelações
- 🔄 **Reenvio de SMS** para participantes individuais ou em lote
- 📈 **Rastreamento** de quem já revelou seu amigo secreto

## 🚀 Stack Tecnológico

- **Frontend:** Next.js 16 (App Router) + React + TypeScript
- **Backend:** Next.js API Routes
- **Banco de Dados:** PostgreSQL com Prisma ORM
- **SMS:** Twilio
- **Estilos:** Tailwind CSS
- **Ícones:** Lucide React
- **Validação:** React Hook Form

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Conta Twilio (para SMS)

## ⚙️ Instalação

```bash
# Clonar repositório
git clone https://github.com/rhanielmx/amigo-secreto.git
cd amigo-secreto

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```env
# Banco de dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/amigos"

# Twilio (SMS)
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Aplicação
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NODE_ENV="development"
```

## 🗄️ Configurar Banco de Dados

```bash
# Criar migração inicial
npx prisma migrate dev --name init

# Abrir Prisma Studio para visualizar dados
npx prisma studio
```

## 🏃 Rodando Localmente

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar em produção
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── admin/[token]/          # Painel administrativo
│   ├── grupo/[id]/             # Página para participantes
│   ├── criar/                  # Página de criação de grupo
│   ├── api/
│   │   ├── grupos/             # CRUD de grupos
│   │   ├── revelar/            # Revelar amigo secreto
│   │   └── sortear/            # Realizar sorteio
│   └── page.tsx                # Página inicial
├── lib/
│   ├── prisma.ts               # Cliente Prisma
│   ├── notificacao.ts          # Envio de SMS
│   ├── sorteio.ts              # Lógica do sorteio
│   ├── env.ts                  # Validação de env vars
│   └── utils.ts                # Utilitários
├── components/
│   └── ui/                     # Componentes reutilizáveis
└── generated/
    └── prisma/                 # Cliente Prisma gerado (gitignored)

prisma/
├── schema.prisma               # Schema do banco
├── migrations/                 # Histórico de migrações
└── config.ts                   # Configuração
```

## 🗄️ Schema do Banco de Dados

### Grupo
- `id` - ID único
- `nome` - Nome do grupo
- `descricao` - Descrição opcional
- `adminToken` - Token para acesso administrativo
- `sorteado` - Se o sorteio foi realizado
- `criadoEm` - Data de criação

### Participante
- `id` - ID único
- `nome` - Nome do participante
- `telefone` - Número de telefone
- `codigo` - Código único de acesso
- `grupoId` - Referência ao grupo

### Sorteio
- `id` - ID único
- `grupoId` - Referência ao grupo
- `sorteadorId` - Participante que faz o sorteio
- `sorteadoId` - Participante sorteado (amigo secreto)
- `revelado` - Se a revelação já ocorreu
- `reveladoEm` - Data da revelação

## 🔄 Fluxo de Funcionamento

### 1. Criação do Grupo
```
Usuário → /criar → Preenche formulário → API POST /api/grupos
```

### 2. Envio de SMS
```
API → Twilio → Participante recebe código por SMS
```

### 3. Sorteio
```
Admin → Clica "Realizar Sorteio" → API POST /api/grupos/[id]/sorteio
→ Embaralha participantes → Cria relações na tabela Sorteio
```

### 4. Revelação
```
Participante → Acessa /grupo/[id] → Digita código
→ API POST /api/revelar → Retorna nome do amigo secreto
```

## 📱 Endpoints da API

### POST `/api/grupos`
Criar novo grupo e enviar SMS

**Body:**
```json
{
  "nome": "Amigo Secreto Família",
  "descricao": "Valor máximo R$ 50",
  "participantes": [
    { "nome": "João", "telefone": "11999999999" },
    { "nome": "Maria", "telefone": "11888888888" }
  ],
  "enviarSMS": true
}
```

### GET `/api/grupos/[id]`
Buscar grupo por ID (adminToken)

### POST `/api/grupos/[id]/sorteio`
Realizar sorteio do grupo

### POST `/api/grupos/[id]/reenviar-sms`
Reenviar SMS para participantes

**Body:**
```json
{
  "participanteIds": ["id1", "id2"]  // opcional, se vazio envia para todos
}
```

### POST `/api/revelar`
Revelar amigo secreto

**Body:**
```json
{
  "codigo": "A1B2C3",
  "grupoId": "grupo-123"
}
```

## 🧪 Testes

```bash
# Lint
npm run lint

# Format
npm run format
```

## 🚀 Deploy no Vercel

### 1. Preparar código
```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

### 2. Conectar no Vercel
- Acesse [vercel.com](https://vercel.com)
- Conecte seu repositório GitHub
- Configure variáveis de ambiente

### 3. Variáveis de Ambiente (Vercel)
```
DATABASE_URL=sua_conexao_postgres
TWILIO_ACCOUNT_SID=seu_sid
TWILIO_AUTH_TOKEN=seu_token
TWILIO_PHONE_NUMBER=seu_numero
NEXT_PUBLIC_BASE_URL=https://seu-dominio.com
```

### 4. Conectar Domínio Customizado
- Em Settings → Domains
- Adicione seu domínio
- Atualize os nameservers no provedor do domínio:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`
  - `ns3.vercel-dns.com`
  - `ns4.vercel-dns.com`

## 🔐 Segurança

- ✅ Tokens únicos para acesso administrativo
- ✅ Validação de entrada em todas as rotas
- ✅ HTTPS obrigatório em produção
- ✅ Variáveis sensíveis em `.env`
- ✅ Rate limiting (recomendado)

## 🐛 Troubleshooting

### Erro de conexão com banco
```bash
# Verificar URL do banco
echo $DATABASE_URL

# Testar conexão
npx prisma db push
```

### SMS não enviado
- Verificar saldo Twilio
- Validar número de telefone com DDD
- Confirmar credenciais em `.env`

### Build falha
```bash
# Limpar cache e reinstalar
rm -rf node_modules .next
npm install
npm run build
```

## 📚 Documentação Adicional

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Twilio Docs](https://www.twilio.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📝 Licença

MIT

## 👨‍💻 Autor

Rhanielmx - [@rhanielmx](https://github.com/rhanielmx)

---

**Divirta-se com seu amigo secreto! 🎁**
