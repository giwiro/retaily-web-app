// @flow
import {postCreator} from '../../http';

export const endpoints = Object.freeze({
  ORDER_CHECKOUT: `${process.env.REACT_APP_ENDPOINT}/supermarket/order/`,
});

export const orderCheckoutApi = postCreator(endpoints.ORDER_CHECKOUT);
