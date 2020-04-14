// @flow
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import background from '../../assets/img/background.png';

export const useStyles = makeStyles((theme) => ({
  topWrap: {
    minHeight: '250px',
    maxHeight: '350px',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `url(${background})`,
    backgroundSize: '250px 250px',
  },
  title: {
    fontSize: '2.5em',
    // marginBottom: '20px',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#555',
    marginBottom: theme.spacing(8),
  },
}));

export default function TopBanner() {
  const classes = useStyles();

  return (
    <Grid container
          xs={12}
          item
          className={classes.topWrap}>
      <Typography component="h1"
                  variant="h4"
                  className={classes.title}>Shopping Cart</Typography>
    </Grid>
  );
}