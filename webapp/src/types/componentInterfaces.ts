import { SelectChangeEvent } from "@mui/material";
import { JSX, ReactNode } from "react";

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

export interface ResetPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export interface CustomFormFieldProps {
  name: string;
  label: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
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

export interface StepperInterface {
  setActiveStep: (step: number) => void;
}

export interface OfferDocument {
  contentName: string;
  contentType: string;
  attachment: any;
}

export interface CocoDataInterface {
  coco_output: {
    images: {
      id: number;
      file_name: string;
      height: number;
      width: number;
    }[];
    annotations: {
      id: number;
      image_id: number;
      category_id: number;
      segmentation: number[][];
      bbox: number[];
      area: number;
      iscrowd: number;
      score: number;
    }[];
    categories: {
      id: number;
      name: string;
    }[];
  };
}

export interface AnnotoriousAnnotation {
  id: string;
  bodies: {
    value: string;
    purpose: string;
    annotation?: string;
  }[];
  target: {
    selector: {
      type: string;
      geometry: {
        bounds: {
          minX: number;
          minY: number;
          maxX: number;
          maxY: number;
        };
        points: [number, number][];
      };
    };
    creator?: {
      isGuest: boolean;
      id: string;
    };
    created?: string;
  };
}
