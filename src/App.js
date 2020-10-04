// @flow
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect, Route, Switch} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {actions as AuthActions} from './modules/auth/duck';
import {actions as LocalValuesActions} from './modules/local-values/duck';
import {PrivateRoute} from './router/PrivateRoute';
import {usePrevious} from './utils/react';
import {createMuiTheme} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/core/styles';
import HomeContainer from './modules/home/containers/HomeContainer';
import AuthModalContainer from './modules/auth/containers/AuthModalContainer';
import NavbarContainer from './modules/navbar/containers/NavbarContainer';
import ShoppingCartContainer from './modules/shopping-cart/containers/ShoppingCartContainer';
import CheckoutContainer from './modules/checkout/containers/CheckoutContainer';
import ProductsContainer from './modules/products/containers/ProductsContainer';
import OrderContainer from './modules/order/containers/OrderContainer';

import type {User} from './entities';
import type {RootState} from './modules';
import type {Dispatch} from 'redux';

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
  isAuthenticating?: boolean,
  authResetState: () => void,
  fetchCategories: () => void,
|};

/*type State = {|
  authModalOpen: boolean,
|};*/

function App(props: Props) {
  const {user, isAuthenticating, authResetState, fetchCategories} = props;
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const prevUser = usePrevious(user);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
        <Route path="/products" exact>
          <ProductsContainer
            setAuthModalOpen={setAuthModalOpen}
            authModalOpen={authModalOpen}
          />
        </Route>
        <PrivateRoute
          path="/shopping-cart"
          exact
          component={ShoppingCartContainer}
        />
        <PrivateRoute
          path="/shopping-cart/checkout"
          exact
          component={CheckoutContainer}
        />
        <PrivateRoute path="/order/:orderId" exact component={OrderContainer} />
      </Switch>
    </ThemeProvider>
  );
}

App.propTypes = {
  user: PropTypes.object,
  initialAuthDone: PropTypes.bool,
  isAuthenticating: PropTypes.bool,
  authResetState: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
};

export default connect(
  (state: RootState) => ({
    user: state.auth.user,
    isAuthenticating: state.auth.isAuthenticating,
  }),
  (dispatch: Dispatch<any>) =>
    bindActionCreators(
      {
        ...AuthActions,
        ...LocalValuesActions,
      },
      dispatch
    )
)(App);
