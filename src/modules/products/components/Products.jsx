// @flow
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import ProductsFilter, {PRODUCTS_SORT_VALUES} from './Filter';
import SingleProduct from './SingleProduct';

import type {Product, ProductCategory} from '../../../entities';

type Props = {
  fetchProducts: () => void,
  isFetching?: boolean,
  categories?: ProductCategory[],
  products?: Product[],
};

export const useStyles = makeStyles(theme => ({
  /*filterGridContainer: {
    padding: `0 ${theme.spacing(3)}px`,
  },*/
  filterContainer: {
    marginTop: theme.spacing(6),
    padding: `0 ${theme.spacing(1)}px`,
  },
  singleProductContainer: {
    marginBottom: theme.spacing(3),
    padding: `0 ${theme.spacing(2)}px`,
  },
}));

export default function Products(props: Props) {
  const {fetchProducts, categories, isFetching, products} = props;
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [sort, setSort] = useState('');
  const classes = useStyles();

  useEffect(() => {
    const filters = {};
    if (category) {
      filters.category = parseInt(category, 10);
    }
    if (price !== 0) {
      filters.price = price;
    }
    if (sort) {
      switch (sort) {
        case PRODUCTS_SORT_VALUES.PRICE_ASC.value:
          filters.ord = 'price';
          filters.sort = 'asc';
          break;
        case PRODUCTS_SORT_VALUES.PRICE_DESC.value:
          filters.ord = 'price';
          filters.sort = 'desc';
          break;
        default:
          break;
      }
    }
    fetchProducts(filters);
  }, [category, fetchProducts, price, sort]);

  const handleChangeCategory = (event: Event) => {
    setCategory(event.target.value);
  };

  const handleChangePrice = (event: Event, newValue: number) => {
    setPrice(newValue);
  };

  const handleChangeSort = (newValue: string) => {
    setSort(newValue);
  };

  const filter = (
    <ProductsFilter
      category={category}
      categories={categories}
      handleChangeCategory={handleChangeCategory}
      price={price}
      handleChangePrice={handleChangePrice}
      sort={sort}
      handleChangeSort={handleChangeSort}
    />
  );

  const content = products && (
    <Grid container>
      {Array(5)
        .fill(products[0])
        .map((p: Product, idx: number) => (
          <Grid
            key={idx}
            container
            item
            xs={12}
            sm={idx % 3 ? 6 : 12}
            md={4}
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            <Container className={classes.singleProductContainer}>
              <SingleProduct product={p} />
            </Container>
          </Grid>
        ))}
    </Grid>
  );

  return (
    <Grid container>
      <Grid
        container
        item
        xs={12}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Container disableGutters className={classes.filterContainer}>
          <Grid container>
            <Grid
              container
              item
              xs={12}
              md={4}
              direction="row"
              justify="center"
              alignItems="flex-start"
              /*className={classes.filterGridContainer}*/
            >
              {filter}
            </Grid>
            <Grid
              container
              item
              xs={12}
              md={8}
              direction="row"
              justify="center"
              alignItems="flex-start"
              className={classes.container}
            >
              {content}
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
}

Products.propTypes = {
  fetchProducts: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  categories: PropTypes.array,
  products: PropTypes.array,
};
