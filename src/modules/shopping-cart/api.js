import { getCreator } from '../../http';

export const endpoints = Object.freeze({
  GET_SHOPPING_CART: `${process.env.REACT_APP_ENDPOINT}/supermarket/shopping-cart/`,
});

export const getShoppingCartApi = getCreator(endpoints.GET_SHOPPING_CART);