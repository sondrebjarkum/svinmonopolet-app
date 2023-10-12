import create from "zustand";
import { type CartSlice, createCartSlice } from "./slices/createCartSlice";

type StoreState = CartSlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createCartSlice(...a),
}));
