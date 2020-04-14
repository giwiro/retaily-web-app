// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Copyright from '../../../elements/Copyright/Copyright';
import { useForm } from 'react-hook-form';

import {useStyles} from './CommonFormStyle';

type Props = {|
  handleClickShowRegister: (e: Event) => void,
  login: ({email: string, password: string}) => void,
  loginError?: string,
|};

export default function LoginForm(props: Props) {
  const classes = useStyles();
  const {handleClickShowRegister, loginError} = props;
  const {handleSubmit, register, errors} = useForm();

  const onSubmit = (values) => {
    const {login} = props;
    login({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}><LockOutlinedIcon /></Avatar>
        <Typography component="h1" variant="h5">Login</Typography>
        <form className={classes.form}
              onSubmit={handleSubmit(onSubmit)}
              noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
            inputRef={register({
              required: 'Required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address"
              }
            })}
          />
          <TextField
            variant="outlined"
            margin="normal"
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
          {loginError && <Typography component="p"
                                     variant="body1"
                                     className={classes.errorText}
                                     color="error">{loginError}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container
                justify="flex-end">
            <Grid item>
              <Link href="#"
                    onClick={handleClickShowRegister}
                    variant="body2">
                {"Don't have an account? Register here"}
              </Link>
            </Grid>
          </Grid>
          <Box mt={6}>
            <Copyright/>
          </Box>
        </form>
      </div>
    </Container>
  );
}

LoginForm.propTypes = {
  handleClickShowRegister: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  loginError: PropTypes.string,
};