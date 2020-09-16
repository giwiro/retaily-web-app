// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

import background from '../../assets/img/background.png';

type Props = {|
  title: string,
|};

export const useStyles = makeStyles(theme => ({
  topWrap: {
    minHeight: '300px',
    // maxHeight: '350px',
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
    marginBottom: theme.spacing(11),
  },
}));

export default function TopBanner(props: Props) {
  const {title} = props;
  const classes = useStyles();

  return (
    <Grid container xs={12} item className={classes.topWrap}>
      <Typography component="h1" variant="h4" className={classes.title}>
        {title}
      </Typography>
    </Grid>
  );
}

TopBanner.propTypes = {
  title: PropTypes.string.isRequired,
};
