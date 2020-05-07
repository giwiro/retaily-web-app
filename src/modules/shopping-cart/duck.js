// @flow
import {ofType} from 'redux-observable';
import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {
  ActionCreator,
  createReducer,
  generateActionCreators,
} from '../../store/utils';
import {GetSessionSuccess, LoginSuccess} from '../auth/duck';
import {deleteShoppingCartItemApi, endpoints, getShoppingCartApi} from './api';

import type {AjaxError} from 'rxjs/ajax';
import type {ActionsObservable} from 'redux-observable';
import type {Action} from '../../store/utils';
import type {ShoppingCart} from '../../entities';

export type ShoppingCartAction = Action & {
  shoppingCart?: ShoppingCart,
  error?: string,
  productId?: number,
};

export type ShoppingCartState = {
  isFetching?: boolean,
  shoppingCart?: ShoppingCart,
  fetchShoppingCartError?: string,
  isDeletingItem?: boolean,
  deleteItemError?: string,
};

export class FetchShoppingCart extends ActionCreator<ShoppingCartAction> {}
export class FetchShoppingCartSuccess extends ActionCreator<ShoppingCartAction> {}
export class FetchShoppingCartErrorFn extends ActionCreator<ShoppingCartAction> {}
export class DeleteShoppingCartItem extends ActionCreator<ShoppingCartAction> {}
export class DeleteShoppingCartItemSuccess extends ActionCreator<ShoppingCartAction> {}
export class DeleteShoppingCartItemErrorFn extends ActionCreator<ShoppingCartAction> {}

export const actions = generateActionCreators([
  FetchShoppingCart,
  FetchShoppingCartSuccess,
  FetchShoppingCartErrorFn,
  DeleteShoppingCartItem,
  DeleteShoppingCartItemSuccess,
  DeleteShoppingCartItemErrorFn,
]);

export const initialState = {};

export default createReducer(initialState, {
  [FetchShoppingCart.type]: () => ({isFetching: true}),
  [FetchShoppingCartSuccess.type]: (_, action: ShoppingCartAction) => ({
    shoppingCart: action.shoppingCart,
  }),
  [FetchShoppingCartErrorFn.type]: (_, action: ShoppingCartAction) => ({
    fetchShoppingCartError: action.error,
  }),
  [DeleteShoppingCartItem.type]: (state: ShoppingCartState) => ({
    ...state,
    isDeletingItem: true,
    deleteItemError: undefined,
  }),
  [DeleteShoppingCartItemSuccess.type]: (
    state: ShoppingCartState,
    action: ShoppingCartAction
  ) => ({
    ...state,
    shoppingCart: action.shoppingCart,
    isDeletingItem: false,
    deleteItemError: undefined,
  }),
  [DeleteShoppingCartItemErrorFn.type]: (
    state: ShoppingCartState,
    action: ShoppingCartAction
  ) => ({
    ...state,
    isDeletingItem: false,
    deleteItemError: action.error,
  }),
});

export const fetchShoppingCartEpic = (action$: ActionsObservable) =>
  action$.pipe(
    ofType(FetchShoppingCart.type, LoginSuccess.type, GetSessionSuccess.type),
    switchMap((action: ShoppingCartAction) =>
      getShoppingCartApi().pipe(
        map(
          (shoppingCart: ShoppingCart) =>
            new FetchShoppingCartSuccess({shoppingCart})
        ),
        catchError((error: AjaxError) =>
          of(
            new FetchShoppingCartErrorFn({
              error: error.response ? error.response.message : '',
            })
          )
        )
      )
    )
  );

export const deleteShoppingCartItemEpic = (action$: ActionsObservable) =>
  action$.pipe(
    ofType(DeleteShoppingCartItem.type),
    switchMap((action: ShoppingCartAction) =>
      deleteShoppingCartItemApi(undefined, {
        route: endpoints.DELETE_SHOPPING_CART_ITEM_CART.replace(
          ':productId',
          action.productId
        ),
      }).pipe(
        map(
          (shoppingCart: ShoppingCart) =>
            new DeleteShoppingCartItemSuccess({shoppingCart})
        ),
        catchError((error: AjaxError) =>
          of(
            new DeleteShoppingCartItemErrorFn({
              error: error.response ? error.response.message : '',
            })
          )
        )
      )
    )
  );
