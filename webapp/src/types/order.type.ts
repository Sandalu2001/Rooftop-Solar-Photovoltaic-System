export interface Order {
  orderId: number;
  customerId?: number;
  userId: number;
  branchId?: number;
  total: number;
  discount?: number;
  products: Product[];
}

export interface Product extends Omit<ProductsInCart, "productName"> {}

export interface ProductsInCart {
  productId: number;
  prductName: string;
  productBrandName: string;
  productCategory: string;
  quantity: number;
  price: number;
  discount?: number;
  total: number;
}

export interface OrderData extends Omit<AddOrderPayload, "products"> {
  noOfItems: number;
  products: ProductsInCart[];
}

export interface AddOrderPayload extends Omit<Order, "orderId"> {}
export type UpdateOrderPayload = Partial<AddOrderPayload>;
export interface GetOrdersResBody {}
