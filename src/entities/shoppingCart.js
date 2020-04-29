// @flow
import type {Product} from './product';

export type ShoppingCart = {
  items: ShoppingCartItem[],
};

export type ShoppingCartItem = {
  shoppingCartItemId: number,
  shoppingCartItemStatus: string,
  product: Product,
  amount: number,
};
