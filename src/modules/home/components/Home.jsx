// @flow
import React, {useEffect} from 'react';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import {Location} from 'react-router-dom';

import background from '../../../assets/img/background.png';

import type {User} from '../../../entities';

type Props = {
  setAuthModalOpen: (open: boolean) => void,
  location: Location,
  user?: User,
};

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

export default function Home(props: Props) {
  const {location, setAuthModalOpen, user} = props;
  const classes = useStyles();

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    if (parsed['login-modal'] && !user) {
      setAuthModalOpen(true);
    }
  }, [location, user, setAuthModalOpen]);

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

Home.propTypes = {
  setAuthModalOpen: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  user: PropTypes.object,
};