// @flow
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  FormControlLabel,
  Checkbox,
  Grid,
  Container,
} from '@material-ui/core';
import TopBanner from '../../../elements/TopBanner/TopBanner';
import PricingSummary from '../../../elements/PricingSummary/PricingSummary';
import {useForm, FormContext} from 'react-hook-form';
import ShippingAddress from './ShippingAddress/ShippingAddress';

import type {Pricing} from '../../../entities';

type Props = {
  pricing?: Pricing,
};

export const useStyles = makeStyles(theme => ({
  mainWrap: {
    padding: theme.spacing(0, 0, 10, 0),
  },
  checkoutDataWrap: {
    marginTop: -theme.spacing(12),
  },
  sameBillingWrap: {
    margin: theme.spacing(2, 0),
  },
  checkoutRightWrap: {
    // marginTop: theme.spacing(2),
    marginTop: 0,
    [theme.breakpoints.up('md')]: {
      marginTop: -theme.spacing(12),
    },
  },
}));

export default function Checkout(props: Props) {
  const {pricing} = props;
  const classes = useStyles();
  const methods = useForm();

  const [sameBilling, setSameBilling] = useState(true);

  const handleChangeSameBilling = event => {
    setSameBilling(event.target.checked);
  };

  return (
    <Grid container className={classes.mainWrap}>
      <TopBanner title="Checkout" />
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
            className={classes.checkoutDataWrap}
          >
            <Container>
              <FormContext {...methods}>
                <ShippingAddress
                  title="Shipping Address"
                  idPrefix="shipping-address"
                />
                <FormControlLabel
                  className={classes.sameBillingWrap}
                  control={
                    <Checkbox
                      color="primary"
                      checked={sameBilling}
                      onChange={handleChangeSameBilling}
                      name="same-billing"
                    />
                  }
                  label="Use this address for payment details"
                />
                {!sameBilling && (
                  <ShippingAddress
                    title="Billing Address"
                    idPrefix="billing-address"
                  />
                )}
              </FormContext>
            </Container>
          </Grid>
          <Grid
            container
            item
            xs={12}
            md={5}
            direction="row"
            justify="center"
            alignItems="flex-start"
            className={classes.checkoutRightWrap}
          >
            <Container>
              <PricingSummary pricing={pricing} isLoading={false} />
            </Container>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
}

Checkout.propTypes = {
  pricing: PropTypes.object,
};
