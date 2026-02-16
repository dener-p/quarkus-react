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
import { Edit, Loader2, Settings } from "lucide-react";
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
import { productSchema, updateRawMaterialProductSchema } from "../lib/schemas";
import { z } from "zod/v3";
import { AddRawMaterialToProductForm } from "./add-raw-material-to-product-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "./ui/sheet";
import type {
  ProductRawMaterial,
  Products,
  RawMaterials,
} from "@/types/apiTypes";
import { ConfirmationModal } from "./confirmation-modal";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { Update } from "vite";

type ProductFormValues = z.infer<typeof productSchema>;
type UpdateRawMaterialProduct = z.infer<typeof updateRawMaterialProductSchema>;

export function ProductsTable() {
  const { data: products, isLoading } = api.getProducts();

  if (isLoading) return <Loader2 className="animate-spin mx-auto" />;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Matérias-primas</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.productId}>
              <TableCell>{product.code}</TableCell>
              <TableCell className="font-medium capitalize">
                {product.name}
              </TableCell>
              <TableCell>{product.value}</TableCell>
              <TableCell>{product.rawMaterials.length} item(s)</TableCell>
              <TableCell className="text-right flex justify-end gap-2">
                <ManageRawMaterialsDialog product={product} />
                <EditProductDialog product={product} />
                <DeleteProductDialog
                  productId={product.productId.toString()}
                  productName={product.name}
                />
              </TableCell>
            </TableRow>
          ))}
          {(!products || products.length === 0) && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function EditProductDialog({ product }: { product: Products }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    values: {
      code: product.code,
      name: product.name,
      value: product.value,
    },
  });

  const mutation = api.updateProduct();
  const handleOpen = (open: boolean) => {
    reset();
    setOpen(open);
  };

  const onSubmit = (data: ProductFormValues) => {
    mutation.mutate(
      { id: product.productId.toString(), payload: data },
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
          <DialogTitle>Editar {product.name}.</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <div className="flex flex-col gap-2">
            <Label htmlFor="code">Código</Label>
            <Input id="code" {...register("code")} />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="value">Valor</Label>
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
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteProductDialog({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const mutation = api.deleteProduct();

  return (
    <ConfirmationModal
      description={`Dejesa deletar o produto ${productName}?`}
      onConfirm={() => mutation.mutate(productId)}
      isLoading={mutation.isPending}
      isSuccess={mutation.isSuccess}
    />
  );
}

function ManageRawMaterialsDialog({ product }: { product: Products }) {
  const deleteMutation = api.deleteRawMaterialFromProduct();

  const handleRemove = (rawMaterialId: number) => {
    deleteMutation.mutate({
      id: rawMaterialId,
    });
  };

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon">
            <Settings />
          </Button>
        }
      ></SheetTrigger>
      <SheetContent className="min-w-full lg:min-w-2xl">
        <SheetHeader>
          <SheetTitle>{product.name}</SheetTitle>
          <SheetDescription className="flex justify-end">
            <AddRawMaterialToProductForm productId={product.productId} />
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 px-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matéria Prima</TableHead>
                  <TableHead>Quantidade usada</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.rawMaterials.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      <EditRawMatareialToProduct rawMaterial={item} />
                      <ConfirmationModal
                        isLoading={deleteMutation.isPending}
                        onConfirm={() => handleRemove(item.id)}
                        isSuccess={deleteMutation.isSuccess}
                        description={`Deseja remove a matéria prima: ${item.name}?`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {product.rawMaterials.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center h-24 text-muted-foreground"
                    >
                      Nenhuma matéria prima.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
function EditRawMatareialToProduct({
  rawMaterial,
}: {
  rawMaterial: ProductRawMaterial;
}) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateRawMaterialProduct>({
    resolver: zodResolver(updateRawMaterialProductSchema),
    values: {
      quantity: rawMaterial.quantity,
      id: rawMaterial.id,
    },
  });

  const mutation = api.updateRawMaterialProduct();
  const handleOpen = (open: boolean) => {
    reset();
    setOpen(open);
  };

  const onSubmit = (data: UpdateRawMaterialProduct) => {
    mutation.mutate(
      { id: rawMaterial.id.toString(), quantity: data.quantity },
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
          <DialogTitle>Editar {rawMaterial.name} </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <div className="flex flex-col gap-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              {...register("quantity")}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity.message}</p>
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
