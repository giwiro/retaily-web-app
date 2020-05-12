// @flow
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as ProductsActions} from '../duck';
import {actions as ShoppingCartActions} from '../../shopping-cart/duck';
import Products from '../components/Products';

import type {Dispatch} from 'redux';

import type {RootState} from '../../index';

export default connect(
  (state: RootState) => ({
    isFetching: state.products.isFetching,
    products: state.products.products,
    categories: state.localValues.categories,
    user: state.auth.user,
    isAddingItem: state.shoppingCart.isAddingItem,
    addItemError: state.shoppingCart.addItemError,
  }),
  (dispatch: Dispatch<any>) =>
    bindActionCreators(
      {
        ...ProductsActions,
        ...ShoppingCartActions,
      },
      dispatch
    )
)(Products);
