// @flow
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TopBanner from '../../../elements/TopBanner/TopBanner';
import Grid from '@material-ui/core/Grid';

export const useStyles = makeStyles(theme => ({
  mainWrap: {
    padding: theme.spacing(0, 0, 10, 0),
  },
}));

export default function Checkout() {
  const classes = useStyles();
  return (
    <Grid container className={classes.mainWrap}>
      <TopBanner />
    </Grid>
  );
}

Checkout.propTypes = {};
