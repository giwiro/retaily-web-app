// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route} from 'react-router-dom';

import type {User} from '../entities';

type Props = {|
  component: any,
  componentProps?: any,
  user?: User,
  initialAuthDone?: boolean,
  exact: boolean,
|};

export const PrivateRoute = ({component: Component, componentProps, user, initialAuthDone, ...rest}: Props) => (
  <Route
    {...rest}
    render={props => {
      if (!initialAuthDone) return null;
      const content = <Component {...componentProps}/>;
      return user ? content :
        (<Redirect
          to={{
            pathname: '/',
            search: '?login-modal=true',
            state: {from: props.location},
          }}/>);
    }}
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
  componentProps: PropTypes.object,
  user: PropTypes.object,
  initialAuthDone: PropTypes.bool,
};