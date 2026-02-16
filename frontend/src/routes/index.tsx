import { CreateProductForm } from "@/components/create-product-form";
import { CreateRawMaterialForm } from "@/components/create-raw-material-form";
import { ProductionTable } from "@/components/production-table";
import { ProductsTable } from "@/components/products-table";
import { RawMaterialsTable } from "@/components/raw-materials-table";
import { SuggestionsTable } from "@/components/suggestions-table";
import { ButtonGroup } from "@/components/ui/button-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const test = api.getProduction();
  return (
    <section className="container mx-auto max-w-6xl px-2 py-8 space-y-8">
      <h2 className="text-xl font-bold">
        Registro de Produto e Matérias-primas.
      </h2>
      <Tabs defaultValue="products">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="raw-material">Matérias-primas</TabsTrigger>
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
      </Tabs>
      <h2 className="text-xl font-bold">Produção.</h2>
      <Tabs defaultValue="production">
        <TabsList>
          <TabsTrigger value="production">Produção</TabsTrigger>
          <TabsTrigger value="suggestions">Sugestões</TabsTrigger>
        </TabsList>
        <TabsContent value="production">
          <ProductionTable />
        </TabsContent>
        <TabsContent value="suggestions">
          <SuggestionsTable />
        </TabsContent>
      </Tabs>
    </section>
  );
}
