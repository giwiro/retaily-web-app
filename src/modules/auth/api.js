import { getCreator, postCreator } from '../../http';

export const endpoints = Object.freeze({
  GET_SESSION: `${process.env.REACT_APP_ENDPOINT}/bouncer/auth/session`,
  LOGIN: `${process.env.REACT_APP_ENDPOINT}/bouncer/auth/login`,
  LOGOUT: `${process.env.REACT_APP_ENDPOINT}/bouncer/auth/logout`,
});

export const getSessionApi = getCreator(endpoints.GET_SESSION);
export const loginApi = postCreator(endpoints.LOGIN);
export const logoutApi = postCreator(endpoints.LOGOUT);