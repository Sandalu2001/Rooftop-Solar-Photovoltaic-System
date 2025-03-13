import { SelectChangeEvent } from "@mui/material";
import { ReactNode } from "react";
import { ProductsInCart } from "./order.type";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface TabProps {
  tabTitle: string;
  tabPath: string;
  icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  component: React.ReactNode;
}

export interface OrderedProductCardProps {
  product: ProductsInCart;
}

export interface SupplierInfoCardProps {
  orderId: number;
  expectedTotal: number;
  FinalTotal?: number;
  noOfItems: number;
  supplier: string;
  date: string;
  status: string;
  products: Product[];
}

export interface Product {
  productName: string;
  price: number;
  quantity: number;
}

export enum OrderStatus {
  PENDING = "Pending",
  ONDELIVERY = "OnDelivery",
  DELIVERED = "Delivered",
  CANCELLED = "Canceled",
}

export interface EmployeeInfoCardProps {
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  branch: string;
}

export interface ItemCounterProps {
  noOfItems: number;
  addItems: () => void;
  removeItems: () => void;
}

export interface DataCardProps {
  name: string;
  contactNo: string;
  thumbnail: string;
  email: string;
  branchName?: string;
}

export interface AddOrderModalProps {
  open: boolean;
  handleClose: () => void;
}

export interface AddProductModalProps {
  open: boolean;
  handleClose: () => void;
}

export interface ResetPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export interface CustomFormFieldProps {
  name: string;
  label: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: React.ReactNode;
  type: React.HTMLInputTypeAttribute | undefined;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
}

export interface CustomFormSelectFieldProps {
  name: string;
  label: string;
  value: string | number;
  onChange: (
    event: SelectChangeEvent<string | number>,
    child: ReactNode
  ) => void;
  error?: boolean;
  helperText?: React.ReactNode;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  type: React.HTMLInputTypeAttribute | undefined;
  itemArray: any;
}

export interface AddToCartPopperProps {
  anchorEl: HTMLElement | null;
  handleClick: (event: React.MouseEvent<HTMLElement> | null) => void;
}

export interface BasicInfoPopperProps {
  anchorEl: HTMLElement | null;
}

export interface UserInfoPopperProps {
  anchorEl: HTMLElement | null;
  handleClick: (event: React.MouseEvent<HTMLElement> | null) => void;
}

export interface AddToCartModalProps {
  open: boolean;
  handleClose: () => void;
}

export interface CustomTextFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: React.ReactNode;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  id: string;
  type: React.HTMLInputTypeAttribute | undefined;
}

export enum AuthState {
  ACTIVE = "active",
  LOGOUT = "logout",
  LOADING = "loading",
}
