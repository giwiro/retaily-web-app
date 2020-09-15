// @flow
export type Pricing = {
  type: 'pricing',
  subtotal: number,
  taxes: number,
  paymentFee: number,
  commission: number,
  total: number,
};
