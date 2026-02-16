import { useMemo, useState } from "react";
import { api } from "../lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export function ProductionTable() {
  const { data: suggestions, isLoading } = api.getProduction();

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const sortedSuggestions = useMemo(() => {
    if (!suggestions) return [];

    return [...suggestions].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.value - b.value;
      }
      return b.value - a.value;
    });
  }, [suggestions, sortOrder]);
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
            <TableHead
              className="cursor-pointer select-none"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
            >
              Valor total {sortOrder === "asc" ? "↑" : "↓"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSuggestions?.map((item, index) => (
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
