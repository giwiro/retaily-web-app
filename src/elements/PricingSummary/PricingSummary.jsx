// @flow
import React from 'react';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import {makeStyles} from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Skeleton from '@material-ui/lab/Skeleton';
import {commaFormat} from '../../utils/number';

import type {Pricing} from '../../entities';

type Props = {|
  pricing?: Pricing,
  isLoading?: boolean,
|};

export const useStyles = makeStyles(theme => ({
  moneyCellRow: {},
  guarantee: {
    color: theme.palette.success.main,
  },
  lastCell: {
    border: 0,
  },
  total: {
    fontSize: theme.typography.h5.fontSize,
  },
}));

export default function PricingSummary(props: Props) {
  const {pricing, isLoading} = props;
  const classes = useStyles();

  return (
    <Card>
      <CardHeader title="Pricing summary" />
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell align="left">Subtotal:</TableCell>
              <TableCell align="right" className={classes.moneyCellRow}>
                {!!pricing &&
                  !isLoading &&
                  `$ ${commaFormat(pricing.subtotal)}`}
                {(!pricing || isLoading) && (
                  <Skeleton variant="text" animation="wave" />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Tax:</TableCell>
              <TableCell align="right" className={classes.moneyCellRow}>
                {!!pricing && !isLoading && `$ ${commaFormat(pricing.taxes)}`}
                {(!pricing || isLoading) && (
                  <Skeleton variant="text" animation="wave" />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Fee:</TableCell>
              <TableCell align="right" className={classes.moneyCellRow}>
                {!!pricing &&
                  !isLoading &&
                  `$ ${commaFormat(pricing.paymentFee)}`}
                {(!pricing || isLoading) && (
                  <Skeleton variant="text" animation="wave" />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Commission:</TableCell>
              <TableCell align="right" className={classes.moneyCellRow}>
                {!!pricing &&
                  !isLoading &&
                  `$ ${commaFormat(pricing.commission)}`}
                {(!pricing || isLoading) && (
                  <Skeleton variant="text" animation="wave" />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left" className={classes.guarantee}>
                Guarantee (30 days):
              </TableCell>
              <TableCell align="right" className={classes.guarantee}>
                {!!pricing && !isLoading && <strong>Free</strong>}
                {(!pricing || isLoading) && (
                  <Skeleton variant="text" animation="wave" />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left" className={classes.lastCell}>
                <strong>Total:</strong>
              </TableCell>
              <TableCell align="right" className={classes.lastCell}>
                <strong className={classes.total}>
                  {!!pricing && !isLoading && `$ ${commaFormat(pricing.total)}`}
                  {(!pricing || isLoading) && (
                    <Skeleton variant="text" animation="wave" />
                  )}
                </strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

PricingSummary.propTypes = {
  pricing: PropTypes.object,
  isLoading: PropTypes.bool,
};
