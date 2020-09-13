// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {Link} from 'react-router-dom';
import Table from '@material-ui/core/Table';
import IconButton from '@material-ui/core/IconButton';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import TopBanner from '../../../elements/TopBanner/TopBanner';
import {commaFormat} from '../../../utils/number';

import type {
  Pricing,
  ShoppingCart as ShoppingCartEntity,
  ShoppingCartItem,
} from '../../../entities';
import Typography from '@material-ui/core/Typography';

type Props = {
  pricing?: Pricing,
  isCalculating?: boolean,
  shoppingCart?: ShoppingCartEntity,
  isFetching?: boolean,
  deleteShoppingCartItem: ({productId: number}) => void,
};

export const useStyles = makeStyles(theme => ({
  shoppingCartWrap: {
    marginTop: -theme.spacing(12),
  },
  cardContent: {
    minHeight: '450px',
  },
  rowImage: {
    height: '100px',
  },
  loading: {
    marginTop: theme.spacing(21),
  },
  noBorderRow: {
    border: 'none',
  },
  moneyCellRow: {
    width: 90,
  },
}));

export default function ShoppingCart(props: Props) {
  const {
    shoppingCart,
    isFetching,
    deleteShoppingCartItem,
    pricing,
    isCalculating,
  } = props;
  const classes = useStyles();

  const total =
    shoppingCart &&
    shoppingCart.items.reduce(
      (acum: number, item: ShoppingCartItem) =>
        acum + item.product.price * item.amount,
      0
    );

  const rows =
    shoppingCart &&
    shoppingCart.items.map((item: ShoppingCartItem) => {
      // const itemSubtotal = item.product.price * item.amount;
      return (
        <TableRow key={item.id}>
          <TableCell align="right">
            <img
              src={item.product.imageUrl}
              className={classes.rowImage}
              alt={item.product.name}
            />
          </TableCell>
          <TableCell align="right">{item.product.name}</TableCell>
          <TableCell align="right" className={classes.moneyCellRow}>
            $ {commaFormat(item.product.price)}
          </TableCell>
          <TableCell align="right">{item.amount}</TableCell>
          {/*<TableCell align="right" className={classes.moneyCellRow}>
            $ {commaFormat(itemSubtotal)}
          </TableCell>*/}
          <TableCell align="right">
            <IconButton
              color="secondary"
              onClick={() =>
                deleteShoppingCartItem({productId: item.product.id})
              }
            >
              <DeleteForeverIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });

  return (
    <Grid container>
      <TopBanner />
      <Grid
        container
        item
        xs={12}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Container className={classes.shoppingCartWrap}>
          <Card>
            <CardContent className={classes.cardContent}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell align="right">Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">QTY</TableCell>
                    {/*<TableCell align="right">Amount</TableCell>*/}
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!isFetching &&
                    shoppingCart &&
                    shoppingCart.items.length > 0 && (
                      <>
                        {rows}
                        <TableRow>
                          <TableCell colSpan={2} />
                          <TableCell align="right">Subtotal</TableCell>
                          <TableCell
                            align="right"
                            className={classes.moneyCellRow}
                          >
                            {pricing &&
                              !isCalculating &&
                              `$ ${commaFormat(pricing.subtotal)}`}
                          </TableCell>
                          <TableCell align="right" colSpan={2}>
                            <Button
                              type="button"
                              fullWidth
                              variant="contained"
                              color="primary"
                              size="large"
                              className={classes.submit}
                              startIcon={<CreditCardIcon />}
                              component={Link}
                              to="/shopping-cart/checkout"
                            >
                              Checkout
                            </Button>
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  {!isFetching &&
                    (!shoppingCart || shoppingCart.items.length === 0) && (
                      <>
                        {Array(4)
                          .fill(0)
                          .map((_, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell
                                colSpan={100}
                                align="center"
                                className={classes.noBorderRow}
                              />
                            </TableRow>
                          ))}
                        <TableRow>
                          <TableCell
                            colSpan={100}
                            align="center"
                            className={classes.noBorderRow}
                          >
                            <Typography
                              variant="body1"
                              color="textSecondary"
                              align="center"
                            >
                              {'There are no items in your shopping cart'}
                              <br />
                              <Link to="/products">Continue shopping</Link>
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                </TableBody>
              </Table>

              {isFetching && (
                <Grid container alignItems="center" justify="center">
                  <CircularProgress className={classes.loading} />
                </Grid>
              )}
            </CardContent>
          </Card>
        </Container>
      </Grid>
    </Grid>
  );
}

ShoppingCart.propTypes = {
  pricing: PropTypes.object,
  isCalculating: PropTypes.bool,
  shoppingCart: PropTypes.object,
  isFetching: PropTypes.bool,
  deleteShoppingCartItem: PropTypes.func.isRequired,
};
