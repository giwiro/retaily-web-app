// @flow
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

type Props = {|
  open: boolean,
  handleClose: () => void,
  login: ({email: string, password: string}) => void,
  isAuthenticating?: boolean,
|};

type State = {|
  showLogin: boolean,
|};

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
}));

export default function AuthModal(props: Props, state: State) {
  const {open, handleClose, login, isAuthenticating} = props;
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
      open={open}
      onClose={handleClose}
      className={classes.modal}
    >
      <div className={classes.paper}>
        {showLogin && !isAuthenticating &&
        <LoginForm handleClickShowRegister={handleClickShowRegister}
                   login={login}/>}
        {!showLogin && !isAuthenticating &&
        <RegisterForm handleClickShowLogin={handleClickShowLogin}/>}
        {isAuthenticating && <CircularProgress />}
      </div>
    </Modal>
  );
}

AuthModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  isAuthenticating: PropTypes.bool,
};