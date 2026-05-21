import { z } from "zod";

export const createSupplierSchema = z.object({
  body: z.object({
    codigo: z.string().min(1).max(30),
    nome: z.string().min(2).max(200),
    cnpj: z.string().optional(),
    tipo: z.string().optional(),
    categoria: z.string().optional(),
    fornecedorDesde: z.string().optional(),
    contato: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    telefone: z.string().optional(),
    endereco: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().max(2).optional(),
    condicoesPagamento: z.string().optional(),
    condicoesPagamento2: z.string().optional(),
    observacoes: z.string().optional(),
    status: z.enum(["ATIVO", "INATIVO", "PENDENTE", "CRITICO"]).optional(),
    documentoNome: z.string().optional(),
  }),
});

export const updateSupplierSchema = z.object({
  body: createSupplierSchema.shape.body.partial(),
});

export const listSuppliersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    q: z.string().optional(),
    status: z.enum(["ATIVO", "INATIVO", "PENDENTE", "CRITICO"]).optional(),
  }),
});

export type CreateSupplierDTO = z.infer<typeof createSupplierSchema>["body"];
export type UpdateSupplierDTO = z.infer<typeof updateSupplierSchema>["body"];
