import { api } from "../lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export function SuggestionsTable() {
  const { data: suggestions, isLoading } = api.getProductionSuggestion();

  if (isLoading) {
    return <div>Loading suggestions...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Valor total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suggestions?.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium capitalize">
                {item.productName}
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.value}</TableCell>
            </TableRow>
          ))}
          {(!suggestions || suggestions.length === 0) && (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                Nenhuma sugestão disponível.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
