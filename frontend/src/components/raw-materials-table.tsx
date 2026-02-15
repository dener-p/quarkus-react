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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rawMaterialSchema } from "../lib/schemas";
import { z } from "zod/v3";
import { ConfirmationModal } from "./confirmation-modal";

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

function EditRawMaterialDialog({ rawMaterial }: { rawMaterial: any }) {
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
          <DialogTitle>Edit Raw Material</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              {...register("name")}
              className="mt-1 block w-full rounded-md border p-2 bg-transparent"
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
              className="mt-1 block w-full rounded-md border p-2 bg-transparent"
            />
            {errors.stockQuantity && (
              <p className="text-red-500 text-sm">
                {errors.stockQuantity.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
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
