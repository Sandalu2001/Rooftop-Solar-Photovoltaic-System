import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "../../utils/apiService";
import { State } from "../../types/common.type";
import {
  CashierProductResponse,
  ProductInventoryInfo,
  ProductResponse,
} from "../../types/product.type";
import { AppConfig } from "../../configs/configs";
import {
  AddOrderPayload,
  OrderData,
  ProductsInCart,
} from "../../types/order.type";

interface CashierDashboard {
  products: CashierProductResponse[];
  placeCustomerOrderState: State;
  fetchProductsState: State;
  orderData: OrderData;
}

const initialState: CashierDashboard = {
  placeCustomerOrderState: State.IDLE,
  fetchProductsState: State.IDLE,
  products: [],
  orderData: {
    userId: 1,
    total: 0,
    noOfItems: 0,
    branchId: undefined,
    discount: undefined,
    customerId: undefined,
    products: [],
  },
};

interface ProductsInCartPayload
  extends Omit<ProductsInCart, "total" | "quantity"> {}

const CashierSlice = createSlice({
  name: "cashier",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<CashierProductResponse[]>) {
      state.products = action.payload;
    },
    addToCart(state, action: PayloadAction<ProductsInCartPayload>) {
      const existingProductIndex = state.orderData.products.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.price === action.payload.price
      );

      if (existingProductIndex !== -1) {
        const quantity =
          state.orderData.products[existingProductIndex].quantity + 1;
        state.orderData.products[existingProductIndex] = {
          ...action.payload,
          quantity,
          total:
            state.orderData.products[existingProductIndex].total +
            action.payload.price,
        };
      } else {
        state.orderData.products = [
          ...state.orderData.products,
          { ...action.payload, quantity: 1, total: action.payload.price },
        ];
      }

      // -----------Update total-------------//
      var total = 0;

      state.orderData.products.map((product) => {
        total = total + product.total;
      });
      state.orderData.total = total;
      //-------------------------------------//

      //---------Update Products Array--------//
      const updatedProducts = state.products.map((row) => {
        if (row.productId === action.payload.productId) {
          const updatedProduct = {
            ...row,
            productInventoryInfo: row.productInventoryInfo.map((obj) => {
              if (obj.price === action.payload.price) {
                return {
                  ...obj,
                  quantity: obj.quantity - 1,
                  selectedItems: obj.selectedItems + 1,
                };
              }
              return obj;
            }),
          };
          return updatedProduct;
        }
        return row;
      });
      state.products = updatedProducts;
      //----------------------------------------//
    },
    removeFromCart(state, action: PayloadAction<ProductsInCartPayload>) {
      const existingProductIndex = state.orderData.products.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.price === action.payload.price
      );

      if (existingProductIndex !== -1) {
        const quantity =
          state.orderData.products[existingProductIndex].quantity - 1;
        if (quantity === 0) {
          state.orderData.products.splice(existingProductIndex, 1);
        } else {
          state.orderData.products[existingProductIndex] = {
            ...action.payload,
            quantity,
            total:
              state.orderData.products[existingProductIndex].total -
              action.payload.price,
          };
        }
      }

      // -----------Update total-------------//
      var total = 0;

      state.orderData.products.map((product) => {
        total = total + product.total;
      });
      state.orderData.total = total;
      //-------------------------------------//

      //---------Update Products Array--------//

      const updatedProducts = state.products.map((row) => {
        if (row.productId === action.payload.productId) {
          const updatedProduct = {
            ...row,
            productInventoryInfo: row.productInventoryInfo.map((obj) => {
              if (obj.price === action.payload.price && obj.selectedItems > 0) {
                return {
                  ...obj,
                  quantity: obj.quantity + 1,
                  selectedItems: obj.selectedItems - 1,
                };
              }
              return obj;
            }),
          };
          return updatedProduct;
        }
        return row;
      });
      state.products = updatedProducts;
      //-------------------------------------//
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state, action) => {
      state.fetchProductsState = State.LOADING;
    });
    builder.addCase(
      getProducts.fulfilled,
      (state, action: PayloadAction<ProductResponse[]>) => {
        state.fetchProductsState = State.SUCCESS;
        state.products = action.payload.map((product) => {
          return {
            ...product,
            productInventoryInfo: product.productInventoryInfo.map((info) => {
              return {
                ...info,
                selectedItems: 0,
              };
            }),
          };
        });
        state.orderData = {
          userId: 1,
          total: 0,
          noOfItems: 0,
          branchId: undefined,
          discount: undefined,
          customerId: undefined,
          products: [],
        };
      }
    );
    builder.addCase(getProducts.rejected, (state, action) => {
      state.fetchProductsState = State.FAILED;
    });

    builder.addCase(placeCustomerOrder.pending, (state, action) => {
      state.placeCustomerOrderState = State.LOADING;
    });
    builder.addCase(placeCustomerOrder.fulfilled, (state, action) => {
      state.placeCustomerOrderState = State.SUCCESS;
    });
    builder.addCase(placeCustomerOrder.rejected, (state, action) => {
      state.placeCustomerOrderState = State.FAILED;
    });
  },
});

export const getProducts = createAsyncThunk<ProductResponse[]>(
  "cashier/products",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const resp = await APIService.getInstance().get(
        AppConfig.serviceUrls.getProducts
      );
      return resp.data;
    } catch (err) {
      const error = err as Error;
      console.log(`Failed to fetch products: ${error.message}`);
      rejectWithValue(`Failed to fetch products: ${error.message}`);
    }
  }
);

export const placeCustomerOrder = createAsyncThunk(
  "cashier/order",
  async (order: AddOrderPayload, { dispatch, rejectWithValue }) => {
    try {
      APIService.getInstance().post(AppConfig.serviceUrls.makeOrder, order);
      dispatch(getProducts());
    } catch (err) {
      const error = err as Error;
      console.log(`Failed to make an order: ${error.message}`);
      rejectWithValue(`Failed to make an order: ${error.message}`);
    }
  }
);

export const { addToCart, setProducts, removeFromCart } = CashierSlice.actions;
export default CashierSlice.reducer;
