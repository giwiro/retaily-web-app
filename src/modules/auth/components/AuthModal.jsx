// @flow
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {CircularProgress, Modal, makeStyles} from '@material-ui/core';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

type Props = {|
  open: boolean,
  handleClose: () => void,
  login: ({email: string, password: string}) => void,
  register: ({
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  }) => void,
  isAuthenticating?: boolean,
  loginError?: string,
  registerError?: string,
|};

type State = {|
  showLogin: boolean,
|};

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(0, 3),
  },
  paper: {
    width: 500,
    minHeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    textAlign: 'center',
  },
  authWrapLoading: {
    opacity: 0.3,
    pointerEvents: 'none',
  },
  loading: {
    position: 'absolute',
    top: `calc(50% - 20px)`,
    left: `calc(50% - 20px)`,
  },
}));

export default function AuthModal(props: Props, state: State) {
  const {
    open,
    handleClose,
    login,
    isAuthenticating,
    loginError,
    register,
    registerError,
  } = props;
  const [showLogin, setShowLogin] = useState(true);
  const classes = useStyles();

  const handleClickShowRegister = (e: Event) => {
    e.preventDefault();
    setShowLogin(false);
  };

  const handleClickShowLogin = (e: Event) => {
    e.preventDefault();
    setShowLogin(true);
  };

  return (
    <Modal
      open={open || (open && !!isAuthenticating)}
      onClose={handleClose}
      className={classes.modal}
    >
      <div className={classes.paper}>
        <div>
          <div className={isAuthenticating ? classes.authWrapLoading : ''}>
            {showLogin && (
              <LoginForm
                handleClickShowRegister={handleClickShowRegister}
                login={login}
                loginError={loginError}
              />
            )}
            {!showLogin && (
              <RegisterForm
                handleClickShowLogin={handleClickShowLogin}
                register={register}
                registerError={registerError}
              />
            )}
          </div>
          {isAuthenticating && <CircularProgress className={classes.loading} />}
        </div>
      </div>
    </Modal>
  );
}

AuthModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticating: PropTypes.bool,
  loginError: PropTypes.string,
  registerError: PropTypes.string,
};
