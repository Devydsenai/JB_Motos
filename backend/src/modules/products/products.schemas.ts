import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    nome: z.string().min(2).max(200),
    codigo: z.string().min(1).max(50),
    descricao: z.string().optional(),
    categoria: z.string().optional(),
    marcasCompativel: z.array(z.string()).optional(),
    valor: z.coerce.number().min(0),
    precoCusto: z.coerce.number().min(0).optional(),
    quantidade: z.coerce.number().min(0).optional(),
    quantidadeMinima: z.coerce.number().min(0).optional(),
    visivelLoja: z.boolean().optional(),
    ativo: z.boolean().optional(),
    codigoBarras: z.string().optional(),
    localizacao: z.string().optional(),
    peso: z.string().optional(),
    dimensoes: z.string().optional(),
    validade: z.string().optional(),
    imagemUrl: z.string().optional(),
    fornecedorId: z.string().uuid().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
});

export const listProductsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    q: z.string().optional(),
    categoria: z.string().optional(),
    visivelLoja: z.coerce.boolean().optional(),
    ativo: z.coerce.boolean().optional(),
    marca: z.string().optional(),
    estoqueBaixo: z.coerce.boolean().optional(),
  }),
});

export type CreateProductDTO = z.infer<typeof createProductSchema>["body"];
export type UpdateProductDTO = z.infer<typeof updateProductSchema>["body"];
