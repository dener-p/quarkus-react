
import { z } from "zod/v3";

export const productSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  value: z.coerce.number().min(0, "Value must be positive")
});

export const rawMaterialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  stockQuantity: z.coerce.number().int().min(0, "Stock quantity must be a positive integer")
});

export const addRawMaterialToProductSchema = z.object({
  rawMaterialId: z.coerce.number().min(1, "Raw material is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1")
});
