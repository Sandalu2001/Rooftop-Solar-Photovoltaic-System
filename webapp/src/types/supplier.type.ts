import * as Yup from "yup";

export interface Supplier {
  supplierId: number;
  supplierName: string;
  supplierEmail: string;
  supplierPhoneNumber: string;
}

export interface AddSupplierPayload extends Omit<Supplier, "supplierId"> {}

export type UpdateSupplierPayload = Partial<AddSupplierPayload>;

export type SupplierResponse = {
  supplierId: number;
  supplierName: string;
  supplierEmail: string;
  supplierPhoneNumber: string;
};

export const CreateSupplierReqSchema = Yup.object().shape({
  productName: Yup.string().required(),
  productBrandName: Yup.string().required(),
  productCategory: Yup.string().required(),
  avgSales: Yup.number().strict().required(),
  price: Yup.array().of(Yup.number().strict().required()).required(),
});
