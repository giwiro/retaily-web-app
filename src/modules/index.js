// @flow
import {combineReducers} from 'redux';
import {combineEpics} from 'redux-observable';

import type {Action} from '../store/utils';
import type {AuthState} from './auth/duck';
import type {ShoppingCartState} from './shopping-cart/duck';

import authReducer, {
  initialState as AuthInitialState,
  Logout,
  getSessionEpic,
  loginEpic,
  registerEpic,
  logoutEpic,
} from './auth/duck';

import shoppingCartReducer, {
  initialState as ShoppingCartInitialState,
  fetchShoppingCartEpic,
} from './shopping-cart/duck';

export type RootState = {
  auth: AuthState,
  shoppingCart: ShoppingCartState,
};

export const defaultInitialState = {
  auth: AuthInitialState,
  shoppingCart: ShoppingCartInitialState,
};

export const appReducer = combineReducers({
  auth: authReducer,
  shoppingCart: shoppingCartReducer,
});

export const rootEpic = combineEpics(
  // auth
  getSessionEpic,
  loginEpic,
  registerEpic,
  logoutEpic,
  // shopping-cart
  fetchShoppingCartEpic,
);

export const rootReducer = (state: RootState, action: Action) => {
  // Clear higher order state when logout
  if (action.type === Logout.type) {
    // But keep localValue (these are agnostic)
    state = { ...defaultInitialState };
  }
  return appReducer(state, action);
};
