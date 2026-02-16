import { api } from "../lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rawMaterialSchema } from "../lib/schemas";
import { z } from "zod/v3";
import { ConfirmationModal } from "./confirmation-modal";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import type { RawMaterials } from "@/types/apiTypes";

type RawMaterialFormValues = z.infer<typeof rawMaterialSchema>;

export function RawMaterialsTable() {
  const { data: rawMaterials, isLoading } = api.getRawMaterials();

  if (isLoading) {
    return <div>Loading raw materials...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Quantidade em estoque</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rawMaterials?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium capitalize">
                {item.name}
              </TableCell>
              <TableCell>{item.stockQuantity}</TableCell>
              <TableCell className="text-right flex justify-end gap-2">
                <EditRawMaterialDialog rawMaterial={item} />
                <DeleteRawMaterialDialog
                  id={item.id.toString()}
                  name={item.name}
                />
              </TableCell>
            </TableRow>
          ))}
          {(!rawMaterials || rawMaterials.length === 0) && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No raw materials found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function EditRawMaterialDialog({ rawMaterial }: { rawMaterial: RawMaterials }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RawMaterialFormValues>({
    resolver: zodResolver(rawMaterialSchema),
    values: {
      name: rawMaterial.name,
      stockQuantity: rawMaterial.stockQuantity,
    },
  });

  const mutation = api.updateRawMaterial();
  const handleOpen = (open: boolean) => {
    reset();
    setOpen(open);
  };

  const onSubmit = (data: RawMaterialFormValues) => {
    mutation.mutate(
      { id: rawMaterial.id.toString(), payload: data },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar {rawMaterial.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="stockQuantity">Quantidade em estoque</Label>
            <Input
              id="stockQuantity"
              type="number"
              {...register("stockQuantity")}
            />
            {errors.stockQuantity && (
              <p className="text-red-500 text-sm">
                {errors.stockQuantity.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={mutation.isPending}
              loading={mutation.isPending}
              className="w-36"
            >
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteRawMaterialDialog({ id, name }: { id: string; name: string }) {
  const mutation = api.deleteRawMaterial();

  return (
    <ConfirmationModal
      description={`Deseja deletar a matéria-prima: ${name}`}
      onConfirm={() => mutation.mutate(id)}
      isLoading={mutation.isPending}
      isSuccess={mutation.isSuccess}
    />
  );
}
