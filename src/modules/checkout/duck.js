// @flow
import {createReducer, eCatchError, g} from '../../store/utils';
import {ofType} from 'redux-observable';
import {map, switchMap} from 'rxjs/operators';
import {orderCheckoutApi} from './api';

import type {Action} from '../../store/utils';
import type {ActionsObservable} from 'redux-observable';
import type {Address, Order} from '../../entities';

export type CheckoutAction = Action & {|
  order?: Order,
  error?: string,
  shippingAddress?: Address,
  billingAddress?: Address,
|};

export type CheckoutState = {|
  isCreating?: boolean,
  order?: Order,
  checkoutError?: string,
  createOrderError?: string,
  isCheckingOut?: boolean,
|};

export const createOrder = g('checkout/create-order');
export const createOrderSuccess = g('checkout/create-order-success');
export const createOrderErrorFn = g('checkout/create-order-error');
export const checkoutResetState = g('checkout/reset-state');
export const checkoutFinishLoading = g('checkout/finish-loading');
export const checkoutErrorFn = g('checkout/checkout-error');

export const actions = {
  createOrder,
  checkoutResetState,
  checkoutFinishLoading,
  checkoutErrorFn,
  createOrderErrorFn,
};

export const initialState = {};

export default createReducer<CheckoutState, CheckoutAction>(initialState, {
  [createOrder]: _ => ({isCreating: true, isCheckingOut: true}),
  [createOrderSuccess]: (s, {order}) => ({...s, order}),
  [createOrderErrorFn]: (s, {error}) => ({...s, createOrderError: error}),
  [checkoutFinishLoading]: s => ({...s, isCheckingOut: false}),
  [checkoutErrorFn]: (s, {error}) => ({...s, checkoutError: error}),
  [checkoutResetState]: _ => initialState,
});

export function createOrderEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(createOrder.type),
    switchMap(({shippingAddress, billingAddress}: CheckoutAction) =>
      orderCheckoutApi({shippingAddress, billingAddress}).pipe(
        map((order: Order) => createOrderSuccess({order})),
        eCatchError(createOrderErrorFn)
      )
    )
  );
}
