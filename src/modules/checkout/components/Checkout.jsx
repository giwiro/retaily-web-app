// @flow
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  FormControlLabel,
  Checkbox,
  Grid,
  Container,
  CardHeader,
  CardContent,
  Card,
  Button,
} from '@material-ui/core';
import TopBanner from '../../../elements/TopBanner/TopBanner';
import PricingSummary from '../../../elements/PricingSummary/PricingSummary';
import {useForm, FormContext} from 'react-hook-form';
import ShippingAddress from './ShippingAddress/ShippingAddress';
import {mapToAddress} from './ShippingAddress/utils';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import {loadStripe} from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import type {Pricing} from '../../../entities';

type Props = {
  pricing?: Pricing,
  isFetching?: boolean,
  isCalculating?: boolean,
};

export const useStyles = makeStyles(theme => ({
  mainWrap: {
    padding: theme.spacing(0, 0, 15, 0),
  },
  checkoutDataWrap: {
    marginTop: -theme.spacing(16),
  },
  sameBillingWrap: {
    margin: theme.spacing(2, 0),
  },
  checkoutRightWrap: {
    // marginTop: theme.spacing(2),
    marginTop: 0,
    [theme.breakpoints.up('md')]: {
      marginTop: -theme.spacing(16),
    },
  },
  submit: {
    marginTop: theme.spacing(4),
  },
}));

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

function CheckoutInner(props: Props) {
  const {pricing, isCalculating, isFetching} = props;

  const classes = useStyles();
  const methods = useForm();
  const stripe = useStripe();
  const elements = useElements();

  const [sameBilling, setSameBilling] = useState(true);

  const handleChangeSameBilling = event => {
    setSameBilling(event.target.checked);
  };

  const handleSubmit = async values => {
    console.log('values', values);
    const shippingAddress = mapToAddress(values, 'shipping-address');
    const billingAddress = mapToAddress(values, 'billing-address');
    console.log('shippingAddress', shippingAddress);
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (!error) {
      console.log('paymentMethod', paymentMethod);

      const request = {shippingAddress, paymentToken: paymentMethod.id};

      if (!sameBilling) request.billingAddress = billingAddress;

      console.log('send', request);
    }
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
                  <>
                    <ShippingAddress
                      title="Billing Address"
                      idPrefix="billing-address"
                    />
                    <br />
                    <br />
                  </>
                )}
              </FormContext>
              <Card>
                <CardHeader title="Payment" />
                <CardContent>
                  <CardElement />
                </CardContent>
              </Card>
              <Button
                fullWidth
                type="button"
                variant="contained"
                color="primary"
                size="large"
                className={classes.submit}
                startIcon={<CreditCardIcon />}
                disabled={isCalculating || isFetching || !stripe}
                onClick={methods.handleSubmit(handleSubmit)}
              >
                Finish payment
              </Button>
              <br />
              <br />
              <br />
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

export default function Checkout(props: Props) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutInner {...props} />
    </Elements>
  );
}

Checkout.propTypes = CheckoutInner.propTypes = {
  pricing: PropTypes.object,
  isFetching: PropTypes.bool,
  isCalculating: PropTypes.bool,
};
