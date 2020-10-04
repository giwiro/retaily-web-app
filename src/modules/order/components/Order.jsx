// @flow
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useParams} from 'react-router-dom';
import {Grid, makeStyles} from '@material-ui/core';
import TopBanner from '../../../elements/TopBanner/TopBanner';
import {StepProgress} from './StepProgress/StepProgress';

import type {Order as OrderE} from '../../../entities';

type Props = {|
  order?: OrderE,
  isFetching?: boolean,
  fetchOrder: ({orderId: number}) => void,
  resetState: () => void,
|};

export const useStyles = makeStyles(theme => ({
  mainWrap: {
    padding: theme.spacing(0, 0, 10, 0),
  },
  stepWrap: {
    marginTop: -theme.spacing(12),
  },
}));

export default function Order(props: Props) {
  const {order, fetchOrder, resetState} = props;

  const classes = useStyles();
  const {orderId} = useParams();

  useEffect(() => {
    fetchOrder({orderId});
    return () => resetState();
  }, [fetchOrder, orderId, resetState]);

  return (
    <Grid container className={classes.mainWrap}>
      <TopBanner title={'Order' + (!!order ? ` #${order.id}` : '')} />
      <Grid
        container
        item
        xs={12}
        md={12}
        direction="row"
        justify="center"
        alignItems="flex-start"
        className={classes.stepWrap}
      >
        <StepProgress step={!!order ? order.status : undefined} />
      </Grid>
    </Grid>
  );
}

Order.propTypes = {
  order: PropTypes.object,
  isFetching: PropTypes.bool,
  fetchOrder: PropTypes.func.isRequired,
  resetState: PropTypes.func.isRequired,
};
