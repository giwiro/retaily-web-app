// @flow
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'
import {usePrevious} from './utils';
import {createMuiTheme} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/styles';
import AuthModalContainer from './modules/auth/containers/AuthModalContainer';
import NavbarContainer from './modules/navbar/containers/NavbarContainer';

import type {User} from './entities';
import type {RootState} from './modules';

import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    primary: blue,
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

  if (!prevUser && user && authModalOpen) {
    setAuthModalOpen(false);
  }

  if (prevUser && !user) {
    return <Redirect to="/"/>;
  }

  return (
    <ThemeProvider theme={theme}>
        <NavbarContainer authModalOpen={authModalOpen}
                         setAuthModalOpen={setAuthModalOpen}/>
        <AuthModalContainer open={authModalOpen}
                            handleClose={() => setAuthModalOpen(false)}/>
    </ThemeProvider>
  );
}

App.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default connect(
  (state: RootState) => ({
    user: state.auth.user,
  }),
)(App);
