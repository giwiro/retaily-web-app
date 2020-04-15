// @flow
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Home from '../components/Home';

import type {RootState} from '../../index';

export default withRouter(connect(
  (state: RootState) => ({
    user: state.auth.user,
  }),
)(Home));