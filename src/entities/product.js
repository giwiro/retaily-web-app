// @flow
export type ProductCategory = {|
  type: 'product-category',
  id: number,
  name: string,
|};

export type Product = {|
  type: 'product',
  id: number,
  name: string,
  category: ProductCategory,
  price: number,
  imageUrl: string,
|};
