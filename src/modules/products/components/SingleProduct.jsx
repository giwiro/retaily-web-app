// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Hidden from '@material-ui/core/Hidden';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {commaFormat} from '../../../utils/number';

import type {Product} from '../../../entities';

type Props = {
  product: Product,
};

export const useStyles = makeStyles(theme => ({
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    backgroundSize: 'contain',
  },
  titleSmall: {
    height: `64px!important`,
  },
  title: {
    fontWeight: 600,
    height: 48,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardActions: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  price: {
    fontWeight: 600,
  },
  addProduct: {
    '&:hover': {
      color: theme.palette.secondary.main,
    },
  },
}));

export default function SingleProduct(props: Props) {
  const {product} = props;
  const classes = useStyles();

  return (
    <Card>
      <CardActionArea>
        <CardMedia
          image={product.imageUrl}
          className={classes.media}
          title={product.name}
        />
        <CardContent>
          <Hidden smDown>
            <Typography
              component="h6"
              variant="body1"
              color="primary"
              className={classes.title}
            >
              {product.name}
            </Typography>
          </Hidden>
          <Hidden mdUp>
            <Typography
              component="h6"
              variant="h6"
              color="primary"
              className={`${classes.title} ${classes.titleSmall}`}
            >
              {product.name}
            </Typography>
          </Hidden>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.cardActions}>
        <Typography
          component="p"
          variant="body2"
          color="textSecondary"
          className={classes.price}
        >
          $ {commaFormat(product.price)}
        </Typography>
        <IconButton className={classes.addProduct}>
          <ShoppingCartIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

SingleProduct.propTypes = {
  product: PropTypes.object.isRequired,
};
