// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
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

import type {ShoppingCart as ShoppingCartEntity, ShoppingCartItem} from '../../../entities';

type Props = {
  shoppingCart?: ShoppingCartEntity,
  isFetching?: boolean,
};

export const useStyles = makeStyles((theme) => ({
  shoppingCartWrap: {
    marginTop: -theme.spacing(8),
  },
  cardContent: {
    minHeight: '250px',
  },
  rowImage: {
    height: '150px',
  },
}));

export default function ShoppingCart(props: Props) {
  const {shoppingCart, isFetching} = props;
  const classes = useStyles();

  const rows = shoppingCart && shoppingCart.items.map((item: ShoppingCartItem) => {
    const subtotal = item.product.price * item.amount;
    return (
      <TableRow key={item.shoppingCartItemId}>
        <TableCell align="right">
          <img src={item.product.imageUrl}
               className={classes.rowImage}
               alt={item.product.name}/>
        </TableCell>
        <TableCell align="right">{item.product.name}</TableCell>
        <TableCell align="right">$ {commaFormat(item.product.price)}</TableCell>
        <TableCell align="right">{item.amount}</TableCell>
        <TableCell align="right">$ {commaFormat(subtotal)}</TableCell>
      </TableRow>
    );
  });

  return (
    <Grid container>
      <TopBanner/>
      <Grid
        container
        item
        xs={12}
        direction="row"
        justify="center"
        alignItems="center">

        <Container className={classes.shoppingCartWrap}>
          <Card>
            <CardContent className={classes.cardContent}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="right">Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">QTY</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Container>

      </Grid>
    </Grid>
  );
}

ShoppingCart.propTypes = {
  shoppingCart: PropTypes.object.isRequired,
  isFetching: PropTypes.bool,
};