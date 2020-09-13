// @flow
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as ShoppingCartActions} from '../duck';
import ShoppingCart from '../components/ShoppingCart';

import type {Dispatch} from 'redux';

import type {RootState} from '../../index';

export default connect(
  (state: RootState) => ({
    pricing: state.shoppingCart.pricing,
    isCalculating: state.shoppingCart.isCalculating,
    shoppingCart: state.shoppingCart.shoppingCart,
    isFetching: state.shoppingCart.isFetching,
  }),
  (dispatch: Dispatch<any>) =>
    bindActionCreators(
      {
        ...ShoppingCartActions,
      },
      dispatch
    )
)(ShoppingCart);
