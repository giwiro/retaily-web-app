// @flow
import {ofType} from 'redux-observable';
import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {
  ActionCreator,
  createReducer,
  generateActionCreators,
} from '../../store/utils';
import {getProductsApi} from './api';

import type {AjaxError} from 'rxjs/ajax';
import type {ActionsObservable} from 'redux-observable';
import type {Action} from '../../store/utils';
import type {Product} from '../../entities';

export type ProductsAction = Action & {
  products?: Product[],
  error?: string,
};

export type ProductsState = Action & {
  isFetching?: boolean,
  products?: Product[],
  fetchProductsError?: string,
};

export class FetchProducts extends ActionCreator<ProductsAction> {}
export class FetchProductsSuccess extends ActionCreator<ProductsAction> {}
export class FetchProductsErrorFn extends ActionCreator<ProductsAction> {}

export const actions = generateActionCreators([
  FetchProducts,
  FetchProductsSuccess,
  FetchProductsErrorFn,
]);

export const initialState = {};

export default createReducer(initialState, {
  [FetchProducts.type]: (state: ProductsState) => ({
    ...state,
    isFetching: true,
    fetchProductsError: undefined,
  }),
  [FetchProductsSuccess.type]: (
    state: ProductsState,
    action: ProductsAction
  ) => ({
    products: [...action.products],
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

export const fetchProductsEpic = (action$: ActionsObservable) =>
  action$.pipe(
    ofType(FetchProducts.type),
    switchMap((action: ProductsAction) =>
      getProductsApi().pipe(
        map((products: Product[]) => new FetchProductsSuccess({products})),
        catchError((error: AjaxError) =>
          of(
            new FetchProductsErrorFn({
              error: error.response ? error.response.message : '',
            })
          )
        )
      )
    )
  );
