// @flow
import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Subject} from 'rxjs';
import {Redirect, useHistory} from 'react-router-dom';
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
import {usePrevious} from '../../../utils/react';
import {loadStripe} from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import type {Address, Order, Pricing, ShoppingCart} from '../../../entities';
import Alert from '@material-ui/lab/Alert';

type Props = {
  pricing?: Pricing,
  shoppingCart?: ShoppingCart,
  order?: Order,
  isFetching?: boolean,
  isCalculating?: boolean,
  createOrder: ({shippingAddress: Address, billingAddress: Address}) => void,
  checkoutResetState: () => void,
  checkoutFinishLoading: () => void,
  isCheckingOut?: boolean,
  createOrderErrorFn: ({error: string}) => void,
  checkoutError?: string,
  createOrderError?: string,
  checkoutRequest: () => void,
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

const retryPayment$ = new Subject();

function CheckoutInner(props: Props) {
  const {
    pricing,
    order,
    isCalculating,
    isFetching,
    createOrder,
    checkoutResetState,
    checkoutFinishLoading,
    isCheckingOut,
    checkoutErrorFn,
    checkoutError,
    createOrderError,
    checkoutRequest,
  } = props;

  const classes = useStyles();
  const methods = useForm();
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();

  const [sameBilling, setSameBilling] = useState(true);
  const [cardFilled, setCardFilled] = useState(false);
  const prevOrder = usePrevious(order);

  const confirmStripePayment = useCallback(() => {
    if (order) {
      stripe
        .confirmCardPayment(order.paymentToken, {
          payment_method: {card: elements.getElement(CardElement)},
        })
        .then(result => {
          console.log('result', result);
          if (result.error) {
            checkoutFinishLoading();
            checkoutErrorFn({error: result.error.message});
          } else {
            console.log('redirect');
            history.push(`/order/${order.id}`);
          }
        });
    }
  }, [
    order,
    stripe,
    elements,
    checkoutFinishLoading,
    checkoutErrorFn,
    history,
  ]);

  // Disable Stripe
  useEffect(() => {
    if (elements) {
      const card = elements.getElement(CardElement);
      if (isCheckingOut) card.update({disabled: true});
      else card.update({disabled: false});
    }
  }, [elements, isCheckingOut]);

  // If is the first time the order is generated, then execute the confirm stripe payment
  useEffect(() => {
    if (!prevOrder && order) {
      confirmStripePayment();
    }
  }, [order, prevOrder, confirmStripePayment]);

  // If the payment went wrong, there is a change to retry
  useEffect(() => {
    const subs = retryPayment$.subscribe(_ => {
      checkoutRequest();
      confirmStripePayment();
    });
    return () => subs.unsubscribe();
  }, [checkoutRequest, confirmStripePayment]);

  // Ehen exit the view, then reset all checkout state
  useEffect(() => {
    return () => checkoutResetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutResetState]);

  const handleChangeSameBilling = event => {
    setSameBilling(event.target.checked);
  };

  const handleSubmit = async values => {
    if (order) return retryPayment$.next();
    const shippingAddress = mapToAddress(values, 'shipping-address');
    const billingAddress = mapToAddress(values, 'billing-address');

    const request = {
      shippingAddress,
      billingAddress: shippingAddress,
    };
    if (!sameBilling) request.billingAddress = billingAddress;
    createOrder(request);
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
                  disabled={isCheckingOut}
                />
                <FormControlLabel
                  className={classes.sameBillingWrap}
                  control={
                    <Checkbox
                      color="primary"
                      checked={sameBilling}
                      onChange={handleChangeSameBilling}
                      name="same-billing"
                      disabled={isCheckingOut}
                    />
                  }
                  label="Use this address for payment details"
                />
                {!sameBilling && (
                  <>
                    <ShippingAddress
                      title="Billing Address"
                      idPrefix="billing-address"
                      disabled={isCheckingOut}
                    />
                    <br />
                    <br />
                  </>
                )}
              </FormContext>
              <Card>
                <CardHeader title="Payment" />
                <CardContent>
                  {(checkoutError || createOrderError) && (
                    <>
                      <Alert severity="error">
                        {checkoutError || createOrderError}
                      </Alert>
                      <br />
                      <br />
                    </>
                  )}
                  <CardElement onChange={e => setCardFilled(e.complete)} />
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
                disabled={
                  isCalculating ||
                  isFetching ||
                  !stripe ||
                  !cardFilled ||
                  isCheckingOut
                }
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
  const {shoppingCart} = props;
  return (
    <>
      {!!shoppingCart && shoppingCart.items.length === 0 && (
        <Redirect to="/shopping-cart" />
      )}
      <Elements stripe={stripePromise}>
        <CheckoutInner {...props} />
      </Elements>
    </>
  );
}

Checkout.propTypes = CheckoutInner.propTypes = {
  pricing: PropTypes.object,
  shoppingCart: PropTypes.object,
  order: PropTypes.object,
  isFetching: PropTypes.bool,
  isCalculating: PropTypes.bool,
  createOrder: PropTypes.func.isRequired,
  checkoutResetState: PropTypes.func.isRequired,
  checkoutFinishLoading: PropTypes.func.isRequired,
  isCheckingOut: PropTypes.bool,
  checkoutErrorFn: PropTypes.func.isRequired,
  checkoutError: PropTypes.string,
  createOrderError: PropTypes.string,
  checkoutRequest: PropTypes.func.isRequired,
};
