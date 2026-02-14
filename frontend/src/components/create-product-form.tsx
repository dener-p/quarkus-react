import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../lib/schemas";
import { api } from "../lib/api";
import { z } from "zod/v3";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus, PlusCircle } from "lucide-react";

type ProductFormValues = z.infer<typeof productSchema>;

export function CreateProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const mutation = api.createProduct();

  const onSubmit = (data: ProductFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          <PlusCircle />
          Adicionar Produto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <h2 className="text-xl font-bold">Create Product</h2>

          <div>
            <label htmlFor="code" className="block text-sm font-medium">
              Code
            </label>
            <input
              id="code"
              {...register("code")}
              className="mt-1 block w-full rounded-md border p-2"
            />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              {...register("name")}
              className="mt-1 block w-full rounded-md border p-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-medium">
              Value
            </label>
            <input
              id="value"
              type="number"
              step="0.01"
              {...register("value")}
              className="mt-1 block w-full rounded-md border p-2"
            />
            {errors.value && (
              <p className="text-red-500 text-sm">{errors.value.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending ? "Creating..." : "Create Product"}
          </button>

          {mutation.isError && (
            <p className="text-red-500">Error creating product</p>
          )}
          {mutation.isSuccess && (
            <p className="text-green-500">Product created successfully!</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
