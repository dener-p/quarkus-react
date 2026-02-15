import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addRawMaterialToProductSchema } from "../lib/schemas";
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
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";
import type { RawMaterials } from "@/types/apiTypes";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";

type AddRawMaterialFormValues = z.infer<typeof addRawMaterialToProductSchema>;

interface Props {
  productId: number;
}

export function AddRawMaterialToProductForm({ productId }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<AddRawMaterialFormValues>({
    resolver: zodResolver(addRawMaterialToProductSchema),
  });
  const [open, setOpen] = useState(false);

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
          setOpen(false);
        },
      },
    );
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={"default"}>
            <PlusCircle />
            Adicionar Matéria-prima
          </Button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Matéria-prima</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2  ">
          <Label htmlFor="rawMaterialId">Matéria Prima</Label>
          <Controller
            name="rawMaterialId"
            control={control}
            render={({ field }) => {
              return (
                <Combobox
                  items={rawMaterials}
                  onValueChange={(v) => {
                    field.onChange(v?.id);
                  }}
                  itemToStringLabel={(item: RawMaterials) =>
                    rawMaterials?.find((i) => i.id === item.id)?.name ?? ""
                  }
                >
                  <ComboboxInput placeholder="Selecione uma matéria prima" />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: RawMaterials) => (
                        <ComboboxItem key={item.id} value={item}>
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              );
            }}
          />
          {errors.rawMaterialId && (
            <p className="text-red-500 text-sm">
              {errors.rawMaterialId.message}
            </p>
          )}

          <Label htmlFor="quantity">Quantidade</Label>
          <Input id="quantity" type="number" {...register("quantity")} />
          {errors.quantity && (
            <p className="text-red-500 text-sm">{errors.quantity.message}</p>
          )}
          <DialogFooter>
            <Button type="submit" loading={mutation.isPending}>
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
