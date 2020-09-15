// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import {Link} from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import TopBanner from '../../../elements/TopBanner/TopBanner';
import PricingSummary from '../../../elements/PricingSummary/PricingSummary';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import {commaFormat} from '../../../utils/number';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

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
    flex: '0 0 300px',
    backgroundSize: 'contain',
    margin: 'auto',
    [theme.breakpoints.up('md')]: {
      width: 250,
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

  const items =
    !!shoppingCart &&
    shoppingCart.items.length > 0 &&
    shoppingCart.items.map(i => (
      <Grid item xs={12} lg={6}>
        <Container>
          <Card key={i.id} className={classes.itemCard}>
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
                        console.log({
                          productId: i.product.id,
                          amount: event.target.value,
                        });
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
      <TopBanner />

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
                  startIcon={<CreditCardIcon />}
                  component={Link}
                  to="/shopping-cart/checkout"
                  disabled={isCalculating}
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
