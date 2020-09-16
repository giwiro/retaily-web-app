// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardActions,
  Select,
  InputLabel,
  FormControl,
  makeStyles,
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import TopBanner from '../../../elements/TopBanner/TopBanner';
import PricingSummary from '../../../elements/PricingSummary/PricingSummary';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {commaFormat} from '../../../utils/number';
import Skeleton from '@material-ui/lab/Skeleton';

import sadFace from '../../../assets/img/sad-face.png';

import type {
  Pricing,
  ShoppingCart as ShoppingCartEntity,
} from '../../../entities';

type Props = {
  pricing?: Pricing,
  isCalculating?: boolean,
  shoppingCart?: ShoppingCartEntity,
  isFetching?: boolean,
  deleteShoppingCartItem: ({productId: number}) => void,
  updateCartItem: ({productId: number}) => void,
};

export const useStyles = makeStyles(theme => ({
  mainWrap: {
    padding: theme.spacing(0, 0, 10, 0),
  },
  shoppingCartItemsWrap: {
    marginTop: -theme.spacing(12),
  },
  shoppingCartRightWrap: {
    // marginTop: theme.spacing(2),
    marginTop: 0,
    [theme.breakpoints.up('md')]: {
      marginTop: -theme.spacing(12),
    },
  },
  noItems: {
    marginTop: -theme.spacing(12),
  },
  noItemsCard: {
    width: '100%',
    padding: theme.spacing(15, 0),
  },
  sadFace: {
    width: 50,
    height: 50,
    display: 'block',
    margin: theme.spacing(4, 'auto', 0, 'auto'),
  },
  loading: {
    marginTop: theme.spacing(21),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
  total: {
    marginLeft: theme.spacing(1),
  },
  itemCard: {
    marginBottom: theme.spacing(4),
  },
  itemActions: {
    justifyContent: 'flex-end',
  },
  itemWrap: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
    },
  },
  itemImage: {
    width: 300,
    height: 300,
    flex: '0 0 300px',
    backgroundSize: 'contain',
    margin: 'auto',
    [theme.breakpoints.up('md')]: {
      width: 250,
      height: 250,
      flex: '0 0 250px',
      margin: 'unset',
    },
    [theme.breakpoints.up('lg')]: {
      margin: 'auto',
    },
  },
  itemName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    height: theme.spacing(8),
  },
  warningWrap: {
    margin: theme.spacing(2, 0),
  },
  itemSubtotal: {
    margin: theme.spacing(1, 0, 2, 0),
  },
  amountWrap: {
    margin: theme.spacing(2, 0, 0),
  },
}));

export default function ShoppingCart(props: Props) {
  const {
    shoppingCart,
    isFetching,
    updateCartItem,
    deleteShoppingCartItem,
    pricing,
    isCalculating,
  } = props;
  const classes = useStyles();

  // const shouldShowFewLeft = (): boolean => Math.random() < 0.05;

  const amountOptions = Array(10)
    .fill(0)
    .map((_, idx: number) => (
      <option key={idx} value={idx + 1}>
        {idx + 1}
      </option>
    ));

  const loadingItems =
    isFetching &&
    Array(3)
      .fill(null)
      .map((_, idx: number) => (
        <Grid key={`skeleton-${idx}`} item xs={12} lg={6}>
          <Container>
            <Card className={classes.itemCard}>
              <div className={classes.itemWrap}>
                <Skeleton
                  animation="wave"
                  variant="rect"
                  className={classes.itemImage}
                  width="100%"
                />
                <CardContent>
                  <Skeleton
                    animation="wave"
                    variant="text"
                    width="9 0%"
                    height={64}
                  />
                  {/*shouldShowFewLeft() && (
                  <Alert severity="warning" className={classes.warningWrap}>
                    Only few in stock !
                  </Alert>
                )*/}
                  <Skeleton animation="wave" variant="text" width={64} />
                  <Skeleton
                    animation="wave"
                    variant="text"
                    width={64}
                    height={64}
                    style={{marginTop: 12}}
                  />
                </CardContent>
              </div>
              <CardActions className={classes.itemActions}>
                <Skeleton animation="wave" variant="text" width={64} />
              </CardActions>
            </Card>
          </Container>
        </Grid>
      ));

  const items =
    !!shoppingCart &&
    shoppingCart.items.length > 0 &&
    shoppingCart.items.map(i => (
      <Grid key={i.id} item xs={12} lg={6}>
        <Container>
          <Card className={classes.itemCard}>
            <div className={classes.itemWrap}>
              <CardMedia
                className={classes.itemImage}
                image={i.product.imageUrl}
                title={i.product.name}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  align="left"
                  className={classes.itemName}
                >
                  {i.product.name}
                </Typography>
                {/*shouldShowFewLeft() && (
                  <Alert severity="warning" className={classes.warningWrap}>
                    Only few in stock !
                  </Alert>
                )*/}
                <Typography
                  variant="body1"
                  color="textSecondary"
                  align="left"
                  className={classes.itemSubtotal}
                >
                  $ {commaFormat(i.product.price * i.amount)}
                </Typography>
                <FormControl variant="outlined" className={classes.amountWrap}>
                  <InputLabel htmlFor="outlined-amount-native-simple">
                    Qnt.
                  </InputLabel>
                  <Select
                    native
                    value={i.amount}
                    onChange={event => {
                      if (event.target instanceof HTMLSelectElement) {
                        updateCartItem({
                          productId: i.product.id,
                          amount: event.target.value,
                        });
                      }
                    }}
                    label="Amount"
                    inputProps={{
                      name: 'amount',
                      id: 'outlined-amount-native-simple',
                    }}
                  >
                    {amountOptions}
                  </Select>
                </FormControl>
              </CardContent>
            </div>
            <CardActions className={classes.itemActions}>
              <Button
                size="small"
                startIcon={<DeleteForeverIcon />}
                color="secondary"
                onClick={_ => deleteShoppingCartItem({productId: i.product.id})}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </Container>
      </Grid>
    ));

  return (
    <Grid container className={classes.mainWrap}>
      <TopBanner title="Shopping cart" />

      {/* No items */}
      {!!shoppingCart && !shoppingCart.items.length && (
        <Container>
          <Grid container>
            <Grid
              container
              item
              xs={12}
              direction="row"
              justify="center"
              alignItems="center"
              className={classes.noItems}
            >
              <Card className={classes.noItemsCard}>
                <CardContent>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    align="center"
                  >
                    {'There are no items in your shopping cart'}
                    <br />
                    <Link to="/products">Continue shopping</Link>
                  </Typography>
                  <Link to="/products">
                    <img
                      src={sadFace}
                      alt="sad face"
                      className={classes.sadFace}
                    />
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      )}

      {(isFetching ||
        isCalculating ||
        (!!shoppingCart && !!shoppingCart.items.length)) && (
        <Container>
          <Grid container>
            <Grid
              container
              item
              xs={12}
              md={7}
              direction="row"
              justify="center"
              alignItems="flex-start"
              className={classes.shoppingCartItemsWrap}
            >
              <Grid container justify="space-between">
                {loadingItems}
                {items}
              </Grid>
            </Grid>

            <Grid
              container
              item
              xs={12}
              md={5}
              direction="row"
              justify="center"
              alignItems="flex-start"
              className={classes.shoppingCartRightWrap}
            >
              <Container>
                <PricingSummary pricing={pricing} isLoading={isCalculating} />
                <Button
                  fullWidth
                  type="button"
                  variant="contained"
                  color="primary"
                  size="large"
                  className={classes.submit}
                  //  startIcon={<CreditCardIcon />}
                  component={Link}
                  to="/shopping-cart/checkout"
                  disabled={isCalculating || isFetching}
                >
                  Checkout
                  {/*<strong className={classes.total}>{`$ ${commaFormat(
                  pricing.total
                )}`}</strong>*/}
                </Button>
              </Container>
            </Grid>
          </Grid>
        </Container>
      )}
    </Grid>
  );
}

ShoppingCart.propTypes = {
  pricing: PropTypes.object,
  isCalculating: PropTypes.bool,
  shoppingCart: PropTypes.object,
  isFetching: PropTypes.bool,
  deleteShoppingCartItem: PropTypes.func.isRequired,
  updateCartItem: PropTypes.func.isRequired,
};
