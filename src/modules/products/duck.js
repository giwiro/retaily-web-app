// @flow
import {ofType} from 'redux-observable';
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {eCatchError, createReducer, g} from '../../store/utils';
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

export const fetchProducts = g<ProductsAction>('products/fetch');
export const fetchProductsSuccess = g<ProductsAction>('products/success');
export const fetchProductsErrorFn = g<ProductsAction>('products/error');

export const actions = {
  fetchProducts,
};

export const initialState = {
  isFetching: true,
};

export default createReducer(initialState, {
  [fetchProducts]: ({products}, {resetPagination}) => ({
    products: resetPagination ? undefined : products,
    isFetching: true,
    fetchProductsError: undefined,
  }),
  [fetchProductsSuccess]: (
    {products: productsState},
    {resetPagination, products}
  ) => ({
    products: resetPagination
      ? [...products]
      : [...(productsState || []), ...products],
    isFetching: false,
    fetchProductsError: undefined,
  }),
  [fetchProductsErrorFn]: (s, {error}) => ({
    ...s,
    isFetching: false,
    fetchProductsError: error,
  }),
});

export function fetchProductsEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(fetchProducts),
    debounceTime(500),
    switchMap((action: ProductsAction) =>
      getProductsApi(action.filters).pipe(
        map((products: Product[]) =>
          fetchProductsSuccess({
            products,
            resetPagination: action.resetPagination,
          })
        ),
        eCatchError(fetchProductsErrorFn)
      )
    )
  );
}
