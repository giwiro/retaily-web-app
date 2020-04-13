// @flow
import {ajax} from 'rxjs/ajax';
import queryString from 'query-string';

import type {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export type RequestOptions = {|
  route?: string,
  queryParams?: {[key: string]: string},
  body?: {[key: string]: string | number},
  headers?: {[key: string]: string},
|};

type RequestMethod = 'GET' | 'POST';

function httpCreatorFactory(
  method: RequestMethod,
  route: string,
  o?: RequestOptions,
): Observable<any> {
  let url = route;
  let queryParams = {};
  let headers = {
    'Content-Type': 'application/json',
  };
  let body;

  if (o) {
    body = o.body;

    if (o.route) {
      url = o.route;
    }

    if (o.queryParams) {
      queryParams = {...o.queryParams, ...queryParams};
    }
    if (o.headers) {
      headers = {...o.headers, ...headers};
    }
  }

  if (Object.keys(queryParams).length > 0) {
    url = `${url}?${queryString.stringify(queryParams)}`;
  }

  switch (method) {
    case 'GET':
    case 'POST':
      return ajax({
        url,
        method,
        headers,
        body,
      }).pipe(
        map((ajaxResponse) => ajaxResponse.response),
      );
    default:
      console.error(new Error('HTTP Method not supported'));
  }

}

export const getCreator = (route: string) =>
  (queryParams: {[key: string]: string}, o?: RequestOptions) =>
    httpCreatorFactory('GET', route, {queryParams, ...o});

export const postCreator = (route: string) =>
  (body: {[key: string]: any}, o?: RequestOptions) =>
    httpCreatorFactory('POST', route, {body, ...o});
