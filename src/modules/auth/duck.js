// @flow
import {ofType} from 'redux-observable';
import {AjaxError, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {ActionCreator, createReducer, generateActionCreators} from '../../store/utils';
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
};

export class GetSession extends ActionCreator<AuthAction> {}
export class GetSessionSuccess extends ActionCreator<AuthAction> {}
export class Login extends ActionCreator<AuthAction> {}
export class LoginSuccess extends ActionCreator<AuthAction> {}
export class LoginErrorFn extends ActionCreator<AuthAction> {}
export class Register extends ActionCreator<AuthAction> {}
export class RegisterSuccess extends ActionCreator<AuthAction> {}
export class RegisterErrorFn extends ActionCreator<AuthAction> {}
export class Logout extends ActionCreator<AuthAction> {}
export class AuthResetState extends ActionCreator<AuthAction> {}
export class AuthNoop extends ActionCreator<AuthAction> {}

export const actions = generateActionCreators([
  GetSession,
  GetSessionSuccess,
  Login,
  LoginSuccess,
  LoginErrorFn,
  Register,
  RegisterSuccess,
  RegisterErrorFn,
  Logout,
  AuthResetState,
  AuthNoop,
]);

export const initialState = {};

export default createReducer(initialState, {
  [GetSession.type]: () => ({isAuthenticating: true}),
  [GetSessionSuccess.type]: (_, action: AuthAction) => ({user: action.user}),
  [Login.type]: () => ({isAuthenticating: true}),
  [LoginSuccess.type]: (_, action: AuthAction) => ({user: action.user}),
  [LoginErrorFn.type]: (_, action: AuthAction) => ({loginError: action.error}),
  [Register.type]: () => ({isAuthenticating: true}),
  [RegisterSuccess.type]: (_, action: AuthAction) => ({user: action.user}),
  [RegisterErrorFn.type]: (_, action: AuthAction) => ({registerError: action.error}),
  [Logout.type]: () => initialState,
  [AuthResetState.type]: () => initialState,
  [AuthNoop.type]: (state: AuthState) => state,
});

export const getSessionEpic = (action$: ActionsObservable) =>
  action$.pipe(
    ofType(GetSession.type),
    switchMap(() =>
      getSessionApi().pipe(
        map((user: User) => new LoginSuccess({user})),
        catchError(() => of(new AuthResetState())),
      ),
    ),
  );

export const loginEpic = (action$: ActionsObservable) =>
  action$.pipe(
    ofType(Login.type),
    switchMap((action: AuthAction) =>
      loginApi({
        email: action.email,
        password: action.password,
      }).pipe(
        map((user: User) => new LoginSuccess({user})),
        catchError((error: AjaxError) =>
          of(new LoginErrorFn({error: error.response.message})),
        ),
      ),
    ),
  );

export const registerEpic = (action$: ActionsObservable) =>
  action$.pipe(
    ofType(Register.type),
    switchMap((action: AuthAction) =>
      registerApi({
        firstName: action.firstName,
        lastName: action.lastName,
        email: action.email,
        password: action.password,
      }).pipe(
        map((user: User) => new RegisterSuccess({user})),
        catchError((error: AjaxError) =>
          of(new RegisterErrorFn({error: error.response.message})),
        ),
      ),
    ),
  );

export const logoutEpic = (action$: ActionsObservable) =>
  action$.pipe(
    ofType(Logout.type),
    switchMap(() =>
      logoutApi().pipe(
        map(() => new AuthNoop()),
        catchError(() => of(new AuthNoop())),
      ),
    ),
  );