// @flow
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as CheckoutActions} from '../duck';
import Checkout from '../components/Checkout';

import type {Dispatch} from 'redux';

import type {RootState} from '../../index';

export default connect(
  (state: RootState) => ({
    pricing: state.shoppingCart.pricing,
    shoppingCart: state.shoppingCart.shoppingCart,
    order: state.checkout.order,
    checkoutError: state.checkout.checkoutError,
    isCheckingOut: state.checkout.isCheckingOut,
    createOrderError: state.checkout.createOrderError,
  }),
  (dispatch: Dispatch<any>) =>
    bindActionCreators(
      {
        ...CheckoutActions,
      },
      dispatch
    )
)(Checkout);
