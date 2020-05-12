// @flow
import {getCreator, deleteCreator, postCreator} from '../../http';

export const endpoints = Object.freeze({
  GET_SHOPPING_CART: `${process.env.REACT_APP_ENDPOINT}/supermarket/shopping-cart/`,
  ADD_SHOPPING_CART_ITEM_CART: `${process.env.REACT_APP_ENDPOINT}/supermarket/shopping-cart/:productId`,
  DELETE_SHOPPING_CART_ITEM_CART: `${process.env.REACT_APP_ENDPOINT}/supermarket/shopping-cart/:productId`,
});

export const getShoppingCartApi = getCreator(endpoints.GET_SHOPPING_CART);

export const addShoppingCartItemApi = postCreator(
  endpoints.DELETE_SHOPPING_CART_ITEM_CART
);
export const deleteShoppingCartItemApi = deleteCreator(
  endpoints.DELETE_SHOPPING_CART_ITEM_CART
);
