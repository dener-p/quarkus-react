import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addRawMaterialToProductSchema } from "../lib/schemas";
import { api } from "../lib/api";
import { z } from "zod/v3";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

type AddRawMaterialFormValues = z.infer<typeof addRawMaterialToProductSchema>;

interface Props {
  productId: number;
}

export function AddRawMaterialToProductForm({ productId }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddRawMaterialFormValues>({
    resolver: zodResolver(addRawMaterialToProductSchema),
  });

  const mutation = api.addRawMaterialToProduct();
  const { data: rawMaterials } = api.getRawMaterials();

  const onSubmit = (data: AddRawMaterialFormValues) => {
    mutation.mutate(
      {
        id: String(productId),
        rawMaterialId: data.rawMaterialId,
        quantity: data.quantity,
      },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"secondary"}>+</Button>
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4 border rounded-md mt-4"
        >
          <h3 className="text-lg font-bold">Add Raw Material</h3>

          <div>
            <label
              htmlFor="rawMaterialId"
              className="block text-sm font-medium"
            >
              Raw Material
            </label>
            <select
              id="rawMaterialId"
              {...register("rawMaterialId")}
              className="mt-1 block w-full rounded-md border p-2"
            >
              <option value="">Select a raw material</option>
              {rawMaterials?.map((rm: any) => (
                <option key={rm.id} value={rm.id}>
                  {rm.name} (Stock: {rm.stockQuantity})
                </option>
              ))}
            </select>
            {errors.rawMaterialId && (
              <p className="text-red-500 text-sm">
                {errors.rawMaterialId.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              {...register("quantity")}
              className="mt-1 block w-full rounded-md border p-2"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {mutation.isPending ? "Adding..." : "Add to Product"}
          </button>

          {mutation.isError && (
            <p className="text-red-500">Error adding raw material</p>
          )}
          {mutation.isSuccess && (
            <p className="text-green-500">Raw material added successfully!</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
