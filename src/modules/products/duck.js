// @flow
import {ofType} from 'redux-observable';
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {ActionCreator, buildCatchError, createReducer} from '../../store/utils';
import {getProductsApi} from './api';

import type {ActionsObservable} from 'redux-observable';
import type {Action} from '../../store/utils';
import type {Product} from '../../entities';

export type ProductsAction = Action & {
  products?: Product[],
  error?: string,
  filters?: {[key: string]: string | number},
  resetPagination?: boolean,
};

export type ProductsState = Action & {
  isFetching?: boolean,
  products?: Product[],
  fetchProductsError?: string,
};

export class FetchProducts extends ActionCreator<ProductsAction> {}
export class FetchProductsSuccess extends ActionCreator<ProductsAction> {}
export class FetchProductsErrorFn extends ActionCreator<ProductsAction> {}

export const actions = {
  fetchProducts: (payload: ProductsAction) => new FetchProducts(payload),
};

export const initialState = {
  isFetching: true,
};

export default createReducer(initialState, {
  [FetchProducts.type]: (state: ProductsState, action: ProductsAction) => ({
    products: action.resetPagination ? undefined : state.products,
    isFetching: true,
    fetchProductsError: undefined,
  }),
  [FetchProductsSuccess.type]: (
    state: ProductsState,
    action: ProductsAction
  ) => ({
    products: action.resetPagination
      ? [...action.products]
      : [...(state.products || []), ...action.products],
    isFetching: false,
    fetchProductsError: undefined,
  }),
  [FetchProductsErrorFn.type]: (
    state: ProductsState,
    action: ProductsAction
  ) => ({
    ...state,
    isFetching: false,
    fetchProductsError: action.error,
  }),
});

export function fetchProductsEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(FetchProducts.type),
    debounceTime(500),
    switchMap((action: ProductsAction) =>
      getProductsApi(action.filters).pipe(
        map(
          (products: Product[]) =>
            new FetchProductsSuccess({
              products,
              resetPagination: action.resetPagination,
            })
        ),
        buildCatchError(FetchProductsErrorFn)
      )
    )
  );
}
