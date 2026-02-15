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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../lib/schemas";
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
import type { Products } from "@/types/apiTypes";
import { ConfirmationModal } from "./confirmation-modal";

type ProductFormValues = z.infer<typeof productSchema>;

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

function EditProductDialog({ product }: { product: any }) {
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
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <div>
            <label htmlFor="code" className="block text-sm font-medium">
              Code
            </label>
            <input
              id="code"
              {...register("code")}
              className="mt-1 block w-full rounded-md border p-2 bg-transparent"
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
              className="mt-1 block w-full rounded-md border p-2 bg-transparent"
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
              className="mt-1 block w-full rounded-md border p-2 bg-transparent"
            />
            {errors.value && (
              <p className="text-red-500 text-sm">{errors.value.message}</p>
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
