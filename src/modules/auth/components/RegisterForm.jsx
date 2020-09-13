// @flow
import PropTypes from 'prop-types';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {useForm} from 'react-hook-form';
import Copyright from './Copyright';

import {useStyles} from './CommonFormStyle';

type Props = {|
  handleClickShowLogin: (e: Event) => void,
  register: ({
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  }) => void,
  registerError?: string,
|};

export default function RegisterForm(props: Props) {
  const classes = useStyles();
  const {handleClickShowLogin, registerError} = props;
  const {handleSubmit, register, errors} = useForm();

  const onSubmit = values => {
    props.register({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="firstName"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                error={!!errors.firstName}
                helperText={errors.firstName ? errors.firstName.message : ''}
                inputRef={register({required: 'Required'})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="lastName"
                name="lastName"
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                error={!!errors.lastName}
                helperText={errors.lastName ? errors.lastName.message : ''}
                inputRef={register({required: 'Required'})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
                inputRef={register({
                  required: 'Required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
                inputRef={register({required: 'Required'})}
              />
            </Grid>
          </Grid>
          {registerError && (
            <Typography
              component="p"
              variant="body1"
              className={classes.errorText}
              color="error"
            >
              {registerError}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            className={classes.submit}
          >
            Register
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" onClick={handleClickShowLogin} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
          <Box mt={5}>
            <Copyright />
          </Box>
        </form>
      </div>
    </Container>
  );
}

RegisterForm.propTypes = {
  handleClickShowLogin: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  registerError: PropTypes.string,
};
