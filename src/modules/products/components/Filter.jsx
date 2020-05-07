// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import {makeStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Slider from '@material-ui/core/Slider';
import {commaFormat} from '../../../utils/number';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';

import type {ProductCategory} from '../../../entities';

type Props = {|
  categories?: ProductCategory[],
  category?: string,
  handleChangeCategory: (event: Event) => void,
  price?: number,
  handleChangePrice: (event: Event, newValue: number) => void,
  sort?: string,
  handleChangeSort: (newValue: string) => void,
|};

export type ProductsSortValueType = $Keys<PRODUCTS_SORT_VALUES>;

export const PRODUCTS_SORT_VALUES = Object.freeze({
  PRICE_ASC: {
    value: 'PRICE_ASC',
    label: 'Price: low to high',
  },
  PRICE_DESC: {
    value: 'PRICE_DESC',
    label: 'Price: high to low',
  },
});

export const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 600,
  },
  hr: {
    width: '100%',
    margin: `${theme.spacing(1)}px 0 ${theme.spacing(2)}px`,
  },
  filterSection: {
    padding: `0 ${theme.spacing(2)}px`,
    marginBottom: theme.spacing(3),
  },
  slider: {
    width: '90%',
    marginTop: theme.spacing(2),
  },
  linkContainer: {
    margin: `${theme.spacing(1)}px 0`,
  },
  sortLink: {
    textDecoration: 'none!important',
    cursor: 'pointer',
    color: theme.palette.text.secondary,
  },
  sortLinkActive: {
    color: theme.palette.primary['500'],
    fontWeight: 500,
  },
}));

const MIN_PRICE = 0;
const MAX_PRICE = 990;
const PRICE_STEP = 20;

function FilterTitle(props: {children: any}) {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h6" align="left" className={classes.title}>
        {props.children}
      </Typography>
      <Divider className={classes.hr} />
    </>
  );
}

function FilterSection(props: {children: any}) {
  const classes = useStyles();
  return (
    <Grid
      container
      item
      xs={12}
      sm={6}
      md={12}
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
      className={classes.filterSection}
    >
      {props.children}
    </Grid>
  );
}

export default function ProductsFilter(props: Props) {
  const classes = useStyles();
  const {
    categories,
    category,
    handleChangeCategory,
    price,
    handleChangePrice,
    sort,
    handleChangeSort,
  } = props;

  const _handleChangeSort = (event: Event, newValue: string) => {
    event.preventDefault();
    console.log('newValue', newValue);
    handleChangeSort(newValue);
  };

  const sortSection = (
    <FilterSection>
      <FilterTitle>Order by</FilterTitle>
      <Grid container>
        {Object.keys(PRODUCTS_SORT_VALUES).map(
          (value: ProductsSortValueType, idx: number) => {
            const sv = PRODUCTS_SORT_VALUES[value];
            return (
              <Grid
                key={idx}
                container
                item
                xs={12}
                direction="row"
                justify="flex-start"
                alignItems="center"
                className={classes.linkContainer}
              >
                <Link
                  href=""
                  onClick={(event: Event) => _handleChangeSort(event, sv.value)}
                  className={`${classes.sortLink} ${
                    sv.value === sort ? classes.sortLinkActive : ''
                  }`}
                >
                  {sv.label}
                </Link>
              </Grid>
            );
          }
        )}
      </Grid>
    </FilterSection>
  );

  const categorySection = (
    <FilterSection>
      <FilterTitle>Category</FilterTitle>
      <FormControl component="fieldset">
        {categories && (
          <RadioGroup
            aria-label="category"
            name="category"
            value={category}
            onChange={handleChangeCategory}
          >
            {categories.map((c: ProductCategory, idx: number) => (
              <FormControlLabel
                value={`${c.id}`}
                key={idx}
                control={<Radio color="primary" />}
                label={c.name}
              />
            ))}
          </RadioGroup>
        )}
      </FormControl>
    </FilterSection>
  );

  const priceMarks = [
    {
      value: MIN_PRICE,
      label: `$ ${commaFormat(MIN_PRICE, 0)}`,
    },
    {
      value: MAX_PRICE,
      label: `$ ${commaFormat(MAX_PRICE, 0)}`,
    },
  ];

  const priceSection = (
    <FilterSection>
      <FilterTitle>Price</FilterTitle>
      <Grid
        container
        item
        xs={12}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Slider
          defaultValue={10000}
          value={price}
          onChange={handleChangePrice}
          aria-labelledby="price-slider"
          valueLabelDisplay="auto"
          valueLabelFormat={(x: number) => `$${commaFormat(x, 0)}`}
          step={PRICE_STEP}
          marks={priceMarks}
          min={MIN_PRICE}
          max={MAX_PRICE}
          className={classes.slider}
        />
      </Grid>
    </FilterSection>
  );

  const ratingSection = <FilterSection />;

  return (
    <>
      {sortSection}
      {categorySection}
      {priceSection}
      {ratingSection}
    </>
  );
}

ProductsFilter.propTypes = {
  categories: PropTypes.array,
  category: PropTypes.string,
  handleChangeCategory: PropTypes.func.isRequired,
  price: PropTypes.number,
  handleChangePrice: PropTypes.func.isRequired,
  sort: PropTypes.string,
  handleChangeSort: PropTypes.func.isRequired,
};
