// @flow
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AuthModal from '../components/AuthModal';
import {actions as AuthActions} from '../duck';

import type {RootState} from '../../index';
import type {Dispatch} from 'redux';

export default connect(
  (state: RootState) => ({
    isAuthenticating: state.auth.isAuthenticating,
    loginError: state.auth.loginError,
    registerError: state.auth.registerError,
  }), (dispatch: Dispatch<any>) =>
    bindActionCreators(
      {
        ...AuthActions,
      },
      dispatch,
    ),
)(AuthModal);