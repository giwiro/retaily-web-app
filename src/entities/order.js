// @flow
import type {Address} from './address';

export type Order = {
  type: 'order',
  id: number,
  status: string,
  shippingAddress: Address,
  billingAddress: Address,
  paymentToken: string,
};
