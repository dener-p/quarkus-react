export type Products = {
  code: string;
  name: string;
  productId: number;
  rawMaterials: {
    id: number;
    name: string;
    quantity: number;
  }[];
  value: number;
};

export type RawMaterials = {
  id: number;
  name: string;
  stockQuantity: number;
};

export type Suggestions = {
  productName: string;
  quantity: number;
  value: number;
};
