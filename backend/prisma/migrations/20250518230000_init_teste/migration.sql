-- CreateTable
CREATE TABLE "teste" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teste_pkey" PRIMARY KEY ("id")
);
