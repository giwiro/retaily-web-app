// @flow
import {ofType} from 'redux-observable';
import {map, switchMap} from 'rxjs/operators';
import {
  ActionCreator,
  buildCatchError,
  createReducer,
  eCatchError,
  g,
} from '../../store/utils';
import {getSessionSuccess, loginSuccess} from '../auth/duck';
import {
  addShoppingCartItemApi,
  calculateApi,
  deleteShoppingCartItemApi,
  endpoints,
  getShoppingCartApi,
  updateShoppingCartItemApi,
} from './api';

import type {ActionsObservable} from 'redux-observable';
import type {Action} from '../../store/utils';
import type {Pricing, ShoppingCart} from '../../entities';

export type ShoppingCartAction = Action & {|
  shoppingCart?: ShoppingCart,
  error?: string,
  productId?: number,
  amount?: number,
  pricing?: Pricing,
|};

export type ShoppingCartState = {
  isFetching?: boolean,
  shoppingCart?: ShoppingCart,
  fetchShoppingCartError?: string,
  isDeletingItem?: boolean,
  deleteItemError?: string,
  isAddingItem?: boolean,
  addItemError?: string,
  isCalculating?: boolean,
  pricing?: Pricing,
  isUpdatingItem?: boolean,
  updateItemError?: boolean,
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

export const updateCartItem = g('shopping-cart/update-item');
export const updateCartItemSuccess = g('shopping-cart/update-item-success');
export const updateCartItemErrorFn = g('shopping-cart/update-item-error');

export const calculate = g('shopping-cart/calculate');
export const calculateSuccess = g('shopping-cart/calculate-success');
export const calculateErrorFn = g('shopping-cart/calculate-error');

export const actions = {
  deleteShoppingCartItem: (payload: ShoppingCartAction) =>
    new DeleteShoppingCartItem(payload),
  addShoppingCartItem: (payload: ShoppingCartAction) =>
    new AddShoppingCartItem(payload),
  calculate,
  updateCartItem,
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
  [calculate]: s => ({...s, isCalculating: true}),
  [calculateSuccess]: (s, {pricing}) => ({...s, isCalculating: false, pricing}),
  [calculateErrorFn]: s => ({...s, isCalculating: false}),
  [updateCartItem]: s => ({...s, isUpdatingItem: true}),
  [updateCartItemSuccess]: (s, {shoppingCart}) => ({...s, shoppingCart}),
  [updateCartItemErrorFn]: s => ({...s, isUpdatingItem: false}),
});

export function fetchShoppingCartEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(FetchShoppingCart.type, getSessionSuccess.type, loginSuccess.type),
    switchMap((action: ShoppingCartAction) =>
      getShoppingCartApi().pipe(
        map(
          (shoppingCart: ShoppingCart) =>
            new FetchShoppingCartSuccess({shoppingCart})
        ),
        buildCatchError(FetchShoppingCartErrorFn)
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
        buildCatchError(AddShoppingCartItemErrorFn)
      )
    )
  );
}

export function updateShoppingCartItemEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(updateCartItem.type),
    switchMap((action: ShoppingCartAction) =>
      updateShoppingCartItemApi(
        {
          amount: action.amount,
        },
        {
          route: endpoints.UPDATE_SHOPPING_CART_ITEM_CART.replace(
            ':productId',
            action.productId
          ),
        }
      ).pipe(
        map((shoppingCart: ShoppingCart) =>
          updateCartItemSuccess({shoppingCart})
        ),
        eCatchError(updateCartItemErrorFn)
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
        buildCatchError(DeleteShoppingCartItemErrorFn)
      )
    )
  );
}

export function calculateEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(
      FetchShoppingCartSuccess.type,
      AddShoppingCartItemSuccess.type,
      DeleteShoppingCartItemSuccess.type,
      updateCartItemSuccess.type
    ),
    switchMap((action: ShoppingCartAction) =>
      calculateApi().pipe(
        map((pricing: Pricing) => calculateSuccess({pricing})),
        eCatchError(calculateErrorFn)
      )
    )
  );
}
