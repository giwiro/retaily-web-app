import {getCreator} from '../../http';

export const endpoints = Object.freeze({
  GET_CATEGORIES: `${process.env.REACT_APP_ENDPOINT}/supermarket/meta/product-category/list`,
});

export const getCategories = getCreator(endpoints.GET_CATEGORIES);
