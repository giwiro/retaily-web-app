// @flow
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect, Route, Switch} from 'react-router-dom';
import {usePrevious} from './utils';
import {createMuiTheme} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/styles';
import Home from './modules/home/components/Home';
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
|};

type State = {|
  authModalOpen: boolean,
|};

function App(props: Props, state: State) {
  const {user} = props;
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const prevUser = usePrevious(user);

  return (
    <ThemeProvider theme={theme}>
      {/* If user just become undefined */}
      {prevUser && !user && <Redirect to="/"/>}
      <NavbarContainer authModalOpen={authModalOpen}
                       setAuthModalOpen={setAuthModalOpen}/>
      <AuthModalContainer open={authModalOpen}
                          setAuthModalOpen={setAuthModalOpen}/>
      <Switch>
        <Route path="/" exact><Home/></Route>
        <Route path="/shopping-cart" exact><ShoppingCartContainer/></Route>
      </Switch>
    </ThemeProvider>
  );
}

App.propTypes = {
  user: PropTypes.object,
};

export default connect(
  (state: RootState) => ({
    user: state.auth.user,
  }),
)(App);
