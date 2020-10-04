// @flow
import {ofType} from 'redux-observable';
import {map, switchMap} from 'rxjs/operators';
import {createReducer, eCatchError, g} from '../../store/utils';
import {getSessionSuccess, loginSuccess, registerSuccess} from '../auth/duck';
import {createOrderSuccess} from '../checkout/duck';
import {
  addShoppingCartItemApi,
  calculateApi,
  deleteShoppingCartItemApi,
  endpoints,
  updateShoppingCartItemApi,
  getShoppingCartApi,
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

export const fetchShoppingCart = g('shopping-cart/fetch-cart');
export const fetchShoppingCartSuccess = g('shopping-cart/fetch-cart-success');
export const fetchShoppingCartErrorFn = g('shopping-cart/fetch-cart-error');

export const addShoppingCartItem = g('shopping-cart/add-cart-item');
export const addShoppingCartItemSuccess = g(
  'shopping-cart/add-cart-item-success'
);
export const addShoppingCartItemErrorFn = g(
  'shopping-cart/add-cart-item-error'
);

export const deleteShoppingCartItem = g('shopping-cart/delete-cart-item');
export const deleteShoppingCartItemSuccess = g(
  'shopping-cart/delete-cart-item-success'
);
export const deleteShoppingCartItemErrorFn = g(
  'shopping-cart/delete-cart-item-error'
);

export const updateCartItem = g('shopping-cart/update-item');
export const updateCartItemSuccess = g('shopping-cart/update-item-success');
export const updateCartItemErrorFn = g('shopping-cart/update-item-error');

export const calculate = g('shopping-cart/calculate');
export const calculateSuccess = g('shopping-cart/calculate-success');
export const calculateErrorFn = g('shopping-cart/calculate-error');

export const actions = {
  fetchShoppingCart,
  deleteShoppingCartItem,
  addShoppingCartItem,
  calculate,
  updateCartItem,
};

export const initialState = {
  isFetching: true,
};

export default createReducer(initialState, {
  [fetchShoppingCart]: s => ({...s, isFetching: true}),
  [fetchShoppingCartSuccess]: (s, {shoppingCart}) => ({
    ...s,
    shoppingCart,
    isFetching: false,
  }),
  [fetchShoppingCartErrorFn]: (s, {error}) => ({
    ...s,
    fetchShoppingCartError: error,
    isFetching: false,
  }),
  [addShoppingCartItem]: s => ({
    ...s,
    isAddingItem: true,
    addItemError: undefined,
  }),
  [addShoppingCartItemSuccess]: (s, {shoppingCart}) => ({
    ...s,
    isAddingItem: false,
    addItemError: undefined,
    shoppingCart,
  }),
  [addShoppingCartItemErrorFn]: (s, {error}) => ({
    ...s,
    isAddingItem: false,
    addItemError: error,
  }),
  [deleteShoppingCartItem]: s => ({
    ...s,
    isDeletingItem: true,
    deleteItemError: undefined,
  }),
  [deleteShoppingCartItemSuccess]: (s, {shoppingCart}) => ({
    ...s,
    shoppingCart,
    isDeletingItem: false,
    deleteItemError: undefined,
  }),
  [deleteShoppingCartItemErrorFn]: (s, {error}) => ({
    ...s,
    isDeletingItem: false,
    deleteItemError: error,
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
    ofType(
      fetchShoppingCart,
      getSessionSuccess,
      loginSuccess,
      registerSuccess
      // createOrderSuccess
    ),
    switchMap(_ =>
      getShoppingCartApi().pipe(
        map((shoppingCart: ShoppingCart) =>
          fetchShoppingCartSuccess({shoppingCart})
        ),
        eCatchError(fetchShoppingCartErrorFn)
      )
    )
  );
}

export function addShoppingCartItemEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(addShoppingCartItem),
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
        map((shoppingCart: ShoppingCart) =>
          addShoppingCartItemSuccess({shoppingCart})
        ),
        eCatchError(addShoppingCartItemErrorFn)
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
    ofType(deleteShoppingCartItem),
    switchMap((action: ShoppingCartAction) =>
      deleteShoppingCartItemApi(undefined, {
        route: endpoints.DELETE_SHOPPING_CART_ITEM_CART.replace(
          ':productId',
          action.productId
        ),
      }).pipe(
        map((shoppingCart: ShoppingCart) =>
          deleteShoppingCartItemSuccess({shoppingCart})
        ),
        eCatchError(deleteShoppingCartItemErrorFn)
      )
    )
  );
}

export function calculateEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(
      fetchShoppingCartSuccess,
      addShoppingCartItemSuccess,
      deleteShoppingCartItemSuccess,
      updateCartItemSuccess
    ),
    switchMap(_ =>
      calculateApi().pipe(
        map((pricing: Pricing) => calculateSuccess({pricing})),
        eCatchError(calculateErrorFn)
      )
    )
  );
}
