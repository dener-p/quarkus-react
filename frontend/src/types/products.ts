export type Products = {
  code: string;
  name: string;
  productId: number;
  rawMaterials: rawMaterials[];
  value: number;
};

export type rawMaterials = {
  id: number;
  name: string;
  stockQuantity: number;
};

export type Suggestions = {
  productName: string;
  quantity: number;
  value: number;
};
