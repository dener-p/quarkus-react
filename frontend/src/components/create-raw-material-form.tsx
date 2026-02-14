import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rawMaterialSchema } from "../lib/schemas";
import { api } from "../lib/api";
import { z } from "zod/v3";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";

type RawMaterialFormValues = z.infer<typeof rawMaterialSchema>;

export function CreateRawMaterialForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RawMaterialFormValues>({
    resolver: zodResolver(rawMaterialSchema),
  });

  const mutation = api.createRawMaterial();

  const onSubmit = (data: RawMaterialFormValues) => {
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
          Adicioanr Matéria Prima
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-bold">Create Raw Material</h2>

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
            <label
              htmlFor="stockQuantity"
              className="block text-sm font-medium"
            >
              Stock Quantity
            </label>
            <input
              id="stockQuantity"
              type="number"
              {...register("stockQuantity")}
              className="mt-1 block w-full rounded-md border p-2"
            />
            {errors.stockQuantity && (
              <p className="text-red-500 text-sm">
                {errors.stockQuantity.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {mutation.isPending ? "Creating..." : "Create Raw Material"}
          </button>

          {mutation.isError && (
            <p className="text-red-500">Error creating raw material</p>
          )}
          {mutation.isSuccess && (
            <p className="text-green-500">Raw material created successfully!</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
