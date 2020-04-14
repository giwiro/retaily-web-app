// @flow
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

import background from '../../../assets/img/background.png';

export const useStyles = makeStyles((theme) => ({
  topWrap: {
    height: '90vh',
    maxHeight: '1080px',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `url(${background})`,
    backgroundSize: '250px 250px',
  },
  title: {
    fontSize: '3.5em',
    marginBottom: '20px',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#555',
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid container
            xs={12}
            item
            className={classes.topWrap}>
        <Typography component="h1"
                    variant="h4"
                    className={classes.title}>Buy what the f**k you want !</Typography>
      </Grid>
    </Grid>
  );
}