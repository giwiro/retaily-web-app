// @flow
import React, {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import ProductsFilter, {PRODUCTS_SORT_VALUES} from './Filter';
import SingleProduct from './SingleProduct';
import CircularProgress from '@material-ui/core/CircularProgress';
import hash from 'object-hash';
import {usePrevious} from '../../../utils/react';
import SingleProductModal from './SingleProductModal';

import type {Product, ProductCategory, User} from '../../../entities';

type Props = {|
  fetchProducts: ({
    filters: {[key: string]: string | number},
    resetPagination?: boolean,
  }) => void,
  isFetching?: boolean,
  categories?: ProductCategory[],
  products?: Product[],
  user?: User,
  setAuthModalOpen: (open: boolean) => void,
  authModalOpen: boolean,
  addShoppingCartItem: ({productId: number, amount: number}) => void,
  isAddingItem?: boolean,
  addItemError?: string,
|};

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
  loading: {
    margin: `${theme.spacing(8)}px 0`,
  },
}));

export default function Products(props: Props) {
  const {
    fetchProducts,
    categories,
    products,
    user,
    isFetching,
    setAuthModalOpen,
    authModalOpen,
    addShoppingCartItem,
    isAddingItem,
    addItemError,
  } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [sort, setSort] = useState('');
  const classes = useStyles();
  const lastRequestFiltersHash = useRef<string>();
  const pendingAddProduct = useRef<Product>();
  const prevAuthModalOpen = usePrevious(authModalOpen);
  const prevIsAddingItem = usePrevious(isAddingItem);

  const handleChangeCategory = (event: Event) => {
    setCategory(event.target.value);
  };

  const handleChangePrice = (event: Event, newValue: number) => {
    setPrice(newValue);
  };

  const handleChangeSort = (newValue: string) => {
    setSort(newValue);
  };

  const handleClickAddProduct = (product: Product) => {
    pendingAddProduct.current = product;
    if (!user) {
      setAuthModalOpen(true);
    } else {
      // handleAddProduct(product.id, 1);
      setModalOpen(true);
    }
  };

  const handleAddProduct = useCallback(
    (productId: number, amount: number) => {
      addShoppingCartItem({productId, amount});
    },
    [addShoppingCartItem]
  );

  const handleCloseModal = () => {
    if (!isAddingItem && modalOpen) {
      setModalOpen(false);
      pendingAddProduct.current = undefined;
    }
  };

  useEffect(() => {
    if (prevIsAddingItem && !isAddingItem) {
      if (!addItemError) {
        setModalOpen(false);
      }
    }
  }, [addItemError, isAddingItem, prevIsAddingItem]);

  useEffect(() => {
    // When modal just closed
    if (prevAuthModalOpen && !authModalOpen) {
      if (user) {
        if (pendingAddProduct.current) {
          setModalOpen(true);
        }
      } else {
        pendingAddProduct.current = undefined;
      }
    }
  }, [authModalOpen, handleAddProduct, prevAuthModalOpen, user]);

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
    let resetPagination = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const newHash = hash(filters);
    if (lastRequestFiltersHash.current !== newHash) {
      resetPagination = true;
      lastRequestFiltersHash.current = newHash;
    }
    fetchProducts({filters, resetPagination});
  }, [category, fetchProducts, price, sort]);

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
      {products.map((p: Product, idx: number) => (
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
            <SingleProduct
              product={p}
              handleClickAddProduct={handleClickAddProduct}
            />
          </Container>
        </Grid>
      ))}
    </Grid>
  );

  const modal = pendingAddProduct.current && (
    <SingleProductModal
      open={modalOpen}
      handleCloseModal={handleCloseModal}
      product={pendingAddProduct.current}
      handleAddProduct={handleAddProduct}
      isAddingItem={isAddingItem}
    />
  );

  return (
    <>
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
            <Grid container alignItems="flex-start">
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
                {isFetching && <CircularProgress className={classes.loading} />}
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
      {modal}
    </>
  );
}

Products.propTypes = {
  fetchProducts: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  categories: PropTypes.array,
  products: PropTypes.array,
  user: PropTypes.object,
  setAuthModalOpen: PropTypes.func.isRequired,
  authModalOpen: PropTypes.bool.isRequired,
  addShoppingCartItem: PropTypes.func.isRequired,
  isAddingItem: PropTypes.bool,
  addItemError: PropTypes.string,
};
