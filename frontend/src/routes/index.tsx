import { CreateProductForm } from "@/components/create-product-form";
import { CreateRawMaterialForm } from "@/components/create-raw-material-form";
import { ProductsTable } from "@/components/products-table";
import { RawMaterialsTable } from "@/components/raw-materials-table";
import { SuggestionsTable } from "@/components/suggestions-table";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
      <Tabs defaultValue="products">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="raw-material">Matérias-primas</TabsTrigger>
            <TabsTrigger value="suggestions">Sugestões</TabsTrigger>
          </TabsList>
          <ButtonGroup>
            <CreateProductForm />
            <CreateRawMaterialForm />
          </ButtonGroup>
        </div>
        <TabsContent value="products">
          <ProductsTable />
        </TabsContent>
        <TabsContent value="raw-material">
          <RawMaterialsTable />
        </TabsContent>
        <TabsContent value="suggestions">
          <SuggestionsTable />
        </TabsContent>
      </Tabs>
    </section>
  );
}
