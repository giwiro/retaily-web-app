// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route} from 'react-router-dom';

import type {User} from '../entities';
import {connect} from 'react-redux';
import type {RootState} from '../modules';

type Props = {|
  component: any,
  componentProps?: any,
  user?: User,
  initialAuthDone?: boolean,
  exact: boolean,
|};

const _PrivateRoute = ({
  component: Component,
  componentProps,
  user,
  initialAuthDone,
  ...rest
}: Props) => (
  <Route
    {...rest}
    render={props => {
      if (!initialAuthDone) return null;
      const content = <Component {...componentProps} />;
      return user ? (
        content
      ) : (
        <Redirect
          to={{
            pathname: '/',
            search: '?login-modal=true',
            state: {from: props.location},
          }}
        />
      );
    }}
  />
);

export const PrivateRoute = connect((state: RootState) => ({
  user: state.auth.user,
  initialAuthDone: state.auth.initialAuthDone,
}))(_PrivateRoute);

_PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
  componentProps: PropTypes.object,
  user: PropTypes.object,
  initialAuthDone: PropTypes.bool,
};
