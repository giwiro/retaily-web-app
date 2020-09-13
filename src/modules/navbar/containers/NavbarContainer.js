// @flow
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getSession, logout} from '../../auth/duck';
import Navbar from '../components/Navbar';

import type {Dispatch} from 'redux';

import type {RootState} from '../../index';

export default connect(
  (state: RootState) => ({
    isAuthenticating: state.auth.isAuthenticating,
    user: state.auth.user,
    shoppingCart: state.shoppingCart.shoppingCart,
  }),
  (dispatch: Dispatch<any>) =>
    bindActionCreators({getSession, logout}, dispatch)
)(Navbar);
