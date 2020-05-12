// @flow
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import {Modal} from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {commaFormat} from '../../../utils/number';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import CircularProgress from '@material-ui/core/CircularProgress';
import {usePrevious} from '../../../utils/react';

import type {Product} from '../../../entities';

type Props = {|
  product: Product,
  open?: boolean,
  handleCloseModal: () => void,
  handleAddProduct: (productId: number, amount: number) => void,
  isAddingItem: boolean,
|};

export const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(0, 3),
  },
  paper: {
    width: 850,
    minHeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(5),
    textAlign: 'center',
  },
  productContainer: {
    minHeight: 500,
  },
  image: {
    width: '100%',
    maxWidth: 400,
    maxHeight: 400,
  },
  title: {
    fontWeight: 600,
    textAlign: 'left',
    marginBottom: theme.spacing(3),
  },
  infoContainer: {
    flexDirection: 'column',
  },
  amountFormControl: {
    marginBottom: theme.spacing(3),
    minWidth: 100,
  },
  loading: {
    position: 'absolute',
    top: `calc(50% - 20px)`,
    left: `calc(50% - 20px)`,
  },
}));

export default function SingleProductModal(props: Props) {
  const {
    open,
    handleCloseModal,
    product,
    handleAddProduct,
    isAddingItem,
  } = props;
  const [amount, setAmount] = useState<string>('1');
  const classes = useStyles();
  const prevOpen = usePrevious(open);

  const handleChange = (event: Event) => {
    if (event.target instanceof HTMLSelectElement) {
      setAmount(event.target.value);
    }
  };

  const handleClickAddToCart = () => {
    const a = parseInt(amount, 10);
    handleAddProduct(product.id, a);
  };

  useEffect(() => {
    if (!prevOpen && open) {
      setAmount('1');
    }
  }, [prevOpen, open]);

  const amountOptions = Array(10)
    .fill(0)
    .map((_, idx: number) => (
      <option key={idx} value={idx + 1}>
        {idx + 1}
      </option>
    ));

  const content = (
    <Grid container className={classes.productContainer}>
      <Grid
        container
        item
        xs={12}
        sm={6}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className={classes.image}
        />
      </Grid>
      <Grid
        container
        item
        xs={12}
        sm={6}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        className={classes.infoContainer}
      >
        <Typography
          component="h2"
          variant="h5"
          className={classes.title}
          color="textPrimary"
        >
          {product.name}
        </Typography>
        <Typography
          component="h2"
          variant="h5"
          className={classes.title}
          color="textSecondary"
        >
          $ {commaFormat(product.price)}
        </Typography>

        {/*<FormControl variant="outlined">
              <InputLabel>Amount</InputLabel>
              <Select
                native
                value={amount}
                onChange={handleChange}
                inputProps={{
                  name: 'amount',
                }}
              >
                {amountOptions}
              </Select>
            </FormControl>*/}
        <FormControl variant="outlined" className={classes.amountFormControl}>
          <InputLabel htmlFor="outlined-amount-native-simple">
            Amount
          </InputLabel>
          <Select
            native
            value={amount}
            onChange={handleChange}
            label="Amount"
            inputProps={{
              name: 'amount',
              id: 'outlined-amount-native-simple',
            }}
          >
            {amountOptions}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          startIcon={<ShoppingCartIcon />}
          onClick={handleClickAddToCart}
        >
          Add to cart
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <Modal
      open={open || (open && !!isAddingItem)}
      onClose={handleCloseModal}
      className={classes.modal}
    >
      <div className={classes.paper}>
        {!isAddingItem && content}
        {isAddingItem && <CircularProgress className={classes.loading} />}
      </div>
    </Modal>
  );
}

SingleProductModal.propTypes = {
  open: PropTypes.bool,
  product: PropTypes.object.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  handleAddProduct: PropTypes.func.isRequired,
  isAddingItem: PropTypes.bool,
};
