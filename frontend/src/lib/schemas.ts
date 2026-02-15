import { z } from "zod/v3";

export const productSchema = z.object({
  code: z
    .string({ message: "Código é requerido." })
    .min(3, { message: "Mínimo de 3 caracteres" })
    .max(20, { message: "Maximo de 20 caracteres" })
    .trim(),
  name: z
    .string()
    .min(3, { message: "Mínimo de 3 caracteres" })
    .max(50, { message: "Maximo de 50 caracteres" })
    .trim(),
  value: z.coerce
    .number()
    .min(0.01, "Insira um número positívo.")
    .max(
      Number.MAX_SAFE_INTEGER,
      `O valor máximo é de ${Number.MAX_SAFE_INTEGER}`,
    ),
});

export const rawMaterialSchema = z.object({
  name: z
    .string({ message: "Nome é requerido." })
    .min(1, "Name is required")
    .max(50, { message: "50" })
    .trim(),
  stockQuantity: z.coerce
    .number()
    .int()
    .min(0, "Stock quantity must be a positive integer"),
});

export const addRawMaterialToProductSchema = z.object({
  rawMaterialId: z.coerce
    .number({ message: "Escolha uma matéria-prima válida." })
    .min(1, "Matéria-prima é obrigatória."),
  quantity: z.coerce
    .number({ message: "Deve ser um número." })
    .int("Número deve ser inteiro.")
    .min(1, "Quantidade dev ser de pelos 1")
    .max(
      Number.MAX_SAFE_INTEGER,
      `Quantidade deve ser menor que ${Number.MAX_SAFE_INTEGER}`,
    ),
});
