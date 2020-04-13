// @flow
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {makeStyles} from '@material-ui/core/styles';

import logo from '../../../assets/img/logo.png';
import {MenuItemLink} from '../../../elements/MenuItemLink/MenuItemLink';

import type {User} from '../../../entities';

const useStyles = makeStyles({
  logo: {
    maxHeight: 40,
    display: 'block',
  },
  grow: {
    flexGrow: 1,
  },
  iconLink: {
    color: 'white',
    textDecoration: 'none',
  },
});

type Props = {|
  user?: User,
  authModalOpen: boolean,
  setAuthModalOpen: (open: boolean) => void,
  getSession: () => void,
  logout: () => void,
|};

type State = {|
  anchorEl: EventTarget,
|};

export default function Navbar(props: Props, state: State) {
  const {setAuthModalOpen, logout, getSession, user} = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const handleClickAuthMenu = (event: Event) => setAnchorEl(event.currentTarget);

  const handleCloseAuthMenu = () => setAnchorEl(null);

  const handleClickShoppingCart = (e: Event) => {
    if (!user) {
      e.preventDefault();
      setAuthModalOpen(true);
    }
  };

  const handleClickLogin = () => {
    setAuthModalOpen(true);
    handleCloseAuthMenu();
  };

  const handleClickLogout = () => {
    logout();
    handleCloseAuthMenu();
  };

  useEffect(() => {
    getSession();
  }, [getSession]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Link to="/"
                className={classes.iconLink}>
            <img src={logo}
                 alt="logo"
                 className={classes.logo}/>
          </Link>
          <div className={classes.grow}/>
          <Link to="/shopping-cart"
                className={classes.iconLink}>
            <IconButton color="inherit"
                        onClick={handleClickShoppingCart}>
              <ShoppingCartIcon/>
            </IconButton>
          </Link>
          <IconButton color="inherit"
                      onClick={handleClickAuthMenu}>
            <AccountCircleIcon/>
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            keepMounted
            open={!!anchorEl}
            onClose={handleCloseAuthMenu}
          >
            {!user && [
              <MenuItem key="login" onClick={handleClickLogin}>Login</MenuItem>,
            ]}
            {user && [
              <MenuItemLink key="my-orders"
                            to="/my-orders"
                            onClick={handleCloseAuthMenu}>My orders</MenuItemLink>,
              /*<MenuItem key="my-orders">My orders</MenuItem>,*/
              <MenuItem key="logout" onClick={handleClickLogout}>Logout</MenuItem>,
            ]}
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
}

Navbar.propTypes = {
  user: PropTypes.object,
  authModalOpen: PropTypes.bool.isRequired,
  setAuthModalOpen: PropTypes.func.isRequired,
  getSession: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};