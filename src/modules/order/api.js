// @flow
import {getCreator} from '../../http';

export const endpoints = Object.freeze({
  GET_ORDER: `${process.env.REACT_APP_ENDPOINT}/supermarket/order/:orderId`,
});

export const getOrderApi = getCreator(endpoints.GET_ORDER);
