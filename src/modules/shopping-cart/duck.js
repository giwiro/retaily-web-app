// @flow
import {ofType} from 'redux-observable';
import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {ActionCreator, createReducer} from '../../store/utils';
import {GetSessionSuccess, LoginSuccess} from '../auth/duck';
import {
  addShoppingCartItemApi,
  deleteShoppingCartItemApi,
  endpoints,
  getShoppingCartApi,
} from './api';

import type {AjaxError} from 'rxjs/ajax';
import type {ActionsObservable} from 'redux-observable';
import type {Action} from '../../store/utils';
import type {ShoppingCart} from '../../entities';

export type ShoppingCartAction = Action & {
  shoppingCart?: ShoppingCart,
  error?: string,
  productId?: number,
  amount?: number,
};

export type ShoppingCartState = {
  isFetching?: boolean,
  shoppingCart?: ShoppingCart,
  fetchShoppingCartError?: string,
  isDeletingItem?: boolean,
  deleteItemError?: string,
  isAddingItem?: boolean,
  addItemError?: string,
};

export class FetchShoppingCart extends ActionCreator<ShoppingCartAction> {}
export class FetchShoppingCartSuccess extends ActionCreator<ShoppingCartAction> {}
export class FetchShoppingCartErrorFn extends ActionCreator<ShoppingCartAction> {}
export class AddShoppingCartItem extends ActionCreator<ShoppingCartAction> {}
export class AddShoppingCartItemSuccess extends ActionCreator<ShoppingCartAction> {}
export class AddShoppingCartItemErrorFn extends ActionCreator<ShoppingCartAction> {}
export class DeleteShoppingCartItem extends ActionCreator<ShoppingCartAction> {}
export class DeleteShoppingCartItemSuccess extends ActionCreator<ShoppingCartAction> {}
export class DeleteShoppingCartItemErrorFn extends ActionCreator<ShoppingCartAction> {}

export const actions = {
  deleteShoppingCartItem: (payload: ShoppingCartAction) =>
    new DeleteShoppingCartItem(payload),
};

export const initialState = {};

export default createReducer(initialState, {
  [FetchShoppingCart.type]: () => ({isFetching: true}),
  [FetchShoppingCartSuccess.type]: (_, action: ShoppingCartAction) => ({
    shoppingCart: action.shoppingCart,
  }),
  [FetchShoppingCartErrorFn.type]: (_, action: ShoppingCartAction) => ({
    fetchShoppingCartError: action.error,
  }),
  [AddShoppingCartItem.type]: (state: ShoppingCartState) => ({
    ...state,
    isAddingItem: true,
    addItemError: undefined,
  }),
  [AddShoppingCartItemSuccess.type]: (
    state: ShoppingCartState,
    action: ShoppingCartAction
  ) => ({
    ...state,
    isAddingItem: false,
    addItemError: undefined,
    shoppingCart: action.shoppingCart,
  }),
  [AddShoppingCartItemErrorFn.type]: (
    state: ShoppingCartState,
    action: ShoppingCartAction
  ) => ({
    ...state,
    isAddingItem: false,
    addItemError: action.error,
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

export function fetchShoppingCartEpic(action$: ActionsObservable) {
  return action$.pipe(
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
}

export function addShoppingCartItemEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(AddShoppingCartItem.type),
    switchMap((action: ShoppingCartAction) =>
      addShoppingCartItemApi(
        {
          amount: action.amount,
        },
        {
          route: endpoints.ADD_SHOPPING_CART_ITEM_CART.replace(
            ':productId',
            action.productId
          ),
        }
      ).pipe(
        map(
          (shoppingCart: ShoppingCart) =>
            new AddShoppingCartItemSuccess({shoppingCart})
        ),
        catchError((error: AjaxError) =>
          of(
            new AddShoppingCartItemErrorFn({
              error: error.response ? error.response.message : '',
            })
          )
        )
      )
    )
  );
}

export function deleteShoppingCartItemEpic(action$: ActionsObservable) {
  return action$.pipe(
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
}
