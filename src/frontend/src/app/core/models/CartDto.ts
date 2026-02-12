export interface CartItemDto {
  movieId: string;
  title: string;
  quantity: number;
}

export interface CartDto {
  items: CartItemDto[];
  totalQuantity: number;
}
