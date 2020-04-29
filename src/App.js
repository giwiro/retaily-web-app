// @flow
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect, Route, Switch} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import type {Dispatch} from 'redux';
import {actions as AuthActions} from './modules/auth/duck';
import {PrivateRoute} from './router/PrivateRoute';
import {usePrevious} from './utils/react';
import {createMuiTheme} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/styles';
import HomeContainer from './modules/home/containers/HomeContainer';
import AuthModalContainer from './modules/auth/containers/AuthModalContainer';
import NavbarContainer from './modules/navbar/containers/NavbarContainer';
import ShoppingCartContainer from './modules/shopping-cart/containers/ShoppingCartContainer';

import type {User} from './entities';
import type {RootState} from './modules';

import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
  },
});

type Props = {|
  user?: User,
  initialAuthDone?: boolean,
  isAuthenticating?: boolean,
  authResetState: () => void,
|};

type State = {|
  authModalOpen: boolean,
|};

function App(props: Props, state: State) {
  const {user, isAuthenticating, authResetState, initialAuthDone} = props;
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const prevUser = usePrevious(user);

  const handleClose = () => {
    if (!isAuthenticating && authModalOpen) {
      setAuthModalOpen(false);
      if (!user) {
        authResetState();
      }
    }
  };

  if (!prevUser && user) {
    // setAuthModalOpen(false);
    handleClose();
  }

  return (
    <ThemeProvider theme={theme}>
      {/* If user just become undefined */}
      {prevUser && !user && <Redirect to="/" />}
      <NavbarContainer
        authModalOpen={authModalOpen}
        setAuthModalOpen={setAuthModalOpen}
      />
      <AuthModalContainer open={authModalOpen} handleClose={handleClose} />
      <Switch>
        <Route path="/" exact>
          <HomeContainer setAuthModalOpen={setAuthModalOpen} />
        </Route>
        <PrivateRoute
          exact
          component={ShoppingCartContainer}
          user={user}
          initialAuthDone={initialAuthDone}
        />
      </Switch>
    </ThemeProvider>
  );
}

App.propTypes = {
  user: PropTypes.object,
  initialAuthDone: PropTypes.bool,
  isAuthenticating: PropTypes.bool,
  authResetState: PropTypes.func.isRequired,
};

export default connect(
  (state: RootState) => ({
    user: state.auth.user,
    initialAuthDone: state.auth.initialAuthDone,
    isAuthenticating: state.auth.isAuthenticating,
  }),
  (dispatch: Dispatch<any>) =>
    bindActionCreators(
      {
        ...AuthActions,
      },
      dispatch
    )
)(App);
