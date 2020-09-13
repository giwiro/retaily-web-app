// @flow
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';

import type {AjaxError} from 'rxjs/ajax';

export type Action = {
  // type?: string,
  [key: string]: *,
};

export type Reducer<S, A> = (state: S, action: A) => S;

export type ReducerMap<S, A> = {
  [key: string]: Reducer<S, A>,
};

export class ActionCreator<T> {
  static name: string;

  static get fnName(): string {
    const name = this.name;
    return name[0].toLowerCase() + name.slice(1);
  }

  static get type(): string {
    return `${this.name}`;
  }

  constructor(payload: T = ({}: any)) {
    return {
      type: this.constructor.type,
      ...payload,
    };
  }
}

export function generateAction<T>(type: string) {
  const actionCreator = (payload: T) => ({type, ...payload});
  actionCreator.type = type;
  actionCreator.toString = () => type;
  return actionCreator;
}

export const g = generateAction;

/*export function generateActions<T>(actions: {[key: string]: string}) {
  const _actions = {...actions};
  Object.keys(_actions).forEach(
    (action: string) => (_actions[action] = generateAction<T>(_actions[action]))
  );
  return _actions;
}*/

/*export function generateActionCreators<T>(
  classes: Class<ActionCreator<T>>[]
): {[key: string]: () => void} {
  const r = {};
  classes.forEach(
    (cls: Class<ActionCreator<T>>) => (r[(cls: any).fnName] = aa => new cls(aa))
  );
  return r;
}*/

export const createReducer = <S, A>(
  initialState: S,
  reducerMap: ReducerMap<S, A>,
  debug: boolean = false
): Reducer<S, A> => (state: S, action: A) => {
  if (debug) {
    console.log('[ACTION]:', action);
  }
  if (action.type && reducerMap.hasOwnProperty(action.type)) {
    return reducerMap[action.type](state, action);
  }
  return state || initialState;
};

export const eCatchError = (action: () => {[key: string]: *}) =>
  catchError((error: AjaxError) => {
    let message = 'Unexpected server error';
    if (
      error &&
      error.response &&
      error.response.errors &&
      error.response.errors.length
    ) {
      message = error.response.errors[0].defaultMessage;
    }
    return of(action({error: message}));
  });

export const buildCatchError = (actionCls: Class<ActionCreator<any>>) =>
  catchError((error: AjaxError) =>
    of(
      new actionCls({
        error:
          error && error.response
            ? error.response.message
            : 'Unexpected server error',
      })
    )
  );
