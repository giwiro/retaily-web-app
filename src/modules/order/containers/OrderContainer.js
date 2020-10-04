// @flow
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as OrderActions} from '../duck';
import Order from '../components/Order';

import type {Dispatch} from 'redux';

import type {RootState} from '../../index';

export default connect(
  (state: RootState) => ({
    order: state.order.order,
    isFetching: state.order.isFetching,
  }),
  (dispatch: Dispatch<any>) =>
    bindActionCreators(
      {
        ...OrderActions,
      },
      dispatch
    )
)(Order);
