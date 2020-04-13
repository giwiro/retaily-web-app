// @flow
  import {ofType} from 'redux-observable';
  import {of} from 'rxjs';
  import {catchError, map, switchMap} from 'rxjs/operators';
  import {ActionCreator, createReducer, generateActionCreators} from '../../store/utils';
  import {getSessionApi, loginApi, logoutApi} from './api';

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
};

export class GetSession extends ActionCreator<AuthAction> {}

export class GetSessionSuccess extends ActionCreator<AuthAction> {}

export class Login extends ActionCreator<AuthAction> {}

export class LoginSuccess extends ActionCreator<AuthAction> {}

export class LoginError extends ActionCreator<AuthAction> {}

export class Logout extends ActionCreator<AuthAction> {}

export class AuthResetState extends ActionCreator<AuthAction> {}

export class AuthNoop extends ActionCreator<AuthAction> {}

export const actions = generateActionCreators([
  GetSession,
  GetSessionSuccess,
  Login,
  LoginSuccess,
  LoginError,
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
  [LoginError.type]: (_, action: AuthAction) => ({error: action.error}),
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
        catchError(error => of(new AuthResetState())),
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
        catchError(error =>
          of(new LoginError({error})),
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
        catchError(error => of(new AuthNoop())),
      ),
    ),
  );