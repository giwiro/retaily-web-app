// @flow
import {ofType} from 'redux-observable';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {createReducer, eCatchError, g} from '../../store/utils';
import {getSessionApi, loginApi, logoutApi, registerApi} from './api';

import type {User} from '../../entities';
import type {Action} from '../../store/utils';
import type {ActionsObservable} from 'redux-observable';
import type {AjaxError} from 'rxjs/ajax';

export type AuthAction = Action & {
  email?: string,
  password?: string,
  user?: User,
  error?: string,
};

export type AuthState = {
  user?: User,
  isAuthenticating?: boolean,
  loginError?: string,
  registerError?: string,
  initialAuthDone?: boolean,
};

export const getSession = g<AuthAction>('auth/get-session');
export const getSessionSuccess = g<AuthAction>('auth/get-session-success');
export const getSessionErrorFn = g<AuthAction>('auth/get-session-error');
export const login = g<AuthAction>('auth/login');
export const loginSuccess = g<AuthAction>('auth/login-success');
export const loginErrorFn = g<AuthAction>('auth/login-error');
export const register = g<AuthAction>('auth/register');
export const registerSuccess = g<AuthAction>('auth/register-success');
export const registerErrorFn = g<AuthAction>('auth/register-error');
export const logout = g<AuthAction>('auth/logout');
export const authResetState = g<AuthAction>('auth/reset-state');
export const noop = g<AuthAction>('auth/noop');

export const actions = {
  getSession,
  login,
  register,
  logout,
  authResetState,
};

export const initialState = {};

export default createReducer<AuthState, AuthAction>(initialState, {
  [getSession]: () => ({isAuthenticating: true}),
  [getSessionSuccess]: (_, {user}) => ({user, initialAuthDone: true}),
  [getSessionErrorFn]: () => ({initialAuthDone: true}),
  [login]: s => ({...s, isAuthenticating: true}),
  [loginSuccess]: (s, {user}) => ({...s, user, isAuthenticating: false}),
  [loginErrorFn]: (s, {error}) => ({
    ...s,
    loginError: error,
    isAuthenticating: false,
  }),
  [register]: s => ({...s, isAuthenticating: true}),
  [registerSuccess]: (s, {user}) => ({...s, user, isAuthenticating: false}),
  [registerErrorFn]: (s, {error}) => ({
    ...s,
    registerError: error,
    isAuthenticating: false,
  }),
  [logout]: () => ({...initialState, initialAuthDone: true}),
  [authResetState]: () => initialState,
  [noop]: s => s,
});

export function getSessionEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(getSession.type),
    switchMap(() =>
      getSessionApi().pipe(
        map((user: User) => getSessionSuccess({user})),
        eCatchError(getSessionErrorFn)
      )
    )
  );
}

export function loginEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(login.type),
    switchMap((action: AuthAction) =>
      loginApi({
        email: action.email,
        password: action.password,
      }).pipe(
        map((user: User) => loginSuccess({user})),
        catchError((error: AjaxError) => {
          if (error.status === 401)
            return of(loginErrorFn({error: 'Wrong credentials'}));
          return of(loginErrorFn({error: 'Internal error'}));
        })
      )
    )
  );
}

export function registerEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(register.type),
    switchMap((action: AuthAction) =>
      registerApi({
        firstName: action.firstName,
        lastName: action.lastName,
        email: action.email,
        password: action.password,
      }).pipe(
        map((user: User) => registerSuccess({user})),
        eCatchError(registerErrorFn)
      )
    )
  );
}

export function logoutEpic(action$: ActionsObservable) {
  return action$.pipe(
    ofType(logout.type),
    switchMap(() =>
      logoutApi().pipe(
        map(() => noop()),
        eCatchError(noop)
      )
    )
  );
}
