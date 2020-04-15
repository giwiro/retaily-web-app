// @flow
import {ofType} from 'redux-observable';
import {AjaxError, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {ActionCreator, createReducer, generateActionCreators} from '../../store/utils';
import {GetSessionSuccess, LoginSuccess} from '../auth/duck';
import {getShoppingCartApi} from './api';

import type {ActionsObservable} from 'redux-observable';
import type {Action} from '../../store/utils';
import type {ShoppingCart} from '../../entities';

export type ShoppingCartAction = Action & {
  shoppingCart?: ShoppingCart,
  error?: string,
};

export type ShoppingCartState = {
  isFetching?: boolean,
  shoppingCart?: ShoppingCart,
  fetchShoppingCartError?: string,
};

export class FetchShoppingCart extends ActionCreator<ShoppingCartAction> {}
export class FetchShoppingCartSuccess extends ActionCreator<ShoppingCartAction> {}
export class FetchShoppingCartErrorFn extends ActionCreator<ShoppingCartAction> {}

export const actions = generateActionCreators([
  FetchShoppingCart,
  FetchShoppingCartSuccess,
  FetchShoppingCartErrorFn,
]);

export const initialState = {};

export default createReducer(initialState, {
  [FetchShoppingCart.type]: () => ({isFetching: true}),
  [FetchShoppingCartSuccess.type]: (_, action: ShoppingCartAction) =>
    ({shoppingCart: action.shoppingCart}),
  [FetchShoppingCartErrorFn.type]: (_, action: ShoppingCartAction) =>
    ({fetchShoppingCartError: action.error}),
});

export const fetchShoppingCartEpic = (action$: ActionsObservable) =>
  action$.pipe(
    ofType(FetchShoppingCart.type, LoginSuccess.type, GetSessionSuccess.type),
    switchMap((action: ShoppingCartAction) =>
      getShoppingCartApi().pipe(
        map((shoppingCart: ShoppingCart) => new FetchShoppingCartSuccess({shoppingCart})),
        catchError((error: AjaxError) =>
          of(new FetchShoppingCartErrorFn({error: error.response.message})),
        ),
      ),
    ),
  );