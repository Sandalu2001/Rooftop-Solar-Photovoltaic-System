import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "../../utils/apiService";
import { AppConfig } from "../../configs/configs";
import { State } from "../../types/common.type";
import { AddProductPayload, InventoryResponse } from "../../types/product.type";
import { ProductsInCart } from "../../types/order.type";

interface Inventory {
  productsInInventory: InventoryResponse[];
  productsInCart: ProductsInCart[];
  addToCartState: State;
  addNewProductState: State;
  fetchProductsState: State;
  totalItems: number;
}

const initialState: Inventory = {
  productsInInventory: [],
  productsInCart: [],
  addToCartState: State.IDLE,
  fetchProductsState: State.IDLE,
  addNewProductState: State.IDLE,
  totalItems: 0,
};

interface ProductsInCartPayload
  extends Omit<ProductsInCart, "total" | "quantity"> {}

const InventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<ProductsInCartPayload>) {
      const existingProductIndex = state.productsInCart.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.price === action.payload.price
      );

      if (existingProductIndex !== -1) {
        const quantity =
          state.productsInCart[existingProductIndex].quantity + 1;
        state.productsInCart[existingProductIndex] = {
          ...action.payload,
          quantity,
          total:
            state.productsInCart[existingProductIndex].total +
            action.payload.price,
        };
      } else {
        state.productsInCart = [
          ...state.productsInCart,
          { ...action.payload, quantity: 1, total: action.payload.price },
        ];
      }

      // -----------Update total-------------//
      var total = 0;

      state.productsInCart.map((product) => {
        total = total + product.total;
      });
      state.totalItems = total;
      //-------------------------------------//
    },
    removeFromCart(state, action: PayloadAction<number>) {
      const existingProductIndex = state.productsInCart.findIndex(
        (item) => item.productId === action.payload
      );

      if (existingProductIndex !== -1) {
        state.productsInCart = [
          ...state.productsInCart.splice(existingProductIndex, 1),
        ];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state, action) => {
      state.fetchProductsState = State.LOADING;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.fetchProductsState = State.SUCCESS;
      state.productsInInventory = action.payload;
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      state.fetchProductsState = State.FAILED;
    });
    builder.addCase(addNewProduct.pending, (state, action) => {
      state.addNewProductState = State.LOADING;
    });
    builder.addCase(addNewProduct.fulfilled, (state, action) => {
      state.addNewProductState = State.SUCCESS;
    });
    builder.addCase(addNewProduct.rejected, (state, action) => {
      state.addNewProductState = State.FAILED;
    });
  },
});

export const getProducts = createAsyncThunk(
  "getProducts",
  async (_, { dispatch }) => {
    try {
      const resp = await APIService.getInstance().get(
        AppConfig.serviceUrls.getInventoryProducts
      );
      return resp.data;
    } catch (error) {
      return error;
    }
  }
);

export const addNewProduct = createAsyncThunk(
  "addNewProduct",
  async (product: AddProductPayload, thunkAPI) => {
    try {
      const resp = await APIService.getInstance().post(
        AppConfig.serviceUrls.addProduct,
        product
      );
      return resp.data;
    } catch (error) {
      return error;
    }
  }
);

export const { addToCart, removeFromCart } = InventorySlice.actions;
export default InventorySlice.reducer;
