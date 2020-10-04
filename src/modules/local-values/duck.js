// @flow
import {ofType} from 'redux-observable';
import {map, switchMap} from 'rxjs/operators';
import {createReducer, eCatchError, g} from '../../store/utils';
import {getCategoriesApi} from './api';

import type {Action} from '../../store/utils';
import type {ProductCategory} from '../../entities';
import type {ActionsObservable} from 'redux-observable';

export type LocalValuesAction = Action & {
  categories: ProductCategory[],
  error?: string,
};

export type LocalValuesState = {
  isFetchingCategories?: boolean,
  categories: ProductCategory[],
  fetchCategoriesError?: string,
};

export const fetchCategories = g('local-values/fetch-categories');
export const fetchCategoriesSuccess = g(
  'local-values/fetch-categories-success'
);
export const fetchCategoriesErrorFn = g('local-values/fetch-categories-error');

export const actions = {
  fetchCategories,
};

export const initialState = {};

export default createReducer(initialState, {
  [fetchCategories]: () => ({isFetchingCategories: true}),
  [fetchCategoriesSuccess]: (_, {categories}) => ({categories}),
  [fetchCategoriesErrorFn]: (_, {error}) => ({fetchCategoriesError: error}),
});

export function fetchCategoriesEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(fetchCategories),
    switchMap(() =>
      getCategoriesApi().pipe(
        map((categories: ProductCategory[]) =>
          fetchCategoriesSuccess({categories})
        ),
        eCatchError(fetchCategoriesErrorFn)
      )
    )
  );
}
