export type LojaProduct = {
  id: string;
  name: string;
  price: string;
  oldPrice?: string;
  description: string;
  image: string;
  hoverImage: string;
  badge?: "novo" | "oferta";
};

export type CartItem = LojaProduct & {
  quantity: number;
};
