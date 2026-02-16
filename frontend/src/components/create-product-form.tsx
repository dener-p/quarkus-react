import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../lib/schemas";
import { api } from "../lib/api";
import { z } from "zod/v3";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

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
  const [open, setOpen] = useState(false);

  const mutation = api.createProduct();

  const onSubmit = (data: ProductFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <PlusCircle />
            Produto
          </Button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Produto.</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <div className="flex flex-col gap-1">
            <Label htmlFor="code">Code</Label>
            <Input id="code" {...register("code")} />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              {...register("value")}
            />
            {errors.value && (
              <p className="text-red-500 text-sm">{errors.value.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={mutation.isPending}
              loading={mutation.isPending}
              className="w-36"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
