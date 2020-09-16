// @flow
import type {Product} from './product';

export type ShoppingCartItem = {|
  id: number,
  shoppingCartItemStatus: string,
  product: Product,
  amount: number,
|};

export type ShoppingCart = {|
  items: ShoppingCartItem[],
|};
