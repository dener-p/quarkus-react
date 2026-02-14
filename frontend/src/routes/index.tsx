import { AddRawMaterialToProductForm } from "@/components/add-raw-material-to-product-form";
import { CreateProductForm } from "@/components/create-product-form";
import { CreateRawMaterialForm } from "@/components/create-raw-material-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { data: suggestions } = api.getProductionSuggestion();

  return (
    <section className="container mx-auto max-w-6xl px-4 py-8">
      <div className="ml-auto w-fit flex gap-2">
        <CreateProductForm />
        <CreateRawMaterialForm />
      </div>
      <AccordionProducts />
      <div className="mt-8">
        <h3>Suggestions</h3>
        {suggestions?.map((d) => (
          <div>
            {d.productName} {d.quantity} {d.value}
          </div>
        ))}
      </div>
    </section>
  );
}

function AccordionProducts() {
  const { data } = api.getProducts();
  if (!data) return null;

  return (
    <Accordion>
      {data.map((product) => (
        <AccordionItem
          value={product.productId.toString()}
          key={product.productId}
        >
          <AccordionTrigger className="capitalize text-base">
            <p>
              <span className="text-muted-foreground">#{product.code}</span> -{" "}
              {product.name.toLowerCase()}{" "}
              <span className="text-green-600">- {product.value}</span>
            </p>
          </AccordionTrigger>
          <AccordionContent>
            <div className="ml-auto">
              <AddRawMaterialToProductForm productId={product.productId} />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
