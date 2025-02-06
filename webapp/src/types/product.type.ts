import * as Yup from "yup";

export interface Product {
  productId: number;
  productName: string;
  productBrandName: string;
  productCategory: string;
  avgSales: number;
  productInventoryInfo: ProductInventoryInfo[];
}

export type ProductInventoryInfo = {
  quantity: number;
  price: number;
};

export interface AddProductPayload
  extends Omit<Product, "productId" | "productInventoryInfo"> {
  productInventoryInfo: ProductQuantityAndPrice[];
}

export interface InventoryResponse
  extends Omit<Product, "productInventoryInfo"> {
  productInventoryInfo: ProductQuantityAndPrice[];
}

export type UpdateProductPayload = Partial<AddProductPayload>;

export interface ProductResponse extends Product {}

export interface ProductQuantityAndPricePayload
  extends ProductQuantityAndPrice {
  productId: number;
}

export interface ProductQuantityAndPrice {
  sellingPrice: number;
  buyingPrice: number;
  quantity: number;
}

export interface CashierProductResponse extends ProductResponse {
  productInventoryInfo: CashierProductInfo[];
}

export interface CashierProductInfo extends ProductInventoryInfo {
  selectedItems: number;
}

export const CreateProductReqSchema = Yup.object().shape({
  productName: Yup.string().required(),
  productBrandName: Yup.string().required(),
  productCategory: Yup.string().required(),
  avgSales: Yup.number().strict().required(),
  productInventoryInfo: Yup.array()
    .of(
      Yup.object().shape({
        price: Yup.number().strict().required(),
        quantity: Yup.number().strict(),
      })
    )
    .required(),
});
