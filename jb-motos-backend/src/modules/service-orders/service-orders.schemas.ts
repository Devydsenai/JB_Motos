import { z } from "zod";

export const createServiceOrderSchema = z.object({
  body: z.object({
    motocicletaId: z.string().uuid("motocicletaId deve ser um UUID válido"),
    mecanicoId: z.string().uuid().optional(),
    descricaoProblema: z.string().min(10, "Descreva o problema com ao menos 10 caracteres"),
    observacoes: z.string().optional(),
    kmEntrada: z.number().int().min(0).optional(),
    previsaoEntrega: z.string().datetime().optional(),
    valorMaoObra: z.number().min(0).default(0),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["ABERTA", "EM_ANALISE", "AGUARDANDO_PECA", "EM_EXECUCAO", "FINALIZADA", "CANCELADA"]),
    observacao: z.string().optional(),
  }),
});

export const updateServiceOrderSchema = z.object({
  body: z.object({
    mecanicoId: z.string().uuid().optional().nullable(),
    observacoes: z.string().optional(),
    observacoesTecnicas: z.string().optional(),
    previsaoEntrega: z.string().datetime().optional(),
    valorMaoObra: z.number().min(0).optional(),
    desconto: z.number().min(0).optional(),
  }),
});

export const listServiceOrdersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    status: z.enum(["ABERTA","EM_ANALISE","AGUARDANDO_PECA","EM_EXECUCAO","FINALIZADA","CANCELADA"]).optional(),
    mecanicoId: z.string().uuid().optional(),
    q: z.string().optional(),
    dataInicio: z.string().optional(),
    dataFim: z.string().optional(),
  }),
});

export type CreateServiceOrderDTO = z.infer<typeof createServiceOrderSchema>["body"];
export type UpdateStatusDTO = z.infer<typeof updateStatusSchema>["body"];
export type UpdateServiceOrderDTO = z.infer<typeof updateServiceOrderSchema>["body"];
