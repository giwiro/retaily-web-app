// @flow
import {createStore, applyMiddleware, compose} from 'redux';
import {defaultInitialState, rootEpic, rootReducer} from '../modules';
import {createEpicMiddleware} from 'redux-observable';

import type {RootState} from '../modules';

const configureStore = (initialState: RootState = defaultInitialState) => {
  const middlewares = [];
  // Redux observable
  const epic = createEpicMiddleware();
  middlewares.push(epic);
  const appliedMiddlewares = applyMiddleware(...middlewares);
  let store;

  if (/*process.env.NODE_ENV === 'development' && window*/ true) {
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const enhancer = composeEnhancers(appliedMiddlewares);
    store = createStore<*, *, *>(rootReducer, initialState, enhancer);
  } else {
    store = createStore<*, *, *>(rootReducer, initialState, appliedMiddlewares);
  }
  epic.run(rootEpic);
  return store;
};

export default configureStore;
