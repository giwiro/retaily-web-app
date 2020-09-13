// @flow
import {combineReducers} from 'redux';
import {combineEpics} from 'redux-observable';

import type {Action} from '../store/utils';
import type {AuthState} from './auth/duck';
import type {ShoppingCartState} from './shopping-cart/duck';
import type {LocalValuesState} from './local-values/duck';
import type {ProductsState} from './products/duck';

import authReducer, {
  initialState as AuthInitialState,
  actions as authActions,
  getSessionEpic,
  loginEpic,
  registerEpic,
  logoutEpic,
} from './auth/duck';

import shoppingCartReducer, {
  initialState as ShoppingCartInitialState,
  fetchShoppingCartEpic,
  addShoppingCartItemEpic,
  deleteShoppingCartItemEpic,
  calculateEpic,
} from './shopping-cart/duck';

import localValuesReducer, {
  initialState as LocalValuesInitialState,
  fetchCategoriesEpic,
} from './local-values/duck';

import productsReducer, {
  initialState as ProductsInitialState,
  fetchProductsEpic,
} from './products/duck';

export type RootState = {
  auth: AuthState,
  shoppingCart: ShoppingCartState,
  localValues: LocalValuesState,
  products: ProductsState,
};

export const defaultInitialState = {
  auth: AuthInitialState,
  shoppingCart: ShoppingCartInitialState,
  localValues: LocalValuesInitialState,
  products: ProductsInitialState,
};

export const appReducer = combineReducers({
  auth: authReducer,
  shoppingCart: shoppingCartReducer,
  localValues: localValuesReducer,
  products: productsReducer,
});

export const rootEpic = combineEpics(
  // auth
  getSessionEpic,
  loginEpic,
  registerEpic,
  logoutEpic,
  // shopping-cart
  fetchShoppingCartEpic,
  addShoppingCartItemEpic,
  deleteShoppingCartItemEpic,
  calculateEpic,
  // local-values
  fetchCategoriesEpic,
  // products
  fetchProductsEpic
);

export const rootReducer = (state: RootState, action: Action) => {
  // Clear higher order state when logout
  if (action.type === authActions.logout.type) {
    // But keep localValue (these are agnostic)
    state = {...defaultInitialState};
  }
  return appReducer(state, action);
};
