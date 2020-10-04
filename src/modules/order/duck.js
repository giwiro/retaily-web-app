// @flow
import {ofType} from 'redux-observable';
import {map, switchMap} from 'rxjs/operators';
import {createReducer, eCatchError, g} from '../../store/utils';
import {getOrderApi, endpoints} from './api';

import type {Action} from '../../store/utils';
import type {Order} from '../../entities';
import type {ActionsObservable} from 'redux-observable';

export type OrderAction = Action & {
  orderId?: number,
  error?: string,
};

export type OrderState = {
  order?: Order,
  isFetching?: boolean,
  fetchOrderError?: string,
};

export const fetchOrder = g('order/fetch');
export const fetchOrderSuccess = g('order/fetch-success');
export const fetchOrderErrorFn = g('order/fetch-error');
export const resetState = g('order/reset-state');

export const actions = {
  fetchOrder,
  resetState,
};

export const initialState = {};

export default createReducer<OrderState, OrderAction>(initialState, {
  [fetchOrder]: _ => ({isFetching: true}),
  [fetchOrderSuccess]: (_, {order}) => ({order}),
  [fetchOrderErrorFn]: (_, {error}) => ({fetchOrderError: error}),
  [resetState]: _ => initialState,
});

export function fetchOrderEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(fetchOrder),
    switchMap(({orderId}) =>
      getOrderApi(undefined, {
        route: endpoints.GET_ORDER.replace(':orderId', orderId),
      }).pipe(
        map((order: Order) => fetchOrderSuccess({order})),
        eCatchError(fetchOrderErrorFn)
      )
    )
  );
}
