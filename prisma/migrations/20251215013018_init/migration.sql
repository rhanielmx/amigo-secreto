-- CreateTable
CREATE TABLE "Grupo" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "adminToken" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sorteado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participante" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "grupoId" TEXT NOT NULL,

    CONSTRAINT "Participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sorteio" (
    "id" TEXT NOT NULL,
    "grupoId" TEXT NOT NULL,
    "sorteadorId" TEXT NOT NULL,
    "sorteadoId" TEXT NOT NULL,
    "revelado" BOOLEAN NOT NULL DEFAULT false,
    "reveladoEm" TIMESTAMP(3),

    CONSTRAINT "Sorteio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grupo_adminToken_key" ON "Grupo"("adminToken");

-- CreateIndex
CREATE UNIQUE INDEX "Participante_codigo_key" ON "Participante"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Sorteio_sorteadoId_key" ON "Sorteio"("sorteadoId");

-- AddForeignKey
ALTER TABLE "Participante" ADD CONSTRAINT "Participante_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sorteio" ADD CONSTRAINT "Sorteio_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sorteio" ADD CONSTRAINT "Sorteio_sorteadorId_fkey" FOREIGN KEY ("sorteadorId") REFERENCES "Participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sorteio" ADD CONSTRAINT "Sorteio_sorteadoId_fkey" FOREIGN KEY ("sorteadoId") REFERENCES "Participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
