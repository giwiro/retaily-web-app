import {ActionCreator, buildCatchError, createReducer} from '../../store/utils';
import {ofType} from 'redux-observable';
import {map, switchMap} from 'rxjs/operators';
import {getCategories} from './api';

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

export class FetchCategories extends ActionCreator<LocalValuesAction> {}
export class FetchCategoriesSuccess extends ActionCreator<LocalValuesAction> {}
export class FetchCategoriesErrorFn extends ActionCreator<LocalValuesAction> {}

export const actions = {
  fetchCategories: (payload: LocalValuesAction) => new FetchCategories(payload),
};

export const initialState = {};

export default createReducer(initialState, {
  [FetchCategories.type]: () => ({isFetchingCategories: true}),
  [FetchCategoriesSuccess.type]: (_, action: LocalValuesAction) => ({
    categories: action.categories,
  }),
  [FetchCategoriesErrorFn.type]: (_, action: LocalValuesAction) => ({
    fetchCategoriesError: action.error,
  }),
});

export function fetchCategoriesEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(FetchCategories.type),
    switchMap(() =>
      getCategories().pipe(
        map(
          (categories: ProductCategory[]) =>
            new FetchCategoriesSuccess({categories})
        ),
        buildCatchError(FetchCategoriesErrorFn)
      )
    )
  );
}
