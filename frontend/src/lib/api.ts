import type { Products, RawMaterials, Suggestions } from "@/types/apiTypes";
import { useMutation, useQuery } from "@tanstack/react-query";

const API_LINK = import.meta.env.VITE_SERVER_URL;

// Products

const getProducts = () =>
  useQuery({
    queryKey: ["get_products"],
    queryFn: async () => {
      const data = await fetch(API_LINK + "/products");
      const json = await data.json();
      return json as Products[];
    },
  });

const getProduct = (id: string) =>
  useQuery({
    queryKey: ["get_product", id],
    queryFn: async () => {
      const data = await fetch(API_LINK + "/products/" + id);
      const json = await data.json();
      return json as Products;
    },
    enabled: !!id,
  });

const createProduct = () =>
  useMutation({
    mutationKey: ["create_product"],
    mutationFn: async (payload: any) => {
      const data = await fetch(API_LINK + "/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = await data.json();
      return json;
    },
  });

const updateProduct = () =>
  useMutation({
    mutationKey: ["update_product"],
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const data = await fetch(API_LINK + "/products/" + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = await data.json();
      return json;
    },
  });

const deleteProduct = () =>
  useMutation({
    mutationKey: ["delete_product"],
    mutationFn: async (id: string) => {
      await fetch(API_LINK + "/products/" + id, {
        method: "DELETE",
      });
    },
  });

const addRawMaterialToProduct = () =>
  useMutation({
    mutationKey: ["add_raw_material_to_product"],
    mutationFn: async ({
      id,
      rawMaterialId,
      quantity,
    }: {
      id: string;
      rawMaterialId: number;
      quantity: number;
    }) => {
      const res = await fetch(API_LINK + `/products/${id}/raw-materials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rawMaterialId, quantity }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => new Error("Error"));
        throw new Error(errorData?.msg || "Error Intern");
      }

      return await res.json();
    },
  });

const deleteRawMaterialFromProduct = () =>
  useMutation({
    mutationKey: ["delete_raw_material_from_product"],
    mutationFn: async ({ id }: { id: number }) => {
      const res = await fetch(API_LINK + `/products/${id}/raw-materials`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => new Error("Error"));
        throw new Error(errorData?.msg || "Error Intern");
      }

      return await res.json();
    },
  });

// Production

const getProductionSuggestion = () =>
  useQuery({
    queryKey: ["get_production_suggestion"],
    queryFn: async () => {
      const data = await fetch(API_LINK + "/production/suggestion");
      const json = await data.json();
      return json as Suggestions[];
    },
  });

// Raw Materials

const getRawMaterials = () =>
  useQuery({
    queryKey: ["get_raw_materials"],
    queryFn: async () => {
      const data = await fetch(API_LINK + "/raw-materials");
      const json = await data.json();
      return json as RawMaterials[];
    },
  });

const getRawMaterial = (id: string) =>
  useQuery({
    queryKey: ["get_raw_material", id],
    queryFn: async () => {
      const data = await fetch(API_LINK + "/raw-materials/" + id);
      const json = await data.json();
      return json;
    },
    enabled: !!id,
  });

const createRawMaterial = () =>
  useMutation({
    mutationKey: ["create_raw_material"],
    mutationFn: async (payload: any) => {
      const data = await fetch(API_LINK + "/raw-materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = await data.json();
      return json;
    },
  });

const updateRawMaterial = () =>
  useMutation({
    mutationKey: ["update_raw_material"],
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const data = await fetch(API_LINK + "/raw-materials/" + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = await data.json();
      return json;
    },
  });

const deleteRawMaterial = () =>
  useMutation({
    mutationKey: ["delete_raw_material"],
    mutationFn: async (id: string) => {
      const res = await fetch(API_LINK + "/raw-materials/" + id, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => new Error("Error"));
        throw new Error(errorData?.msg || "Error Intern");
      }
      return await res.json();
    },
  });

export const api = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addRawMaterialToProduct,
  getProductionSuggestion,
  getRawMaterials,
  getRawMaterial,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
  deleteRawMaterialFromProduct,
};
