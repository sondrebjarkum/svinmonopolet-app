import { type Stock, type Beers, type Stores } from "@prisma/client";
import { type StateCreator } from "zustand";

export type NonNullableBeers = {
  [K in keyof Beers]: NonNullable<Beers[K]>;
};

export type Product = {
  beverage: Beers;
  stock: Stock;
  store: Stores;
};

export type Products = Product[];

export interface CartSlice {
  cart: Products;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  showCart: boolean;
  toggleCart: () => void;
}

export const createCartSlice: StateCreator<CartSlice> = (set, get) => ({
  cart: [],
  addToCart: (product: Product) => {
    const cart = get().cart;
    const findProduct = cart.find(
      (p) => p.beverage.vmp_id === product.beverage.vmp_id
    );
    if (!findProduct) {
      cart.push({ ...product });
    }
    set({ cart });
  },
  removeFromCart: (productId: string) => {
    set({
      cart: get().cart.filter(
        (product) => product.beverage.vmp_id !== productId
      ),
    });
  },
  showCart: false,
  toggleCart: () => {
    set({ showCart: !get().showCart });
  },
});
