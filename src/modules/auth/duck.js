// @flow
import {ofType} from 'redux-observable';
import {map, switchMap} from 'rxjs/operators';
import {createReducer, eCatchError, g} from '../../store/utils';
import {getSessionApi, loginApi, logoutApi, registerApi} from './api';

import type {User} from '../../entities';
import type {Action} from '../../store/utils';
import type {ActionsObservable} from 'redux-observable';

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
  [getSessionSuccess]: (_, action: AuthAction) => ({
    user: action.user,
    initialAuthDone: true,
  }),
  [getSessionErrorFn]: () => ({initialAuthDone: true}),
  [login]: (state: AuthState) => ({...state, isAuthenticating: true}),
  [loginSuccess]: (state: AuthState, action: AuthAction) => ({
    ...state,
    user: action.user,
    isAuthenticating: false,
  }),
  [loginErrorFn]: (state: AuthState, action: AuthAction) => ({
    ...state,
    loginError: action.error,
    isAuthenticating: false,
  }),
  [register]: (state: AuthState) => ({
    ...state,
    isAuthenticating: true,
  }),
  [registerSuccess]: (state: AuthState, action: AuthAction) => ({
    ...state,
    user: action.user,
    isAuthenticating: false,
  }),
  [registerErrorFn]: (state: AuthState, action: AuthAction) => ({
    ...state,
    registerError: action.error,
    isAuthenticating: false,
  }),
  [logout]: () => ({...initialState, initialAuthDone: true}),
  [authResetState]: () => initialState,
  [noop]: (state: AuthState) => state,
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
        eCatchError(loginErrorFn)
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
