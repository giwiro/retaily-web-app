// @flow
import {getCreator} from '../../http';

export const endpoints = Object.freeze({
  GET_PRODUCTS: `${process.env.REACT_APP_ENDPOINT}/supermarket/product/list`,
});

export const getProductsApi = getCreator(endpoints.GET_PRODUCTS);
